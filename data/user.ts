export interface User {
  id: string;
  email: string;
  name: string;
  purchases: Purchase[];
  createdAt: string;
}

export interface Purchase {
  id: string;
  productId: string;
  productTitle: string;
  productThumbnail: string;
  downloadUrl: string;
  purchaseDate: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Mock user data - in production, this would come from a database
export const mockUsers: User[] = [];

// Mock current user
export let currentUser: User | null = null;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

export const addPurchase = (purchase: Purchase) => {
  if (currentUser) {
    currentUser.purchases.push(purchase);
  }
};

export const getUserPurchases = (): Purchase[] => {
  return currentUser?.purchases || [];
};

export const isProductPurchased = (productId: string): boolean => {
  if (!currentUser) return false;
  return currentUser.purchases.some(p => p.productId === productId && p.status === 'completed');
};
