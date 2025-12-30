import { Concert } from '../types/concert';

export const concerts: Concert[] = [
  {
    id: '1',
    name: 'Masoud Sadeghloo Concert',
    artist: 'Live in Concert',
    date: '2025-12-25',
    time: '19:00 pm',
    venue: 'Talari Hunar',
    location: 'Kurdistan, Sulaimani',
    description: 'Join us for an electrifying night of rock music! The Rolling Echoes will perform their greatest hits along with new tracks from their upcoming album. Special guest appearances throughout the evening.',
    image: 'https://images.unsplash.com/photo-1723902701334-08b0fe53ff4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMHN0YWdlfGVufDF8fHx8MTc2NjQ1MTE2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    video: '/masoud.MP4',
    genre: 'Rock',
    ticketTypes: [
      {
        id: 't1',
        name: 'General Admission',
        price: 98250,
        available: 500,
        description: 'Standing room only'
      },
      {
        id: 't2',
        name: 'VIP Seating',
        price: 196500,
        available: 100,
        description: 'Reserved seating with premium view'
      },
      {
        id: 't3',
        name: 'Backstage Pass',
        price: 393000,
        available: 20,
        description: 'Meet & greet with the band'
      }
    ]
  },
  {
    id: '2',
    name: 'Jazz Under the Stars',
    artist: 'Midnight Quartet',
    date: '2024-08-02',
    time: '20:00',
    venue: 'Blue Note Jazz Club',
    location: 'Chicago, IL',
    description: 'Experience an intimate evening of smooth jazz with the renowned Midnight Quartet. This special performance features classic jazz standards and original compositions in an elegant setting.',
    image: 'https://images.unsplash.com/photo-1710951403141-353d4e5c7cbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWNpYW4lMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjY0MTExNzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    genre: 'Jazz',
    ticketTypes: [
      {
        id: 't4',
        name: 'Standard Table',
        price: 78600,
        available: 80,
        description: 'Table seating for 2-4 guests'
      },
      {
        id: 't5',
        name: 'Premium Table',
        price: 157200,
        available: 30,
        description: 'Front row table seating'
      }
    ]
  },
  {
    id: '3',
    name: 'Electronic Dreams Festival',
    artist: 'Various Artists',
    date: '2024-08-20',
    time: '18:00',
    venue: 'Desert Oasis Grounds',
    location: 'Las Vegas, NV',
    description: 'The biggest electronic music festival of the summer! Featuring top DJs and producers from around the world. Three stages, 12 hours of non-stop music, art installations, and more.',
    image: 'https://images.unsplash.com/photo-1607313029691-fa108ddf807d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NjY0NzQyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    genre: 'Electronic',
    ticketTypes: [
      {
        id: 't6',
        name: 'General Admission',
        price: 129690,
        available: 2000,
        description: 'Access to all stages'
      },
      {
        id: 't7',
        name: 'VIP Pass',
        price: 326190,
        available: 200,
        description: 'VIP lounge, premium viewing areas'
      },
      {
        id: 't8',
        name: 'Ultra VIP',
        price: 653690,
        available: 50,
        description: 'All VIP benefits plus backstage access'
      }
    ]
  },
  {
    id: '4',
    name: 'Symphony Orchestra Performance',
    artist: 'Metropolitan Symphony Orchestra',
    date: '2024-09-10',
    time: '19:30',
    venue: 'Carnegie Hall',
    location: 'New York, NY',
    description: 'A magnificent evening of classical music featuring works by Beethoven, Mozart, and Tchaikovsky. Conducted by renowned maestro Alexander Petrov.',
    image: 'https://images.unsplash.com/photo-1519683384663-c9b34271669a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljYWwlMjBvcmNoZXN0cmF8ZW58MXx8fHwxNzY2NDkyNzIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    genre: 'Classical',
    ticketTypes: [
      {
        id: 't9',
        name: 'Balcony',
        price: 58950,
        available: 200,
        description: 'Upper level seating'
      },
      {
        id: 't10',
        name: 'Orchestra',
        price: 111350,
        available: 150,
        description: 'Main floor seating'
      },
      {
        id: 't11',
        name: 'Premium Orchestra',
        price: 196500,
        available: 50,
        description: 'Front section, best acoustics'
      }
    ]
  },
  {
    id: '5',
    name: 'Pop Sensation World Tour',
    artist: 'Luna Sky',
    date: '2024-09-25',
    time: '20:00',
    venue: 'Staples Center',
    location: 'Los Angeles, CA',
    description: "Don't miss Luna Sky's spectacular world tour stop in LA! Experience chart-topping hits, incredible choreography, and stunning visual effects in this unforgettable show.",
    image: 'https://images.unsplash.com/photo-1684679493238-3f0842d6ab1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBjb25jZXJ0JTIwc3RhZ2V8ZW58MXx8fHwxNzY2NDkyNzIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    genre: 'Pop',
    ticketTypes: [
      {
        id: 't12',
        name: 'Nosebleed',
        price: 116590,
        available: 1000,
        description: 'Upper level seats'
      },
      {
        id: 't13',
        name: 'Lower Bowl',
        price: 208290,
        available: 500,
        description: 'Lower level seating'
      },
      {
        id: 't14',
        name: 'Floor Seats',
        price: 391690,
        available: 200,
        description: 'Closest to the stage'
      },
      {
        id: 't15',
        name: 'Meet & Greet Package',
        price: 784690,
        available: 30,
        description: 'Floor seat + backstage meet & greet'
      }
    ]
  },
  {
    id: '6',
    name: 'Indie Music Showcase',
    artist: 'The Velvet Underground Revival',
    date: '2024-10-05',
    time: '21:00',
    venue: 'The Fillmore',
    location: 'San Francisco, CA',
    description: 'An intimate concert featuring rising indie artists. The Velvet Underground Revival brings their unique blend of alternative rock and dreamy soundscapes to the legendary Fillmore stage.',
    image: 'https://images.unsplash.com/photo-1604364260242-1156640c0dfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwY29uY2VydCUyMGNyb3dkfGVufDF8fHx8MTc2NjQ1Njc5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    genre: 'Indie',
    ticketTypes: [
      {
        id: 't16',
        name: 'General Admission',
        price: 45850,
        available: 300,
        description: 'Standing room, first come first served'
      },
      {
        id: 't17',
        name: 'Balcony Reserved',
        price: 72050,
        available: 100,
        description: 'Reserved balcony seating'
      }
    ]
  }
];
