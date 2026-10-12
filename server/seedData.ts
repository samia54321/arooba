import { IPizza, IUser } from './models/types.ts';

export const INITIAL_PIZZAS: IPizza[] = [
  {
    id: 'pizza-1',
    name: 'Margherita D.O.P.',
    description: 'San Marzano D.O.P. tomatoes, fresh fior di latte mozzarella, fresh fragrant basil, Sicilian sea salt, and cold-pressed extra virgin olive oil.',
    price: 16.50,
    category: 'Classic',
    image: '/src/assets/images/pizza_margherita_classic_1791819140145.jpg',
    ingredients: ['San Marzano Tomatoes', 'Fior di Latte Mozzarella', 'Fresh Basil', 'EVOO', 'Sea Salt'],
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    inStock: true,
    sizes: { personal: 14.00, classic: 16.50, grande: 21.00 },
    crusts: ['Traditional Neapolitan', 'Crispy Thin', 'Garlic Butter Stuffed'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'pizza-2',
    name: 'Diavola Calabrese',
    description: 'Spicy Calabrian soppressata cups, San Marzano tomato reduction, whole milk mozzarella, chili-infused hot honey, and fresh oregano.',
    price: 19.50,
    category: 'Spicy',
    image: '/src/assets/images/pizza_spicy_diavola_1791819170170.jpg',
    ingredients: ['Calabrian Soppressata', 'San Marzano Tomatoes', 'Mozzarella', 'Calabrian Chili', 'Hot Honey Drizzle'],
    isVegetarian: false,
    isSpicy: true,
    isPopular: true,
    inStock: true,
    sizes: { personal: 16.50, classic: 19.50, grande: 24.50 },
    crusts: ['Traditional Neapolitan', 'Crispy Thin', 'Garlic Butter Stuffed'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'pizza-3',
    name: 'Tartufo & Funghi Selvatici',
    description: 'Wild roasted cremini and shiitake mushrooms, creamy fontina, black truffle carpaccio, garlic confit, and fresh thyme on a white parmigiano base.',
    price: 21.00,
    category: 'White & Truffle',
    image: '/src/assets/images/pizza_truffle_mushroom_1791819154217.jpg',
    ingredients: ['Black Truffle Purée', 'Wild Cremini Mushrooms', 'Fontina Val d\'Aosta', 'Garlic Confit', 'Parmigiano Reggiano', 'Thyme'],
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    inStock: true,
    sizes: { personal: 18.00, classic: 21.00, grande: 26.00 },
    crusts: ['Traditional Neapolitan', 'Crispy Thin', 'Garlic Butter Stuffed'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'pizza-4',
    name: 'Quattro Formaggi Al Forno',
    description: 'A blend of artisanal cheeses: aged mozzarella, gorgonzola dolce, creamy taleggio, and 24-month parmigiano-reggiano with rosemary-infused honey.',
    price: 18.50,
    category: 'Specialty',
    image: '/src/assets/images/hero_artisanal_pizza_1791819121869.jpg',
    ingredients: ['Aged Mozzarella', 'Gorgonzola Dolce', 'Taleggio', 'Parmigiano-Reggiano', 'Rosemary Honey'],
    isVegetarian: true,
    isSpicy: false,
    isPopular: false,
    inStock: true,
    sizes: { personal: 15.50, classic: 18.50, grande: 23.00 },
    crusts: ['Traditional Neapolitan', 'Crispy Thin', 'Garlic Butter Stuffed'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'pizza-5',
    name: 'Prosciutto Crudo & Rucola',
    description: 'Crushed sweet tomatoes, fior di latte, aged 18-month Prosciutto di Parma, wild baby arugula, shaved parmigiano, and lemon zest.',
    price: 22.00,
    category: 'Specialty',
    image: '/src/assets/images/pizza_margherita_classic_1791819140145.jpg',
    ingredients: ['Prosciutto di Parma', 'Fior di Latte', 'Wild Arugula', 'Shaved Parmigiano', 'Lemon EVOO'],
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    inStock: true,
    sizes: { personal: 18.50, classic: 22.00, grande: 27.50 },
    crusts: ['Traditional Neapolitan', 'Crispy Thin', 'Garlic Butter Stuffed'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'pizza-6',
    name: 'Ortolana Giardino (Vegan)',
    description: 'Wood-roasted artichoke hearts, bell peppers, grilled zucchini, red onion petals, cashew ricotta cream, and toasted pine nuts.',
    price: 17.50,
    category: 'Vegan',
    image: '/src/assets/images/pizza_truffle_mushroom_1791819154217.jpg',
    ingredients: ['Roasted Artichokes', 'Cashew Herb Ricotta', 'Fire-Roasted Peppers', 'Grilled Zucchini', 'Toasted Pine Nuts'],
    isVegetarian: true,
    isSpicy: false,
    isPopular: false,
    inStock: true,
    sizes: { personal: 15.00, classic: 17.50, grande: 22.00 },
    crusts: ['Traditional Neapolitan', 'Crispy Thin'],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_USERS: IUser[] = [
  {
    id: 'user-admin',
    name: 'Chef Marco Bellini',
    email: 'admin@veroforno.com',
    password: 'admin123password',
    role: 'admin',
    phone: '+1 (555) 349-8821',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-customer',
    name: 'Elena Rostova',
    email: 'elena@example.com',
    password: 'password123',
    role: 'customer',
    phone: '+1 (555) 782-9901',
    address: '742 Evergreen Terrace, Apt 4B',
    createdAt: new Date().toISOString()
  }
];
