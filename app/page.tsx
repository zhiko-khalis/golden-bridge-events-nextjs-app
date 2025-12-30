'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Concert, SelectedTicket, UserDetails, BookingData, Ticket, TicketType } from './types/concert';
import { ConcertBrowser } from './components/ConcertBrowser';
import { ConcertDetails } from './components/ConcertDetails';
import { SeatSelection } from './components/SeatSelection';
import { UserDetailsForm } from './components/UserDetailsForm';
import { PaymentForm } from './components/PaymentForm';
import { BookingConfirmation } from './components/BookingConfirmation';
import { TicketsDisplay } from './components/TicketsDisplay';
import { Footer } from './components/Footer';
import { BookingTimer } from './components/BookingTimer';
import { SelectedSeat } from './types/concert';
import { useAuth } from './contexts/AuthContext';
import { AdminNav } from './components/AdminNav';
import { SalesDisplay } from './components/SalesDisplay';
import { useSales } from './contexts/SalesContext';
import { TicketSale } from './types/sales';

type BookingStep = 
  | 'browse' 
  | 'details' 
  | 'tickets' 
  | 'user-info' 
  | 'payment' 
  | 'tickets-display'
  | 'confirmation';

export default function App() {
  const { isAdmin, adminInfo } = useAuth();
  const { addSale } = useSales();
  const [currentStep, setCurrentStep] = useState<BookingStep>('browse');
  const [bookingData, setBookingData] = useState<BookingData>({
    concert: null,
    selectedTickets: [],
    selectedSeats: [],
    userDetails: null,
    generatedTickets: []
  });
  const [showTimer, setShowTimer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleTimerExpire = useCallback(() => {
    // Reset booking data and redirect to main page
    setShowTimer(false);
    setTimeRemaining(600); // Reset to 10 minutes
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setBookingData({
      concert: null,
      selectedTickets: [],
      selectedSeats: [],
      userDetails: null,
      generatedTickets: []
    });
    setCurrentStep('browse');
  }, []);

  // Reset to main page on mount (refresh or reopen)
  useEffect(() => {
    // Clear any timers
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Reset all state to initial values
    setCurrentStep('browse');
    setShowTimer(false);
    setTimeRemaining(600);
    setBookingData({
      concert: null,
      selectedTickets: [],
      selectedSeats: [],
      userDetails: null,
      generatedTickets: []
    });
  }, []); // Empty dependency array - runs only on mount

  // Timer effect - runs when showTimer is true
  useEffect(() => {
    if (showTimer && (currentStep === 'user-info' || currentStep === 'payment')) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            handleTimerExpire();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [showTimer, currentStep, handleTimerExpire]);

  // Navigation handlers
  const handleSelectConcert = (concert: Concert) => {
    setBookingData(prev => ({ ...prev, concert }));
    setCurrentStep('details');
  };

  const handleBackToBrowse = () => {
    setShowTimer(false);
    setTimeRemaining(600); // Reset to 10 minutes
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setCurrentStep('browse');
  };

  const handleBookTickets = () => {
    setCurrentStep('tickets');
  };

  const handleBackToDetails = () => {
    setCurrentStep('details');
  };

  const handleTicketsSelected = (selectedTickets: SelectedTicket[]) => {
    setBookingData(prev => ({ ...prev, selectedTickets }));
    setTimeRemaining(600); // Reset to 10 minutes
    setShowTimer(true); // Start timer when entering user-info step
    setCurrentStep('user-info');
  };

  const handleSeatsSelected = (selectedSeats: SelectedSeat[]) => {
    // Convert selected seats to selected tickets format for compatibility
    const ticketMap = new Map<string, { ticketType: TicketType; quantity: number }>();
    
    selectedSeats.forEach(selectedSeat => {
      const ticketId = selectedSeat.ticketType.id;
      if (ticketMap.has(ticketId)) {
        ticketMap.get(ticketId)!.quantity++;
      } else {
        ticketMap.set(ticketId, {
          ticketType: selectedSeat.ticketType,
          quantity: 1
        });
      }
    });

    const selectedTickets: SelectedTicket[] = Array.from(ticketMap.values()).map(item => ({
      ticketType: item.ticketType,
      quantity: item.quantity
    }));

    setBookingData(prev => ({ 
      ...prev, 
      selectedSeats,
      selectedTickets 
    }));
    setTimeRemaining(600); // Reset to 10 minutes
    setShowTimer(true); // Start timer when entering user-info step
    setCurrentStep('user-info');
  };

  const handleBackToTickets = () => {
    setShowTimer(false);
    setTimeRemaining(600); // Reset to 10 minutes
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setCurrentStep('tickets');
  };

  const handleUserDetailsSubmitted = (userDetails: UserDetails, tickets: Ticket[]) => {
    setBookingData(prev => ({ ...prev, userDetails, generatedTickets: tickets }));
    
    // If admin, skip payment and go directly to tickets display
    if (isAdmin && adminInfo && bookingData.concert) {
      setShowTimer(false);
      setTimeRemaining(600);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      
      // Reserve seats for admin (cash payment)
      if (bookingData.selectedSeats && bookingData.selectedSeats.length > 0) {
        if (typeof window !== 'undefined') {
          import('./data/venueLayouts').then(({ getVenueLayout }) => {
            const venueLayout = getVenueLayout(bookingData.concert!.venue);
            const storageKey = `reservedSeats_${venueLayout.venueId}`;
            
            const reserved = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
            bookingData.selectedSeats!.forEach(selectedSeat => {
              if (!reserved.includes(selectedSeat.seat.id)) {
                reserved.push(selectedSeat.seat.id);
              }
            });
            sessionStorage.setItem(storageKey, JSON.stringify(reserved));
            
            window.dispatchEvent(new CustomEvent('seatsReserved', { 
              detail: { 
                seatIds: bookingData.selectedSeats!.map(s => s.seat.id),
                venueId: venueLayout.venueId
              } 
            }));
          });
        }
      }

      // Record sale for admin (cash payment)
      const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price, 0);
      const sale: TicketSale = {
        id: `sale-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        tickets,
        concertId: bookingData.concert.id,
        concertName: bookingData.concert.name,
        location: bookingData.concert.location,
        adminId: adminInfo.id,
        adminUsername: adminInfo.username,
        adminLocation: adminInfo.location,
        totalAmount,
        saleDate: new Date().toISOString(),
        bookingReference: tickets[0]?.bookingReference || `BK${Date.now().toString().slice(-8)}`,
        paymentMethod: 'cash'
      };
      addSale(sale);
      
      setCurrentStep('tickets-display');
    } else {
      setCurrentStep('payment');
    }
  };

  const handleBackToUserInfo = () => {
    setCurrentStep('user-info');
  };

  const handlePaymentComplete = () => {
    setShowTimer(false); // Stop timer when payment is completed
    setTimeRemaining(600); // Reset to 10 minutes
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Record sale for regular user (online payment)
    if (bookingData.concert && bookingData.generatedTickets && bookingData.generatedTickets.length > 0) {
      const totalAmount = bookingData.generatedTickets.reduce((sum, ticket) => sum + ticket.price, 0);
      const sale: TicketSale = {
        id: `sale-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        tickets: bookingData.generatedTickets,
        concertId: bookingData.concert.id,
        concertName: bookingData.concert.name,
        location: bookingData.concert.location,
        adminId: 'online',
        adminUsername: 'Online Purchase',
        adminLocation: 'Online',
        totalAmount,
        saleDate: new Date().toISOString(),
        bookingReference: bookingData.generatedTickets[0]?.bookingReference || `BK${Date.now().toString().slice(-8)}`,
        paymentMethod: 'online'
      };
      addSale(sale);
    }

    setCurrentStep('tickets-display');
  };

  const handleBackToHome = () => {
    setShowTimer(false);
    setTimeRemaining(600); // Reset to 10 minutes
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setBookingData({
      concert: null,
      selectedTickets: [],
      selectedSeats: [],
      userDetails: null,
      generatedTickets: []
    });
    setCurrentStep('browse');
  };


  // Render current step
  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin Navigation - shown on all pages */}
      <AdminNav />
      
      {currentStep === 'browse' && (
        <>
          <ConcertBrowser onSelectConcert={handleSelectConcert} />
          <SalesDisplay />
          {/* <Footer /> */}
        </>
      )}

      {currentStep === 'details' && bookingData.concert && (
        <ConcertDetails
          concert={bookingData.concert}
          onBack={handleBackToBrowse}
          onBookTickets={handleBookTickets}
        />
      )}

      {currentStep === 'tickets' && bookingData.concert && (
        <SeatSelection
          concert={bookingData.concert}
          onBack={handleBackToDetails}
          onContinue={handleSeatsSelected}
        />
      )}

      {currentStep === 'user-info' && bookingData.concert && (
        <>
          {showTimer && (
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b">
              <div className="max-w-5xl mx-auto px-4 py-3">
                <BookingTimer timeRemaining={timeRemaining} />
              </div>
            </div>
          )}
          <UserDetailsForm
            concert={bookingData.concert}
            selectedTickets={bookingData.selectedTickets}
            selectedSeats={bookingData.selectedSeats}
            onBack={handleBackToTickets}
            onContinue={handleUserDetailsSubmitted}
          />
        </>
      )}

      {currentStep === 'payment' && bookingData.concert && bookingData.userDetails && bookingData.generatedTickets && (
        <>
          {showTimer && (
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b">
              <div className="max-w-5xl mx-auto px-4 py-3">
                <BookingTimer timeRemaining={timeRemaining} />
              </div>
            </div>
          )}
          <PaymentForm
            concert={bookingData.concert}
            selectedTickets={bookingData.selectedTickets}
            selectedSeats={bookingData.selectedSeats}
            userDetails={bookingData.userDetails}
            tickets={bookingData.generatedTickets}
            onBack={handleBackToUserInfo}
            onComplete={handlePaymentComplete}
          />
        </>
      )}

      {currentStep === 'tickets-display' && bookingData.generatedTickets && bookingData.generatedTickets.length > 0 && (
        <TicketsDisplay
          tickets={bookingData.generatedTickets}
          onBackToHome={handleBackToHome}
        />
      )}

      {currentStep === 'confirmation' && bookingData.concert && bookingData.userDetails && (
        <BookingConfirmation
          concert={bookingData.concert}
          selectedTickets={bookingData.selectedTickets}
          selectedSeats={bookingData.selectedSeats}
          userDetails={bookingData.userDetails}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}
