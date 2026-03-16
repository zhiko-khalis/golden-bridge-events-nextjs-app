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
    username: '2nail',
    password: '2nail123',
    location: '2nail',
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
    username: 'Babak',
    password: 'Babak123',
    location: 'Babak',
    isMainAdmin: false
  },
  {
    id: 'admin-6',
    username: 'gully-srushty',
    password: 'gully-srushty123',
    location: 'gully-srushty',
    isMainAdmin: false
  },
  {
    id: 'admin-7',
    username: 'Laboca',
    password: 'Laboca123',
    location: 'Laboca',
    isMainAdmin: false
  },
  {
    id: 'admin-8',
    username: 'Hamdel2',
    password: 'Hamdel2123',
    location: 'Hamdel2',
    isMainAdmin: false
  }
];

