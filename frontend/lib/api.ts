import type { Category } from '../components/Home/CategorySection';
import type { ProductType } from '../components/Products/ProductCard';

export type ProductQuery = {
  featured?: boolean;
  limit?: number;
  sort?: string;
  page?: number;
  search?: string;
};

export type HeroStat = { label: string; value: string };

export interface HeroSettings {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  stats?: HeroStat[];
}

export interface ProductPayload {
  name: string;
  slug: string;
  description: string;
  detailedDescription?: string;
  price: number;
  discountPrice?: number;
  category: string;
  subcategory?: string;
  images: (string | { url: string; publicId?: string })[];
  ingredients?: string[];
  benefits?: string[];
  usageInstructions?: string;
  stockQuantity?: number;
  minStockLevel?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

const API_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:5000/api';

const MOCK_PRODUCTS: ProductType[] = [
  {
    _id: 'herbal-elixir',
    name: 'Herbal Elixir',
    description: 'Kenyan chamomile and lemongrass infusion.',
    price: 2500,
    discountPrice: 1990,
    images: ['/images/products/herbal-elixir.jpg'],
    category: 'herbal',
    inStock: true,
    rating: 4.8,
  },
  {
    _id: 'baobab-skin-serum',
    name: 'Baobab Skin Serum',
    description: 'Cold-pressed baobab oil for glowing skin.',
    price: 3200,
    images: ['/images/products/baobab-skin-serum.jpg'],
    category: 'skincare',
    inStock: true,
    rating: 4.6,
  },
  {
    _id: 'moringa-capsules',
    name: 'Moringa Vitality Capsules',
    description: 'Daily immunity boost with organic moringa.',
    price: 1800,
    discountPrice: 1500,
    images: ['/images/products/moringa-capsules.jpg'],
    category: 'supplements',
    inStock: false,
    rating: 4.4,
  },
];

const MOCK_CATEGORIES: Category[] = [
  {
    _id: 'herbal',
    name: 'Herbal Remedies',
    description: 'Roots, leaves, and blends for mindful rituals.',
    productCount: 12,
  },
  {
    _id: 'skincare',
    name: 'Skincare Rituals',
    description: 'Plant-powered topicals for radiant skin.',
    productCount: 9,
  },
  {
    _id: 'supplements',
    name: 'Supplements',
    description: 'Holistic nutrition from Kenyan botanicals.',
    productCount: 7,
  },
];

const FALLBACK_HERO: HeroSettings = {
  title: 'Natural Kenyan Herbal Products',
  subtitle: 'Pure, Organic & Sustainable wellness crafted in Kenya.',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  imageUrl: '/hero-banner.jpg',
  stats: [
    { label: 'Happy Clients', value: '5K+' },
    { label: 'Natural Blends', value: '120' },
    { label: 'Wellness Guides', value: '24/7' },
  ],
};

const buildUrl = (path: string, params?: Record<string, unknown>) => {
  const base = API_BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  let fullPath = `${base}/${cleanPath}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      searchParams.append(key, String(value));
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullPath += `?${queryString}`;
    }
  }

  return fullPath;
};

type RequestOptions = {
  method?: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
  query?: Record<string, unknown>;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { headers, query, ...rest } = options;
  const response = await fetch(buildUrl(path, query), {
    credentials: 'include',
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

export const fetchProducts = async (query: ProductQuery = {}): Promise<ProductType[]> => {
  try {
    const result = await request<{ data?: ProductType[]; meta?: unknown }>('products', {
      query,
    });
    if (Array.isArray((result as any).data)) {
      return (result as any).data;
    }
    return result as unknown as ProductType[];
  } catch (error) {
    console.warn('[lib/api] Falling back to mock products:', error);
    let products = [...MOCK_PRODUCTS];

    if (query.featured) {
      products = products.slice(0, 2);
    }

    if (query.sort === '-createdAt') {
      products = products.reverse();
    }

    if (query.limit && query.limit > 0) {
      products = products.slice(0, query.limit);
    }

    return products;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    return await request<Category[]>('categories');
  } catch (error) {
    console.warn('[lib/api] Falling back to mock categories:', error);
    return MOCK_CATEGORIES;
  }
};

export const fetchProduct = async (id: string): Promise<ProductType> => {
  return request<ProductType>(`products/${id}`);
};

export const createProduct = async (payload: ProductPayload) => {
  return request<ProductType>('products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateProduct = async (
  id: string,
  payload: Partial<ProductPayload>
) => {
  return request<ProductType>(`products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const deleteProduct = async (id: string) => {
  return request<{ success: boolean }>(`products/${id}`, {
    method: 'DELETE',
  });
};

export const uploadImage = async (file: File, folder?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) formData.append('folder', folder);

  const response = await fetch(buildUrl('upload'), {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
};

export const fetchHeroSettings = async (): Promise<HeroSettings> => {
  try {
    return await request<HeroSettings>('site/hero');
  } catch (error) {
    console.warn('[lib/api] Falling back to default hero settings:', error);
    return FALLBACK_HERO;
  }
};

export const updateHeroSettings = async (payload: Partial<HeroSettings>) => {
  return request<HeroSettings>('site/hero', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

