import { Concert, SelectedTicket, SelectedSeat, UserDetails } from '../types/concert';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CheckCircle, Calendar, MapPin, Mail, Download, Home } from 'lucide-react';

interface BookingConfirmationProps {
  concert: Concert;
  selectedTickets: SelectedTicket[];
  selectedSeats?: SelectedSeat[];
  userDetails: UserDetails;
  onBackToHome: () => void;
}

export function BookingConfirmation({ 
  concert, 
  selectedTickets,
  selectedSeats = [],
  userDetails,
  onBackToHome 
}: BookingConfirmationProps) {
  // Calculate total price: use seat prices if seats are selected, otherwise use ticket type prices
  const totalPrice = selectedSeats.length > 0
    ? selectedSeats.reduce((sum, selectedSeat) => sum + selectedSeat.seat.price, 0)
    : selectedTickets.reduce((sum, item) => sum + (item.ticketType.price * item.quantity), 0);
  const serviceFee = 0;
  const total = totalPrice;

  const bookingRef = `BK${Date.now().toString().slice(-8)}`;

  const handleDownloadTickets = () => {
    // Mock download functionality
    alert('In a real application, this would download your tickets as a PDF file.');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="mb-3">Booking Confirmed!</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Thank you for your purchase
          </p>
          <p className="text-muted-foreground">
            Your booking reference: <span className="font-mono font-semibold">{bookingRef}</span>
          </p>
        </div>

        {/* Confirmation Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Event Details */}
              <div>
                <h3 className="mb-4">Event Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-lg">{concert.name}</p>
                    <p className="text-muted-foreground">{concert.artist}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">
                        {new Date(concert.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{concert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{concert.venue}</p>
                      <p className="text-sm text-muted-foreground">{concert.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="mb-4">Your Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {userDetails.firstName} {userDetails.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{userDetails.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seats & Tickets */}
            <div className="border-t pt-6 mb-6">
              <h3 className="mb-4">
                {selectedSeats.length > 0 ? 'Your Seats' : 'Tickets'}
              </h3>
              {selectedSeats.length > 0 ? (
                <div className="space-y-3">
                  {selectedSeats.map((selectedSeat, index) => (
                    <div key={selectedSeat.seat.id || index} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {selectedSeat.seat.block} {selectedSeat.seat.row} {selectedSeat.seat.number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedSeat.ticketType.name}
                        </p>
                      </div>
                      <p className="font-medium">
                        {selectedSeat.seat.price.toLocaleString()} IQD
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedTickets.map(item => (
                    <div key={item.ticketType.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.ticketType.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {(item.ticketType.price * item.quantity).toLocaleString()} IQD
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-6">
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
                  <p className="font-semibold">Total Paid</p>
                  <p className="font-semibold text-xl">{total.toLocaleString()} IQD</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Notification */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Confirmation Email Sent
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                We've sent your tickets and booking confirmation to {userDetails.email}. 
                Please check your inbox and spam folder.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleDownloadTickets}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download Tickets
          </Button>
          <Button 
            onClick={onBackToHome}
            size="lg"
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
