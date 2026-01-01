import { NextRequest, NextResponse } from 'next/server';
import { notifyClients } from '../sse-manager';
import { loadReservedSeats, saveReservedSeats } from '../persistence';

// In-memory store for reserved seats (keyed by venueId) - loaded from file
let reservedSeatsStore: Record<string, string[]> = {};
let isInitialized = false;

// Initialize reserved seats store from file
async function initializeReservedSeats(forceReload = false) {
  if (!isInitialized || forceReload) {
    reservedSeatsStore = await loadReservedSeats();
    isInitialized = true;
  }
}

// Export function to reset the store (for use by other routes)
export function resetReservedSeatsStore() {
  isInitialized = false;
  reservedSeatsStore = {};
}

// GET: Retrieve reserved seats for a venue
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const venueId = searchParams.get('venueId');
  const forceReload = searchParams.get('forceReload') === 'true';

  if (!venueId) {
    return NextResponse.json(
      { error: 'venueId is required' },
      { status: 400 }
    );
  }

  await initializeReservedSeats(forceReload);
  const reserved = reservedSeatsStore[venueId] || [];
  return NextResponse.json({ venueId, reservedSeats: reserved });
}

// POST: Reserve seats for a venue
export async function POST(request: NextRequest) {
  try {
    await initializeReservedSeats();
    const body = await request.json();
    const { venueId, seatIds } = body;

    if (!venueId || !Array.isArray(seatIds)) {
      return NextResponse.json(
        { error: 'venueId and seatIds array are required' },
        { status: 400 }
      );
    }

    // Initialize if doesn't exist
    if (!reservedSeatsStore[venueId]) {
      reservedSeatsStore[venueId] = [];
    }

    // Add new seat IDs (avoid duplicates)
    const currentReserved = reservedSeatsStore[venueId];
    let hasChanges = false;
    seatIds.forEach((seatId: string) => {
      if (!currentReserved.includes(seatId)) {
        currentReserved.push(seatId);
        hasChanges = true;
      }
    });

    // Save to file if there were changes
    if (hasChanges) {
      await saveReservedSeats(reservedSeatsStore);
    }

    // Notify all connected clients via SSE
    notifyClients('seatsReserved', { venueId, seatIds });

    return NextResponse.json({
      success: true,
      venueId,
      reservedSeats: currentReserved
    });
  } catch (error) {
    console.error('Error in POST /api/reserved-seats:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE: Clear reserved seats for a venue (or all venues)
export async function DELETE(request: NextRequest) {
  await initializeReservedSeats();
  const searchParams = request.nextUrl.searchParams;
  const venueId = searchParams.get('venueId');

  if (venueId) {
    // Clear specific venue
    delete reservedSeatsStore[venueId];
    notifyClients('seatsCleared', { venueId });
  } else {
    // Clear all venues
    Object.keys(reservedSeatsStore).forEach(key => {
      delete reservedSeatsStore[key];
    });
    notifyClients('seatsCleared', { all: true });
  }

  // Save to file
  await saveReservedSeats(reservedSeatsStore);

  return NextResponse.json({ success: true });
}

