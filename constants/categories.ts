export interface Category {
  name: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { name: 'Party Venues', emoji: '🏠' },
  { name: 'Restaurant with Kids Play Area', emoji: '🍔' },
  { name: 'Party Cakes', emoji: '🎂' },
  { name: 'Balloons', emoji: '🎈' },
  { name: 'Party Supplies', emoji: '🎊' },
  { name: 'Biscuits & Cookies', emoji: '🍪' },
  { name: 'Party Entertainment', emoji: '🎪' },
  { name: 'Photographers', emoji: '📸' },
  { name: 'Party Decor', emoji: '🎀' },
  { name: 'Party Catering', emoji: '🍽️' },
  { name: 'Party Coordinators', emoji: '📋' },
  { name: 'Mobile Food Trucks', emoji: '🚚' },
  { name: 'Other', emoji: '✨' },
];

export const AGE_GROUPS = [
  'All Ages',
  'Tiny Tots (1-3)',
  'Little Party Animals (3-6)',
  'Wild Ones (7-10)',
  'Tweens (11-13)',
  'Teens (13+)',
];

export const LOCATIONS = [
  'All Areas',
  'Moreleta Park',
  'Faerie Glen',
  'Waterkloof',
  'Silver Lakes',
  'Garsfontein',
  'Lynnwood',
  'Menlyn',
  'Centurion',
  'Hatfield',
  'Brooklyn',
];
