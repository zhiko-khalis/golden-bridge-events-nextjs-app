import { Ticket, Concert } from './concert';

export interface TicketSale {
  id: string;
  tickets: Ticket[];
  concertId: string;
  concertName: string;
  location: string; // Location where the ticket was sold
  adminId: string;
  adminUsername: string;
  adminLocation: string;
  totalAmount: number;
  saleDate: string;
  bookingReference: string;
  paymentMethod: 'cash' | 'online';
}

export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  salesByLocation: Record<string, {
    count: number;
    revenue: number;
    sales: TicketSale[];
  }>;
  salesByConcert: Record<string, {
    count: number;
    revenue: number;
    sales: TicketSale[];
  }>;
  allSales: TicketSale[];
}

