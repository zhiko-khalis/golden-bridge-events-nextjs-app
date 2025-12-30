'use client';

import { useState, useMemo, useEffect } from 'react';
import { Concert, SelectedSeat, Seat, TicketType, VenueLayout } from '../types/concert';
import { getVenueLayout } from '../data/venueLayouts';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, ShoppingCart, X, Info } from 'lucide-react';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface SeatSelectionProps {
  concert: Concert;
  onBack: () => void;
  onContinue: (selectedSeats: SelectedSeat[]) => void;
}

// Get reserved seats from sessionStorage (in a real app, this would be from a backend/API)
// Seats are stored per venue to avoid conflicts
function getReservedSeats(layout: VenueLayout): Set<string> {
  const reserved = new Set<string>();
  const storageKey = `reservedSeats_${layout.venueId}`;
  
  // Get from sessionStorage if available
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      try {
        const seatIds = JSON.parse(stored);
        seatIds.forEach((id: string) => reserved.add(id));
      } catch (e) {
        console.error('Error parsing reserved seats:', e);
      }
    }
  }
  
  return reserved;
}

export function SeatSelection({ concert, onBack, onContinue }: SeatSelectionProps) {
  const { isAdmin } = useAuth();
  const venueLayout = useMemo(() => getVenueLayout(concert.venue), [concert.venue]);
  const [selectedSeats, setSelectedSeats] = useState<Map<string, Seat>>(new Map());
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [reservedSeats, setReservedSeats] = useState<Set<string>>(new Set());

  // Initialize reserved seats on mount and update when layout changes
  useEffect(() => {
    setReservedSeats(getReservedSeats(venueLayout));
  }, [venueLayout]);

  // Listen for storage changes and custom events to update reserved seats in real-time
  useEffect(() => {
    const storageKey = `reservedSeats_${venueLayout.venueId}`;
    
    const handleStorageChange = () => {
      setReservedSeats(getReservedSeats(venueLayout));
    };

    const handleSeatsReserved = (event: CustomEvent) => {
      // Only update if the reservation is for this venue
      if (event.detail?.venueId === venueLayout.venueId) {
        setReservedSeats(getReservedSeats(venueLayout));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('seatsReserved', handleSeatsReserved as EventListener);
    // Also check periodically for changes (since storage event only fires in other tabs)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('seatsReserved', handleSeatsReserved as EventListener);
      clearInterval(interval);
    };
  }, [venueLayout]);

  // Generate seat object from seat ID
  const getSeatFromId = (seatId: string): Seat => {
    const [blockId, row, number] = seatId.split('-');
    const block = venueLayout.blocks.find(b => b.id === blockId);
    const price = block?.price || 0;
    const isReserved = reservedSeats.has(seatId);
    
    return {
      id: seatId,
      block: blockId,
      row: row,
      number: parseInt(number),
      price: price,
      isAvailable: !isReserved,
      isReserved: isReserved
    };
  };

  // Handle seat click
  const handleSeatClick = (seatId: string) => {
    const seat = getSeatFromId(seatId);
    
    // Admins can select reserved seats, regular users cannot
    if (!isAdmin && (!seat.isAvailable || seat.isReserved)) {
      return; // Can't select unavailable or reserved seats
    }

    setSelectedSeats(prev => {
      const newMap = new Map(prev);
      if (newMap.has(seatId)) {
        newMap.delete(seatId);
      } else {
        newMap.set(seatId, seat);
      }
      return newMap;
    });
  };

  // Get ticket type for a seat based on tier
  const getTicketTypeForSeat = (seat: Seat): TicketType => {
    const block = venueLayout.blocks.find(b => b.id === seat.block);
    const tier = block?.tier || 'main';
    
    // Map tier to ticket type
    const ticketTypeMap: Record<string, TicketType> = {
      'balcony': concert.ticketTypes.find(t => t.name.toLowerCase().includes('general') || t.name.toLowerCase().includes('balcony')) || concert.ticketTypes[0],
      'main': concert.ticketTypes.find(t => t.name.toLowerCase().includes('vip') || t.name.toLowerCase().includes('orchestra')) || concert.ticketTypes[1] || concert.ticketTypes[0],
      'ground': concert.ticketTypes.find(t => t.name.toLowerCase().includes('backstage') || t.name.toLowerCase().includes('premium')) || concert.ticketTypes[concert.ticketTypes.length - 1] || concert.ticketTypes[0]
    };

    return ticketTypeMap[tier] || concert.ticketTypes[0];
  };

  // Convert selected seats to SelectedSeat format
  const getSelectedSeatsData = (): SelectedSeat[] => {
    return Array.from(selectedSeats.values()).map(seat => ({
      seat,
      ticketType: getTicketTypeForSeat(seat)
    }));
  };

  const handleContinue = () => {
    const seatsData = getSelectedSeatsData();
    if (seatsData.length > 0) {
      onContinue(seatsData);
    }
  };

  const totalPrice = Array.from(selectedSeats.values()).reduce((sum, seat) => sum + seat.price, 0);
  const serviceFee = 0;
  const total = totalPrice;

  // Render a single seat
  const renderSeat = (blockId: string, row: string, seatNumber: number) => {
    const seatId = `${blockId}-${row}-${seatNumber}`;
    const seat = getSeatFromId(seatId);
    const isSelected = selectedSeats.has(seatId);
    const isHovered = hoveredSeat?.id === seatId;

    let seatColor = 'bg-green-500 hover:bg-green-600 text-white'; // Available - green by default
    if (seat.isReserved || !seat.isAvailable) {
      // Admins can still select reserved seats, so show different color
      seatColor = isAdmin 
        ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer' // Reserved but selectable for admin
        : 'bg-red-500 cursor-not-allowed text-white'; // Reserved - red for regular users
    } else if (isSelected) {
      seatColor = 'bg-blue-500 hover:bg-blue-600 text-white'; // Selected - blue
    } else if (isHovered) {
      seatColor = 'bg-green-400 hover:bg-green-500 text-white'; // Hovered - lighter green
    }

    const seatTitle = isAdmin
      ? `${blockId} ${row} ${seatNumber} - ${seat.price.toLocaleString()} IQD${seat.isReserved ? ' (RESERVED - Admin Override)' : ''} | Type: ${getTicketTypeForSeat(seat).name}`
      : `${blockId} ${row} ${seatNumber} - ${seat.price.toLocaleString()} IQD`;

    const seatButton = (
      <button
        key={seatId}
        className={`w-[16px] h-[16px] rounded text-xs font-medium transition-colors ${seatColor} ${
          (!isAdmin && (seat.isReserved || !seat.isAvailable)) ? '' : 'cursor-pointer'
        }`}
        onClick={() => handleSeatClick(seatId)}
        onMouseEnter={() => setHoveredSeat(seat)}
        onMouseLeave={() => setHoveredSeat(null)}
        disabled={!isAdmin && (seat.isReserved || !seat.isAvailable)}
        title={seatTitle}
      >
        {seatNumber}
      </button>
    );

    if (isAdmin) {
      return (
        <Tooltip key={seatId}>
          <TooltipTrigger asChild>
            {seatButton}
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 text-xs">
              <p className="font-semibold">Seat Details (Admin View)</p>
              <p>Block: {blockId} | Row: {row} | Number: {seatNumber}</p>
              <p>Price: {seat.price.toLocaleString()} IQD</p>
              <p>Status: {seat.isReserved ? 'Reserved' : 'Available'}</p>
              <p>Ticket Type: {getTicketTypeForSeat(seat).name}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }

    return seatButton;
  };

  // Render a block
  const renderBlock = (block: typeof venueLayout.blocks[0]) => {
    return (
      <div key={block.id} className="mb-8 text-center">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{block.name}</h3>
          <p className="text-sm text-muted-foreground">
            {block.totalSeats} seats • {block.tier} tier • {block.price.toLocaleString()} IQD
          </p>
        </div>
        <div className="space-y-2">
          {block.rows.map(row => {
            const seatsInRow = block.seatsPerRow[row] || 0;
            return (
              <div key={`${block.id}-${row}`} className="flex items-center">
                <span className="w-8 text-sm font-medium text-muted-foreground">{row}</span>
                <div className="flex gap-1 flex-wrap justify-center flex-1">
                  {Array.from({ length: seatsInRow }, (_, i) => 
                    renderSeat(block.id, row, i + 1)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className=" px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      <div className={` px-4 py-4 ${selectedSeats.size > 0 ? 'pb-32' : ''}`}>
        {/* Concert Summary */}
        <div className="mb-8 text-center">
          <h1 className="mb-2">Select Your Seats</h1>
          <h2 className="text-muted-foreground">{concert.name}</h2>
          <p className="text-muted-foreground">{concert.venue} • {concert.date} at {concert.time}</p>
        </div>

        {/* Seating Map - Full Width */}
        <Card>
          <CardContent className="p-6">
            {/* Stage */}
            <div className="mb-8 text-center">
              <div className="bg-gray-800 text-white py-4 rounded-lg">
                <p className="font-semibold">STAGE</p>
              </div>
            </div>

            {/* Legend */}
            <div className="mb-6 flex flex-wrap gap-4 text-sm justify-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-500"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-500"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-500"></div>
                <span>Reserved {isAdmin ? '(Admin can override)' : ''}</span>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-orange-500"></div>
                  <span>Reserved (Admin Override)</span>
                </div>
              )}
            </div>

            {/* Venue Name */}
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold">{venueLayout.venueName}</h3>
              <p className="text-sm text-muted-foreground">
                Total Seats: {venueLayout.totalSeats}
              </p>
            </div>

            {/* Seating Blocks */}
            <div className="space-y-8">
              {venueLayout.venueId === 'default' ? (
                <>
                  {/* Standard Venue Sections with grid-cols-2 */}
                  {/* Front Level - Standard Venue */}
                  <div>
                    <h4 className="text-md font-semibold mb-4 text-center">Front Level</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {venueLayout.blocks.filter(b => b.tier === 'balcony').map(renderBlock)}
                    </div>
                  </div>

                  {/* Middle Level - Standard Venue */}
                  <div>
                    <h4 className="text-md font-semibold mb-4 text-center">Middle Level</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {venueLayout.blocks.filter(b => b.tier === 'main').map(renderBlock)}
                    </div>
                  </div>

                  {/* Upper Level - Standard Venue */}
                  <div>
                    <h4 className="text-md font-semibold mb-4 text-center">Upper Level (Balcony)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {venueLayout.blocks.filter(b => b.tier === 'ground').map(renderBlock)}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Top Tier (Balcony) */}
                  <div>
                    <h4 className="text-md font-semibold mb-4 text-center">Front Level</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {venueLayout.blocks.filter(b => b.tier === 'balcony').map(renderBlock)}
                    </div>
                  </div>

                  {/* Middle Tier (Main Floor) */}
                  <div>
                    <h4 className="text-md font-semibold mb-4 text-center">Middle Level</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {venueLayout.blocks.filter(b => b.tier === 'main').map(renderBlock)}
                    </div>
                  </div>

                  {/*Upper Level */}
                  <div>
                    <h4 className="text-md font-semibold mb-4 text-center">Upper Level (Balcony)</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {venueLayout.blocks.filter(b => b.tier === 'ground').map(renderBlock)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Order Summary - Appears when seats are selected */}
        {selectedSeats.size > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 animate-in slide-in-from-bottom duration-300">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                    {/* Selected Seats List */}
                    <div className="flex-1 w-full lg:w-auto">
                      <h3 className="text-lg font-semibold mb-4">Selected Seats</h3>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {Array.from(selectedSeats.values()).map(seat => (
                          <div key={seat.id} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <p className="font-medium">
                                Block {seat.block} {seat.row} {seat.number}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {getTicketTypeForSeat(seat).name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{seat.price.toLocaleString()} IQD</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  const newMap = new Map(selectedSeats);
                                  newMap.delete(seat.id);
                                  setSelectedSeats(newMap);
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="shrink-0 w-full lg:w-auto lg:min-w-[200px]">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Subtotal</p>
                          <p className="font-medium">{totalPrice.toLocaleString()} IQD</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Service Fee</p>
                          <p className="font-medium">{serviceFee.toLocaleString()} IQD</p>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <p className="font-semibold">Total</p>
                          <p className="font-semibold text-xl">
                            {total.toLocaleString()} IQD
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleContinue} 
                        className="w-full gap-2"
                        size="lg"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Continue ({selectedSeats.size} seat{selectedSeats.size !== 1 ? 's' : ''})
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

