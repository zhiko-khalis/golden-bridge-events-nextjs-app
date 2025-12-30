export interface Concert {
    id: string;
    name: string;
    artist: string;
    date: string;
    time: string;
    venue: string;
    location: string;
    description: string;
    image: string;
    video?: string;
    genre: string;
    ticketTypes: TicketType[];
  }
  
  export interface TicketType {
    id: string;
    name: string;
    price: number;
    available: number;
    description: string;
  }
  
  export interface SelectedTicket {
    ticketType: TicketType;
    quantity: number;
  }
  
  export interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }
  
  export interface Seat {
  id: string;
  block: string;
  row: string;
  number: number;
  price: number;
  isAvailable: boolean;
  isReserved?: boolean;
}

export interface SeatBlock {
  id: string;
  name: string;
  totalSeats: number;
  rows: string[];
  seatsPerRow: Record<string, number>;
  tier: 'balcony' | 'main' | 'ground';
  price: number;
}

export interface VenueLayout {
  venueId: string;
  venueName: string;
  totalSeats: number;
  blocks: SeatBlock[];
}

export interface SelectedSeat {
  seat: Seat;
  ticketType: TicketType;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  concert: Concert;
  ticketType: TicketType;
  seat?: Seat;
  userDetails: UserDetails;
  price: number;
  bookingReference: string;
  purchaseDate: string;
}

export interface BookingData {
    concert: Concert | null;
    selectedTickets: SelectedTicket[];
    selectedSeats?: SelectedSeat[];
    userDetails: UserDetails | null;
    generatedTickets?: Ticket[];
  }
  