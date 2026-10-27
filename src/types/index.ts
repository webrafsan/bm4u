export type ProductCategory = 
  | 'business-manager' 
  | 'verified-bm' 
  | 'facebook-account' 
  | 'tiktok-account' 
  | 'special-item';

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  country?: string;
  countryCode?: string;
  lines?: '2-line' | '3-line' | 'n/a';
  limit?: string;
  format: string;
  stock: number;
  features: string[];
  description: string;
  guarantee: string;
  isPopular?: boolean;
  isSpecial?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
  category: string;
}

export interface UIDCheckResult {
  uid: string;
  status: 'LIVE' | 'DIE' | 'UNKNOWN' | 'CHECKING';
  name?: string;
  avatar?: string;
  message?: string;
  time?: string;
}
