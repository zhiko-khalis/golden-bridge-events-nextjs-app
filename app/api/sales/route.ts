import { NextRequest, NextResponse } from 'next/server';
import { TicketSale } from '@/app/types/sales';
import { notifyClients } from '../sse-manager';
import { loadSales, saveSales, loadReservedSeats, saveReservedSeats } from '../persistence';
import { resetReservedSeatsStore } from '../reserved-seats/route';
import { getVenueLayout } from '@/app/data/venueLayouts';

// In-memory store for sales (loaded from file)
let salesStore: TicketSale[] = [];
let isInitialized = false;

// Initialize sales store from file
async function initializeSales() {
  if (!isInitialized) {
    salesStore = await loadSales();
    isInitialized = true;
  }
}

// GET: Retrieve all sales
export async function GET(request: NextRequest) {
  await initializeSales();
  return NextResponse.json({ sales: salesStore });
}

// POST: Add a new sale
export async function POST(request: NextRequest) {
  try {
    await initializeSales();
    const sale: TicketSale = await request.json();

    // Validate required fields
    if (!sale.id || !sale.tickets || !sale.concertId) {
      return NextResponse.json(
        { error: 'Invalid sale data' },
        { status: 400 }
      );
    }

    // Check for duplicates
    const existingSale = salesStore.find(s => 
      s.id === sale.id || 
      (s.bookingReference === sale.bookingReference && 
       s.saleDate === sale.saleDate &&
       s.adminId === sale.adminId)
    );

    if (existingSale) {
      return NextResponse.json(
        { error: 'Sale already exists' },
        { status: 409 }
      );
    }

    salesStore.push(sale);
    
    // Save to file
    await saveSales(salesStore);

    // Notify all connected clients via SSE
    notifyClients('salesUpdated', { sales: salesStore });

    return NextResponse.json({ success: true, sale });
  } catch (error) {
    console.error('Error in POST /api/sales:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// PATCH: Delete a specific ticket from a sale
export async function PATCH(request: NextRequest) {
  try {
    await initializeSales();
    const body = await request.json();
    const { saleId, ticketId } = body;

    if (!saleId || !ticketId) {
      return NextResponse.json(
        { error: 'saleId and ticketId are required' },
        { status: 400 }
      );
    }

    // Find the sale
    const saleIndex = salesStore.findIndex(s => s.id === saleId);
    if (saleIndex === -1) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    const sale = salesStore[saleIndex];
    
    // Find the ticket
    const ticketIndex = sale.tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    const ticket = sale.tickets[ticketIndex];
    const ticketPrice = ticket.price;
    const seatId = ticket.seat?.id;

    // Remove the ticket from the sale
    sale.tickets.splice(ticketIndex, 1);
    
    // Update the total amount
    sale.totalAmount -= ticketPrice;

    // Track if sale will be removed
    const saleWillBeRemoved = sale.tickets.length === 0;
    
    // If no tickets remain, remove the entire sale
    if (saleWillBeRemoved) {
      salesStore.splice(saleIndex, 1);
    }

    // If the ticket has a seat, remove it from reserved seats
    if (seatId && ticket.concert) {
      try {
        const venueLayout = getVenueLayout(ticket.concert.venue);
        const venueId = venueLayout.venueId;
        
        const reservedSeatsStore = await loadReservedSeats();
        if (reservedSeatsStore[venueId]) {
          const seatIndex = reservedSeatsStore[venueId].indexOf(seatId);
          if (seatIndex !== -1) {
            reservedSeatsStore[venueId].splice(seatIndex, 1);
            
            // If no seats remain for this venue, remove the venue entry
            if (reservedSeatsStore[venueId].length === 0) {
              delete reservedSeatsStore[venueId];
            }
            
            await saveReservedSeats(reservedSeatsStore);
            
            // Notify clients about seat being freed
            notifyClients('seatFreed', { venueId, seatId });
          }
        }
      } catch (error) {
        console.error('Error freeing seat:', error);
        // Continue even if seat freeing fails
      }
    }

    // Save updated sales to file
    await saveSales(salesStore);

    // Notify all connected clients via SSE
    notifyClients('salesUpdated', { sales: salesStore });

    return NextResponse.json({ 
      success: true, 
      sale: saleWillBeRemoved ? null : sale,
      deletedTicket: ticket
    });
  } catch (error) {
    console.error('Error in PATCH /api/sales:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE: Clear all sales and reserved seats
export async function DELETE(request: NextRequest) {
  await initializeSales();
  salesStore = [];
  
  // Save cleared sales to file
  await saveSales(salesStore);
  
  // Also clear all reserved seats
  const reservedSeatsStore = await loadReservedSeats();
  Object.keys(reservedSeatsStore).forEach(key => {
    delete reservedSeatsStore[key];
  });
  await saveReservedSeats(reservedSeatsStore);
  
  // Reset the in-memory store in reserved-seats route so it reloads from file
  resetReservedSeatsStore();
  
  // Notify all connected clients
  notifyClients('salesUpdated', { sales: [] });
  notifyClients('seatsCleared', { all: true });

  return NextResponse.json({ success: true });
}

