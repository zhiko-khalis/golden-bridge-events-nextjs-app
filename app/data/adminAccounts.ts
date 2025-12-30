// Admin accounts with location assignments
export interface AdminAccount {
  id: string;
  username: string;
  password: string;
  location: string;
  isMainAdmin: boolean; // Main admin can view all sales reports
}

export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'admin-1',
    username: 'public',
    password: 'public123',
    location: 'Online',
    isMainAdmin: true
  },
  {
    id: 'admin-2',
    username: 'tichy',
    password: 'tichy123',
    location: 'Empire',
    isMainAdmin: false
  },
  {
    id: 'admin-3',
    username: 'today',
    password: 'today123',
    location: 'Roya towers',
    isMainAdmin: false
  },
  {
    id: 'admin-4',
    username: 'hamdel1',
    password: 'hamdel123',
    location: 'Las Vegas, NV',
    isMainAdmin: false
  },
  {
    id: 'admin-5',
    username: 'hamdel2',
    password: 'hamdel123',
    location: 'New York, NY',
    isMainAdmin: false
  },
  {
    id: 'admin-6',
    username: 'gully-srushty',
    password: 'gully-srushty123',
    location: 'Los Angeles, CA',
    isMainAdmin: false
  },
  {
    id: 'admin-7',
    username: 'admin_sf',
    password: 'sf123',
    location: 'San Francisco, CA',
    isMainAdmin: false
  }
];

