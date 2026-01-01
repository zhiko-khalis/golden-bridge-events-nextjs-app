'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { TicketSale, SalesReport } from '../types/sales';
import { Ticket } from '../types/concert';

interface SalesContextType {
  sales: TicketSale[];
  addSale: (sale: TicketSale) => Promise<void>;
  deleteTicket: (saleId: string, ticketId: string) => Promise<void>;
  getSalesReport: () => SalesReport;
  getSalesByLocation: (location: string) => TicketSale[];
  refreshSales: () => Promise<void>;
  clearSales: () => Promise<void>;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<TicketSale[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Load sales from API on mount
  useEffect(() => {
    const loadSales = async () => {
      try {
        const response = await fetch('/api/sales');
        if (response.ok) {
          const data = await response.json();
          setSales(data.sales || []);
        }
      } catch (error) {
        console.error('Error loading sales:', error);
      }
    };

    loadSales();
  }, []);

  // Set up Server-Sent Events for real-time updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/realtime');
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          // Connection opened successfully - no action needed
        };

        eventSource.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            if (message.event === 'salesUpdated' && message.data?.sales) {
              setSales(message.data.sales);
            } else if (message.event === 'seatsCleared') {
              // Seats cleared, but sales remain - this is handled by SeatSelection component
            } else if (message.event === 'connected' || message.event === 'heartbeat') {
              // Connection established or heartbeat - no action needed
            }
          } catch (error) {
            console.error('Error parsing SSE message:', error);
          }
        };

        eventSource.onerror = () => {
          // Only handle actual connection errors
          if (eventSource?.readyState === EventSource.CLOSED) {
            // Connection closed, attempt to reconnect
            if (reconnectTimeout) {
              clearTimeout(reconnectTimeout);
            }
            reconnectTimeout = setTimeout(() => {
              if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
                connectSSE();
              }
            }, 3000);
          }
        };
      } catch (error) {
        console.error('Error setting up SSE connection:', error);
      }
    };

    connectSSE();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (eventSource) {
        eventSource.close();
      }
      eventSourceRef.current = null;
    };
  }, []);

  const addSale = useCallback(async (sale: TicketSale) => {
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sale),
      });

      if (response.ok) {
        // The SSE connection will automatically update the sales state
        // But we can also refresh immediately for faster UI update
        const data = await fetch('/api/sales');
        if (data.ok) {
          const salesData = await data.json();
          setSales(salesData.sales || []);
        }
      } else if (response.status === 409) {
        // Sale already exists - this is fine, just refresh
        await refreshSales();
      } else {
        console.error('Error adding sale:', await response.text());
      }
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  }, []);

  const refreshSales = useCallback(async () => {
    try {
      const response = await fetch('/api/sales');
      if (response.ok) {
        const data = await response.json();
        setSales(data.sales || []);
      }
    } catch (error) {
      console.error('Error refreshing sales:', error);
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

  const deleteTicket = useCallback(async (saleId: string, ticketId: string) => {
    try {
      const response = await fetch('/api/sales', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ saleId, ticketId }),
      });

      if (response.ok) {
        // The SSE connection will automatically update the sales state
        // But we can also refresh immediately for faster UI update
        const data = await fetch('/api/sales');
        if (data.ok) {
          const salesData = await data.json();
          setSales(salesData.sales || []);
        }
      } else {
        const errorText = await response.text();
        console.error('Error deleting ticket:', errorText);
        throw new Error(errorText || 'Failed to delete ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }, []);

  const clearSales = useCallback(async () => {
    try {
      const response = await fetch('/api/sales', {
        method: 'DELETE',
      });

      if (response.ok) {
        setSales([]);
        // The SSE connection will notify about seats being cleared
      } else {
        console.error('Error clearing sales:', await response.text());
      }
    } catch (error) {
      console.error('Error clearing sales:', error);
    }
  }, []);

  return (
    <SalesContext.Provider
      value={{
        sales,
        addSale,
        deleteTicket,
        getSalesReport,
        getSalesByLocation,
        refreshSales,
        clearSales
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

