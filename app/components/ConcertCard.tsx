import { Concert } from '../types/concert';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ConcertCardProps {
  concert: Concert;
  onSelect: (concert: Concert) => void;
}

export function ConcertCard({ concert, onSelect }: ConcertCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const minPrice = Math.min(...concert.ticketTypes.map(t => t.price));

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div 
        className="aspect-video w-full overflow-hidden bg-muted"
        onClick={() => onSelect(concert)}
      >
        <img 
          src={concert.image} 
          alt={concert.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <h3 className="line-clamp-1">{concert.name}</h3>
            <p className="text-muted-foreground mt-1">{concert.artist}</p>
          </div>
          <Badge variant="secondary">{concert.genre}</Badge>
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="text-sm">{formatDate(concert.date)} at {concert.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="text-sm line-clamp-1">{concert.venue}, {concert.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">From</p>
          <p className="font-semibold">{minPrice.toLocaleString()} IQD</p>
        </div>
        <Button onClick={() => onSelect(concert)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
