'use client';

import { useState } from 'react';
import { UserDetails, SelectedTicket, SelectedSeat, Concert, Ticket } from '../types/concert';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserDetailsFormProps {
  concert: Concert;
  selectedTickets: SelectedTicket[];
  selectedSeats?: SelectedSeat[];
  onBack: () => void;
  onContinue: (userDetails: UserDetails, tickets: Ticket[]) => void;
}

export function UserDetailsForm({ 
  concert, 
  selectedTickets,
  selectedSeats = [],
  onBack, 
  onContinue 
}: UserDetailsFormProps) {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState<UserDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserDetails, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserDetails, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTickets = (userDetails: UserDetails): Ticket[] => {
    const bookingReference = `BK${Date.now().toString().slice(-8)}`;
    const purchaseDate = new Date().toISOString();
    const tickets: Ticket[] = [];

    if (selectedSeats.length > 0) {
      // Generate tickets for selected seats
      selectedSeats.forEach((selectedSeat, index) => {
        const ticketNumber = `${bookingReference}-${String(index + 1).padStart(3, '0')}`;
        tickets.push({
          id: `ticket-${Date.now()}-${index}`,
          ticketNumber,
          concert,
          ticketType: selectedSeat.ticketType,
          seat: selectedSeat.seat,
          userDetails,
          price: selectedSeat.seat.price,
          bookingReference,
          purchaseDate
        });
      });
    } else {
      // Generate tickets for selected ticket types
      let ticketIndex = 0;
      selectedTickets.forEach(selectedTicket => {
        for (let i = 0; i < selectedTicket.quantity; i++) {
          const ticketNumber = `${bookingReference}-${String(ticketIndex + 1).padStart(3, '0')}`;
          tickets.push({
            id: `ticket-${Date.now()}-${ticketIndex}`,
            ticketNumber,
            concert,
            ticketType: selectedTicket.ticketType,
            userDetails,
            price: selectedTicket.ticketType.price,
            bookingReference,
            purchaseDate
          });
          ticketIndex++;
        }
      });
    }

    return tickets;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const tickets = generateTickets(formData);
      onContinue(formData, tickets);
    }
  };

  const handleChange = (field: keyof UserDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Calculate total price: use seat prices if seats are selected, otherwise use ticket type prices
  const totalPrice = selectedSeats.length > 0
    ? selectedSeats.reduce((sum, selectedSeat) => sum + selectedSeat.seat.price, 0)
    : selectedTickets.reduce((sum, item) => sum + (item.ticketType.price * item.quantity), 0);

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

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2">Contact Information</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Enter customer details to generate tickets (Cash payment - no payment required)'
              : 'Please provide your details to receive your tickets'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        placeholder="Zhiko"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName || ''}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="Khalls"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="zhiko.khalls@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Your tickets will be sent to this email
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+964 770 123 4567"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    {isAdmin ? 'Generate Tickets (Cash Payment)' : 'Continue to Payment'}
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
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  {selectedSeats.length > 0 ? (
                    // Show selected seats with their actual prices
                    selectedSeats.map((selectedSeat, index) => (
                      <div key={selectedSeat.seat.id || index} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium">
                           Block {selectedSeat.seat.block} {selectedSeat.seat.row} {selectedSeat.seat.number}
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
                    <p className="font-medium">{(0).toFixed(2)} IQD</p>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <p className="font-semibold">Total</p>
                    <p className="font-semibold text-xl">
                      {totalPrice.toLocaleString()} IQD
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
