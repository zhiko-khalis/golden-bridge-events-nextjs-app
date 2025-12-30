'use client';

import { useState } from 'react';
import { Concert, SelectedTicket, TicketType } from '../types/concert';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface TicketSelectionProps {
  concert: Concert;
  onBack: () => void;
  onContinue: (selectedTickets: SelectedTicket[]) => void;
}

export function TicketSelection({ concert, onBack, onContinue }: TicketSelectionProps) {
  const { isAdmin } = useAuth();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showComingSoon, setShowComingSoon] = useState(false);

  const updateQuantity = (ticketId: string, change: number) => {
    setQuantities(prev => {
      const current = prev[ticketId] || 0;
      const newValue = Math.max(0, Math.min(10, current + change));
      
      if (newValue === 0) {
        const { [ticketId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [ticketId]: newValue };
    });
  };

  const selectedTickets: SelectedTicket[] = Object.entries(quantities)
    .map(([ticketId, quantity]) => {
      const ticketType = concert.ticketTypes.find(t => t.id === ticketId);
      if (!ticketType) return null;
      return { ticketType, quantity };
    })
    .filter((item): item is SelectedTicket => item !== null);

  const totalTickets = selectedTickets.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedTickets.reduce((sum, item) => 
    sum + (item.ticketType.price * item.quantity), 0
  );

  const handleContinue = () => {
    if (selectedTickets.length > 0) {
      // If user is not admin, show "Coming soon" message
      if (!isAdmin) {
        setShowComingSoon(true);
        return;
      }
      // Admin users can proceed normally
      onContinue(selectedTickets);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
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

      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Concert Summary */}
        <div className="mb-8">
          <h1 className="mb-2">Select Tickets</h1>
          <h2 className="text-muted-foreground">{concert.name}</h2>
          <p className="text-muted-foreground">{concert.artist}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ticket Options */}
          <div className="lg:col-span-2 space-y-4">
            {concert.ticketTypes.map(ticket => {
              const quantity = quantities[ticket.id] || 0;
              
              return (
                <Card key={ticket.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="mb-1">{ticket.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {ticket.description}
                        </p>
                        <div className="flex items-baseline gap-3">
                          <p className="font-semibold text-xl">{ticket.price.toLocaleString()} IQD</p>
                          <p className="text-sm text-muted-foreground">
                            {ticket.available} available
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(ticket.id, -1)}
                          disabled={quantity === 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="w-12 text-center font-semibold">
                          {quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(ticket.id, 1)}
                          disabled={quantity >= 10 || quantity >= ticket.available}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="mb-4">Order Summary</h3>
                
                {selectedTickets.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-6 pb-6 border-b">
                      {selectedTickets.map(item => (
                        <div key={item.ticketType.id} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <p className="font-medium">{item.ticketType.name}</p>
                            <p className="text-muted-foreground">
                              {item.quantity} × {item.ticketType.price.toLocaleString()} IQD
                            </p>
                          </div>
                          <p className="font-medium">
                            {(item.ticketType.price * item.quantity).toLocaleString()} IQD
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between">
                        <p className="text-muted-foreground">Subtotal</p>
                        <p className="font-medium">{totalPrice.toLocaleString()} IQD</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-muted-foreground">Service Fee</p>
                        <p className="font-medium">{(0).toFixed(2)} IQD</p>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <p className="font-semibold">Total</p>
                        <p className="font-semibold text-xl">
                          {totalPrice.toLocaleString()} IQD
                        </p>
                      </div>
                    </div>

                    <Button 
                      onClick={handleContinue} 
                      className="w-full gap-2"
                      size="lg"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Continue ({totalTickets} ticket{totalTickets !== 1 ? 's' : ''})
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Select tickets to continue
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Coming Soon Dialog */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon</DialogTitle>
            <DialogDescription>
              Online booking is currently unavailable while we prepare our database. 
              Please check back soon!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
