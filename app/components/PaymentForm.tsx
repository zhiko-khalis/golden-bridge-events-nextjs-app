'use client';

import { useState } from 'react';
import { Concert, SelectedTicket, SelectedSeat, UserDetails, Ticket } from '../types/concert';
import { getVenueLayout } from '../data/venueLayouts';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, CreditCard, Lock, Ticket as TicketIcon, Calendar, MapPin, User } from 'lucide-react';
import { Badge } from './ui/badge';

interface PaymentFormProps {
  concert: Concert;
  selectedTickets: SelectedTicket[];
  selectedSeats?: SelectedSeat[];
  userDetails: UserDetails;
  tickets: Ticket[];
  onBack: () => void;
  onComplete: () => void;
}

export function PaymentForm({ 
  concert, 
  selectedTickets,
  selectedSeats = [],
  userDetails,
  tickets,
  onBack, 
  onComplete 
}: PaymentFormProps) {
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value.replace(/\D/g, '').substring(0, 16));
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value.substring(0, 5));
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    const cleanedCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cleanedCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanedCardNumber.length < 13 || cleanedCardNumber.length > 19) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      // Reserve selected seats after payment via API
      if (selectedSeats.length > 0) {
        try {
          const venueLayout = getVenueLayout(concert.venue);
          const seatIds = selectedSeats.map(s => s.seat.id);
          
          const response = await fetch('/api/reserved-seats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              venueId: venueLayout.venueId,
              seatIds: seatIds
            }),
          });

          if (!response.ok) {
            console.error('Error reserving seats:', await response.text());
          }
          // Real-time updates will be handled via SSE
        } catch (error) {
          console.error('Error reserving seats:', error);
        }
      }
      
      setProcessing(false);
      onComplete();
    }, 2000);
  };

  // Calculate total price: use seat prices if seats are selected, otherwise use ticket type prices
  const totalPrice = selectedSeats.length > 0
    ? selectedSeats.reduce((sum, selectedSeat) => sum + selectedSeat.seat.price, 0)
    : selectedTickets.reduce((sum, item) => sum + (item.ticketType.price * item.quantity), 0);
  const serviceFee = 0;
  const total = totalPrice;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            disabled={processing}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="mb-8">
          <h1 className="mb-2">Payment Details</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="w-4 h-4" />
            <p>Your payment information is secure and encrypted</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Card Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      disabled={processing}
                    />
                    {errors.cardNumber && (
                      <p className="text-sm text-destructive">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name *</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleChange('cardName', e.target.value)}
                      placeholder="JOHN DOE"
                      disabled={processing}
                    />
                    {errors.cardName && (
                      <p className="text-sm text-destructive">{errors.cardName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        disabled={processing}
                      />
                      {errors.expiryDate && (
                        <p className="text-sm text-destructive">{errors.expiryDate}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="password"
                        value={formData.cvv}
                        onChange={(e) => handleChange('cvv', e.target.value)}
                        placeholder="123"
                        disabled={processing}
                      />
                      {errors.cvv && (
                        <p className="text-sm text-destructive">{errors.cvv}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-1">
                    <Badge variant="secondary" className="mb-4">
                      <Lock className="w-3 h-3 mr-1" />
                      Demo Mode - No real payment will be processed
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is a demonstration payment form.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={processing}
                  >
                    {processing ? (
                      <>Processing Payment...</>
                    ) : (
                      <>Complete Payment - {total.toLocaleString()} IQD</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="mb-4">Order Summary</h3>
                
                <div className="mb-4 pb-4 border-b">
                  <p className="font-medium mb-1">{concert.name}</p>
                  <p className="text-sm text-muted-foreground">{concert.artist}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(concert.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })} at {concert.time}
                  </p>
                </div>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm font-medium mb-1">Contact</p>
                  <p className="text-sm text-muted-foreground">
                    {userDetails.firstName} {userDetails.lastName}
                  </p>
                  {/* <p className="text-sm text-muted-foreground">{userDetails.email}</p> */}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  {selectedSeats.length > 0 ? (
                    // Show selected seats with their actual prices
                    selectedSeats.map((selectedSeat, index) => (
                      <div key={selectedSeat.seat.id || index} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium">
                            Block: {selectedSeat.seat.block} {selectedSeat.seat.row} {selectedSeat.seat.number}
                          </p>
                          <p className="text-muted-foreground">
                            {selectedSeat.ticketType.name}
                          </p>
                        </div>
                        <p className="font-medium">
                          {selectedSeat.seat.price.toLocaleString()} IQD
                        </p>
                      </div>
                    ))
                  ) : (
                    // Show ticket types when no seats selected
                    selectedTickets.map(item => (
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
                    ))
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-medium">{totalPrice.toLocaleString()} IQD</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Service Fee</p>
                    <p className="font-medium">{serviceFee.toLocaleString()} IQD</p>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <p className="font-semibold">Total</p>
                    <p className="font-semibold text-xl">
                      {total.toLocaleString()} IQD
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
