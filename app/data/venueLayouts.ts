import { VenueLayout, SeatBlock } from '../types/concert';

// Generate seats for a block based on rows and seats per row
function generateSeatsForBlock(block: SeatBlock): string[] {
  const seatIds: string[] = [];
  block.rows.forEach(row => {
    const seatsInRow = block.seatsPerRow[row] || 0;
    for (let i = 1; i <= seatsInRow; i++) {
      seatIds.push(`${block.id}-${row}-${i}`);
    }
  });
  return seatIds;
}

// Talari Hunar venue layout - matches the reference image
// Mustafa Pasha Yamulki Hall style layout - 1141 seats in 9 blocks
export const talariHunarLayout: VenueLayout = {
  venueId: 'talari-hunar',
  venueName: 'Talari Hunar',
  totalSeats: 1141,
  blocks: [
    // Tier (Front) - Blocks A, B, C
    {
      id: 'A',
      name: 'Block A',
      totalSeats: 116,
      tier: 'balcony',
      price: 45850,
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',],
      seatsPerRow: {
        'A': 12, 'B': 13, 'C': 14, 'D': 16, 'E': 16,
        'F': 15, 'G': 15, 'H': 15,
      }
    },
    {
      id: 'B',
      name: 'Block B',
      totalSeats: 140,
      tier: 'balcony',
      price: 52400,
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',],
      seatsPerRow: {
        'A': 16, 'B': 17, 'C': 18, 'D': 19, 'E': 20,
        'F': 16, 'G': 16, 'H': 18,
      }
    },
    {
      id: 'C',
      name: 'Block C',
      totalSeats: 115,
      tier: 'balcony',
      price: 45850,
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',],
      seatsPerRow: {
        'A': 12, 'B': 13, 'C': 14, 'D': 16, 'E': 15,
        'F': 15, 'G': 15, 'H': 15,
      }
    },
    // Middle Tier (Main Floor) - Blocks D, E, F
    // Rows A through V (22 rows total)
    {
      id: 'D',
      name: 'Block D',
      totalSeats: 223,
      tier: 'main',
      price: 26200,
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
      seatsPerRow: {
        'A': 16, 'B': 16, 'C': 15, 'D': 15, 'E': 15, 'F': 15,
        'G': 15, 'H': 15, 'I': 14, 'J': 14, 'K': 14, 'L': 14,
        'M': 10, 'N': 9, 'O': 9, 'P': 8, 'Q': 9,
      }
    },
    {
      id: 'E',
      name: 'Block E',
      totalSeats: 317,
      tier: 'main',
      price: 26200,
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
      seatsPerRow: {
        'A': 17, 'B': 17, 'C': 17, 'D': 18, 'E': 19, 'F': 19,
        'G': 19, 'H': 20, 'I': 21, 'J': 22, 'K': 21, 'L': 22,
        'M': 15, 'N': 16, 'O': 17, 'P': 18, 'Q': 19,
      }
    },
    {
      id: 'F',
      name: 'Block F',
      totalSeats: 230,
      tier: 'main',
      price: 26200,
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
      seatsPerRow: {
        'A': 16, 'B': 16, 'C': 15, 'D': 15, 'E': 15, 'F': 15,
        'G': 15, 'H': 15, 'I': 14, 'J': 14, 'K': 14, 'L': 14,
        'M': 10, 'N': 9, 'O': 9, 'P': 8, 'Q': 9,
      }
    },
    // Bottom Tier (Ground Floor) - Blocks G, H, I
    // Rows A through V (22 rows total)
    {
      id: 'G',
      name: 'Block G',
      totalSeats: 72,
      tier: 'ground',
      price: 19650,
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      seatsPerRow: {
        'A': 13, 'B': 12, 'C': 12, 'D': 8, 'E': 9, 'F': 9,
        'G': 9,
      }
    },
    {
      id: 'H',
      name: 'Block H',
      totalSeats: 72,
      tier: 'ground',
      price: 19650,
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      seatsPerRow: {
        'A': 28, 'B': 29, 'C': 28, 'D': 23, 'E': 24, 'F': 25,
        'G': 26,
      }
    },
    {
      id: 'I',
      name: 'Block I',
      totalSeats: 21,
      tier: 'ground',
      price: 19650,
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      seatsPerRow: {
        'A': 13, 'B': 12, 'C': 12, 'D': 8, 'E': 9, 'F': 9,
        'G': 9,
      }
    }
  ]
};

// Simple default layout for venues without specific layouts
// This is a generic layout that can be customized per venue
// Pricing matches the reference image exactly
export const defaultVenueLayout: VenueLayout = {
  venueId: 'default',
  venueName: 'Standard Venue',
  totalSeats: 708,
  blocks: [
    {
      id: 'A',
      name: 'Block A',
      totalSeats: 90,
      tier: 'ground',
      price: 75000, // Default price, but rowPrices will be used
      rows: ['A', 'B', 'C', 'D', 'E', 'F'],
      seatsPerRow: {
        'A': 15, 'B': 15, 'C': 15, 'D': 15, 'E': 15,
        'F': 15,
      },
      rowPrices: {
        'A': 80000, 'B': 80000, 'C': 80000,
        'D': 70000, 'E': 70000, 'F': 70000,
      }
    },
    {
      id: 'B',
      name: 'Block B',
      totalSeats: 96,
      tier: 'ground',
      price: 75000, // Default price, but rowPrices will be used
      rows: ['A', 'B', 'C', 'D', 'E', 'F'],
      seatsPerRow: {
        'A': 16, 'B': 16, 'C': 16, 'D': 16, 'E': 16,
        'F': 16,
      },
      rowPrices: {
        'A': 80000, 'B': 80000, 'C': 80000,
        'D': 70000, 'E': 70000, 'F': 70000,
      }
    },
    {
      id: 'C',
      name: 'Block C',
      totalSeats: 180,
      tier: 'main',
      price: 50000, // Default price, but rowPrices will be used
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
      seatsPerRow: {
        'A': 15, 'B': 15, 'C': 15, 'D': 15, 'E': 15,
        'F': 15, 'G': 15, 'H': 15, 'I': 15, 'J': 15, 'K': 15, 'L': 15,
      },
      rowPrices: {
        'A': 60000, 'B': 60000, 'C': 60000, 'D': 60000,
        'E': 50000, 'F': 50000, 'G': 50000, 'H': 50000,
        'I': 40000, 'J': 40000, 'K': 40000, 'L': 40000,
      }
    },
    {
      id: 'D',
      name: 'Block D',
      totalSeats: 192,
      tier: 'main',
      price: 50000, // Default price, but rowPrices will be used
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
      seatsPerRow: {
        'A': 16, 'B': 16, 'C': 16, 'D': 16, 'E': 16,
        'F': 16, 'G': 16, 'H': 16, 'I': 16, 'J': 16, 'K': 16, 'L': 16,
      },
      rowPrices: {
        'A': 60000, 'B': 60000, 'C': 60000, 'D': 60000,
        'E': 50000, 'F': 50000, 'G': 50000, 'H': 50000,
        'I': 40000, 'J': 40000, 'K': 40000, 'L': 40000,
      }
    },
    {
      id: 'E',
      name: 'Block E',
      totalSeats: 75,
      tier: 'balcony',
      price: 35000, // Default price, but rowPrices will be used
      rows: ['A', 'B', 'C', 'D', 'E'],
      seatsPerRow: {
        'A': 15, 'B': 15, 'C': 15, 'D': 15, 'E': 15,
      },
      rowPrices: {
        'A': 35000, 'B': 35000, 'C': 35000,
        'D': 30000, 'E': 30000,
      }
    },
    {
      id: 'F',
      name: 'Block F',
      totalSeats: 75,
      tier: 'balcony',
      price: 35000, // Default price, but rowPrices will be used
      rows: ['A', 'B', 'C', 'D', 'E'],
      seatsPerRow: {
        'A': 15, 'B': 15, 'C': 15, 'D': 15, 'E': 15,
      },
      rowPrices: {
        'A': 35000, 'B': 35000, 'C': 35000,
        'D': 30000, 'E': 30000,
      }
    },

  ]
};

// Venue layout registry
// Maps venue names to their specific layouts
// To add a new venue layout:
// 1. Create a new VenueLayout constant above (e.g., export const blueNoteLayout: VenueLayout = {...})
// 2. Add it to this map with all possible name variations
const venueLayoutMap: Record<string, VenueLayout> = {
  'Talari Hunar': talariHunarLayout,
  'talari-hunar': talariHunarLayout,
  'Talari Hunar Hall': talariHunarLayout,
  // Add more venue-specific layouts here as needed
  // Example:
  // 'Blue Note Jazz Club': blueNoteLayout,
  // 'blue-note': blueNoteLayout,
  // 'Carnegie Hall': carnegieHallLayout,
  // 'carnegie-hall': carnegieHallLayout,
  // etc.
};

// Get venue layout by venue name or ID
export function getVenueLayout(venueNameOrId: string): VenueLayout {
  // Normalize venue name for lookup (case-insensitive, trim whitespace)
  const normalizedName = venueNameOrId.trim();
  
  // Check exact match first
  if (venueLayoutMap[normalizedName]) {
    return venueLayoutMap[normalizedName];
  }
  
  // Check case-insensitive match
  const lowerName = normalizedName.toLowerCase();
  for (const [key, layout] of Object.entries(venueLayoutMap)) {
    if (key.toLowerCase() === lowerName) {
      return layout;
    }
  }
  
  // Check partial match (e.g., "Talari Hunar" matches "Talari Hunar Hall")
  for (const [key, layout] of Object.entries(venueLayoutMap)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return layout;
    }
  }
  
  // Return default layout if no specific layout found
  // In a real app, this would fetch from a database or API
  return defaultVenueLayout;
}

// Generate all seat IDs for a venue layout
export function generateAllSeats(layout: VenueLayout): string[] {
  const allSeats: string[] = [];
  layout.blocks.forEach(block => {
    block.rows.forEach(row => {
      const seatsInRow = block.seatsPerRow[row] || 0;
      for (let i = 1; i <= seatsInRow; i++) {
        allSeats.push(`${block.id}-${row}-${i}`);
      }
    });
  });
  return allSeats;
}


