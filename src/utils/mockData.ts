
import { Product, Category } from '../types/pos';

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2, 10);

export const generateMockProducts = () => {
  const categories: Category[] = [
    { id: 'food', name: 'Food' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'snacks', name: 'Snacks' },
  ];

  const products: Product[] = [
    // Food items
    {
      id: generateId(),
      name: 'Cheese Burger',
      price: 5.99,
      category: 'food',
      quantity: 50,
    },
    {
      id: generateId(),
      name: 'Pizza Slice',
      price: 3.49,
      category: 'food',
      quantity: 40,
    },
    {
      id: generateId(),
      name: 'Chicken Wings',
      price: 7.99,
      category: 'food',
      quantity: 30,
    },
    {
      id: generateId(),
      name: 'Caesar Salad',
      price: 4.99,
      category: 'food',
      quantity: 25,
    },
    {
      id: generateId(),
      name: 'Pasta Carbonara',
      price: 8.99,
      category: 'food',
      quantity: 20,
    },
    
    // Drinks
    {
      id: generateId(),
      name: 'Cola',
      price: 1.99,
      category: 'drinks',
      quantity: 100,
    },
    {
      id: generateId(),
      name: 'Lemonade',
      price: 2.49,
      category: 'drinks',
      quantity: 80,
    },
    {
      id: generateId(),
      name: 'Iced Tea',
      price: 1.99,
      category: 'drinks',
      quantity: 90,
    },
    {
      id: generateId(),
      name: 'Coffee',
      price: 2.99,
      category: 'drinks',
      quantity: 100,
    },
    
    // Desserts
    {
      id: generateId(),
      name: 'Chocolate Cake',
      price: 4.99,
      category: 'desserts',
      quantity: 15,
    },
    {
      id: generateId(),
      name: 'Ice Cream',
      price: 3.99,
      category: 'desserts',
      quantity: 20,
    },
    {
      id: generateId(),
      name: 'Cheesecake',
      price: 5.49,
      category: 'desserts',
      quantity: 10,
    },
    
    // Snacks
    {
      id: generateId(),
      name: 'French Fries',
      price: 2.99,
      category: 'snacks',
      quantity: 40,
    },
    {
      id: generateId(),
      name: 'Onion Rings',
      price: 3.49,
      category: 'snacks',
      quantity: 30,
    },
    {
      id: generateId(),
      name: 'Mozzarella Sticks',
      price: 4.49,
      category: 'snacks',
      quantity: 25,
    },
  ];

  return { products, categories };
};
