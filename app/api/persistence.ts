import { promises as fs } from 'fs';
import path from 'path';
import { TicketSale } from '@/app/types/sales';

// Data directory - using process.cwd() to get the project root
const DATA_DIR = path.join(process.cwd(), 'data');
const SALES_FILE = path.join(DATA_DIR, 'sales.json');
const RESERVED_SEATS_FILE = path.join(DATA_DIR, 'reserved-seats.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Sales persistence
export async function loadSales(): Promise<TicketSale[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SALES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error('Error loading sales:', error);
    return [];
  }
}

export async function saveSales(sales: TicketSale[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(SALES_FILE, JSON.stringify(sales, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving sales:', error);
    throw error;
  }
}

// Reserved seats persistence
export async function loadReservedSeats(): Promise<Record<string, string[]>> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(RESERVED_SEATS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty object
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {};
    }
    console.error('Error loading reserved seats:', error);
    return {};
  }
}

export async function saveReservedSeats(reservedSeats: Record<string, string[]>): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(RESERVED_SEATS_FILE, JSON.stringify(reservedSeats, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving reserved seats:', error);
    throw error;
  }
}

