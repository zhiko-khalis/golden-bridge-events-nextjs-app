'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { TicketSale, SalesReport } from '../types/sales';
import { Ticket } from '../types/concert';

interface SalesContextType {
  sales: TicketSale[];
  addSale: (sale: TicketSale) => void;
  getSalesReport: () => SalesReport;
  getSalesByLocation: (location: string) => TicketSale[];
  refreshSales: () => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

const STORAGE_KEY = 'ticketSales';

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<TicketSale[]>([]);

  // Load sales from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedSales = JSON.parse(stored);
          // Remove duplicates based on id, saleDate, bookingReference, and adminId combination
          const uniqueSales = parsedSales.filter((sale: TicketSale, index: number, self: TicketSale[]) => 
            index === self.findIndex((s: TicketSale) => 
              s.id === sale.id || 
              (s.bookingReference === sale.bookingReference && 
               s.saleDate === sale.saleDate &&
               s.adminId === sale.adminId &&
               Math.abs(new Date(s.saleDate).getTime() - new Date(sale.saleDate).getTime()) < 1000)
            )
          );
          // If duplicates were found, update localStorage
          if (uniqueSales.length !== parsedSales.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueSales));
          }
          setSales(uniqueSales);
        } catch (e) {
          console.error('Error parsing sales data:', e);
        }
      }
    }
  }, []);

  // Listen for storage changes (real-time updates across tabs)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsedSales = JSON.parse(e.newValue);
            setSales(parsedSales);
          } catch (error) {
            console.error('Error parsing sales from storage:', error);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Listen for custom events (real-time updates in same tab)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleSalesUpdate = (event: CustomEvent) => {
        if (event.detail?.sales) {
          setSales(prev => {
            // Only update if the new sales array is different (prevents duplicates)
            const newSales = event.detail.sales;
            // Check if arrays are actually different
            if (prev.length !== newSales.length) {
              return newSales;
            }
            // Check if any sale IDs are different
            const prevIds = new Set(prev.map(s => s.id));
            const newIds = new Set(newSales.map(s => s.id));
            if (prevIds.size !== newIds.size || 
                !Array.from(prevIds).every(id => newIds.has(id))) {
              return newSales;
            }
            // Arrays are the same, don't update
            return prev;
          });
        }
      };

      window.addEventListener('salesUpdated', handleSalesUpdate as EventListener);
      return () => window.removeEventListener('salesUpdated', handleSalesUpdate as EventListener);
    }
  }, []);

  const addSale = useCallback((sale: TicketSale) => {
    setSales(prev => {
      // Check if sale already exists to prevent duplicates
      const existingSale = prev.find(s => 
        s.id === sale.id || 
        (s.bookingReference === sale.bookingReference && 
         s.saleDate === sale.saleDate &&
         s.adminId === sale.adminId)
      );
      
      if (existingSale) {
        return prev; // Sale already exists, don't add duplicate
      }
      
      const newSales = [...prev, sale];
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSales));
        
        // Dispatch custom event for real-time updates (only for cross-component communication)
        // Use a small delay to ensure state is updated first
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('salesUpdated', {
            detail: { sales: newSales }
          }));
        }, 0);
      }
      
      return newSales;
    });
  }, []);

  const refreshSales = useCallback(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedSales = JSON.parse(stored);
          setSales(parsedSales);
        } catch (e) {
          console.error('Error parsing sales data:', e);
        }
      }
    }
  }, []);

  const getSalesByLocation = useCallback((location: string): TicketSale[] => {
    return sales.filter(sale => sale.adminLocation === location);
  }, [sales]);

  const getSalesReport = useCallback((): SalesReport => {
    const salesByLocation: Record<string, { count: number; revenue: number; sales: TicketSale[] }> = {};
    const salesByConcert: Record<string, { count: number; revenue: number; sales: TicketSale[] }> = {};

    let totalSales = 0;
    let totalRevenue = 0;

    sales.forEach(sale => {
      totalSales += sale.tickets.length;
      totalRevenue += sale.totalAmount;

      // Group by location
      if (!salesByLocation[sale.adminLocation]) {
        salesByLocation[sale.adminLocation] = {
          count: 0,
          revenue: 0,
          sales: []
        };
      }
      salesByLocation[sale.adminLocation].count += sale.tickets.length;
      salesByLocation[sale.adminLocation].revenue += sale.totalAmount;
      salesByLocation[sale.adminLocation].sales.push(sale);

      // Group by concert
      if (!salesByConcert[sale.concertId]) {
        salesByConcert[sale.concertId] = {
          count: 0,
          revenue: 0,
          sales: []
        };
      }
      salesByConcert[sale.concertId].count += sale.tickets.length;
      salesByConcert[sale.concertId].revenue += sale.totalAmount;
      salesByConcert[sale.concertId].sales.push(sale);
    });

    return {
      totalSales,
      totalRevenue,
      salesByLocation,
      salesByConcert,
      allSales: sales
    };
  }, [sales]);

  return (
    <SalesContext.Provider
      value={{
        sales,
        addSale,
        getSalesReport,
        getSalesByLocation,
        refreshSales
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
}

