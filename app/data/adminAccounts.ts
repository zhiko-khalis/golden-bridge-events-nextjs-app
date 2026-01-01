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
    username: 'Babak&Zana',
    password: 'Babak&Zana123',
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
    username: 'hamdel-lubnani',
    password: 'hamdel-lubnani123',
    location: 'hamdel-lubnani',
    isMainAdmin: false
  },
  {
    id: 'admin-5',
    username: 'hamdel2',
    password: 'hamdel2123',
    location: 'hamdel2',
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
    username: 'Laboca',
    password: 'Laboca123',
    location: 'Laboca',
    isMainAdmin: false
  }
];

