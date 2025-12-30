import { Concert } from '../types/concert';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface ConcertDetailsProps {
  concert: Concert;
  onBack: () => void;
  onBookTickets: () => void;
}

export function ConcertDetails({ concert, onBack, onBookTickets }: ConcertDetailsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Concerts
          </Button>
        </div>
      </div>

      {/* Concert Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image or Video */}
          <div className="aspect-video lg:aspect-square w-full overflow-hidden rounded-lg">
            {concert.video ? (
              <video 
                src={concert.video} 
                controls
                className="w-full h-full object-cover"
                poster={concert.image}
                autoPlay={true}
                loop={true}
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img 
                src={concert.image} 
                alt={concert.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Concert Info */}
          <div className="flex flex-col">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-4">
                {concert.genre}
              </Badge>
              <h1 className="mb-4">{concert.name}</h1>
              <h2 className="text-muted-foreground mb-8">{concert.artist}</h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">{formatDate(concert.date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-muted-foreground">{concert.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{concert.venue}</p>
                    <p className="text-muted-foreground text-sm">{concert.location}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="mb-3">About this event</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {concert.description}
                </p>
              </div>
            </div>

            <Button 
              onClick={onBookTickets} 
              size="lg"
              className="w-full lg:w-auto"
            >
              Book Tickets
            </Button>
          </div>
        </div>

        {/* Ticket Types */}
        <div>
          <h2 className="mb-6">Available Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {concert.ticketTypes.map(ticket => (
              <Card key={ticket.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3>{ticket.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div>
                      <p className="font-semibold text-2xl">{ticket.price.toLocaleString()} IQD</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {ticket.available} available
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
