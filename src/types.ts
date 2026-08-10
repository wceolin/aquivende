export type PlanType = 'gratuito' | 'destaque_ouro' | 'destaque_turbo';

export interface PlanOption {
  id: PlanType;
  name: string;
  price: number; // in BRL
  formattedPrice: string;
  durationDays: number;
  badgeText: string;
  badgeColor: string;
  features: string[];
  popular?: boolean;
  priority: number;
}

export interface AdSeller {
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  verified: boolean;
  rating: number; // e.g. 4.9
  joinedDate: string;
  avatarUrl?: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  negotiable?: boolean;
  category: string;
  subcategory?: string;
  condition: 'novo' | 'usado' | 'seminovo';
  images: string[];
  location: {
    city: string;
    state: string;
    neighborhood?: string;
  };
  seller: AdSeller;
  plan: PlanType;
  createdAt: string; // ISO date string
  viewsCount: number;
  isFavorite?: boolean;
  status: 'ativo' | 'pausado' | 'vendido';
  featuredUntil?: string;
  mercadoPagoPreferenceId?: string;
  paymentStatus?: 'pending' | 'approved' | 'free';
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  iconName: string; // Lucide icon identifier
  count: number;
  color: string;
}

export interface PartnerConfig {
  name: string;
  logoUrl: string;
  tagline: string;
  websiteUrl: string;
  active: boolean;
}

export interface CompanyBannerConfig {
  id: string;
  companyName: string;
  title: string;
  bannerUrl: string;
  linkUrl: string;
  active: boolean;
  position: 'top' | 'sidebar' | 'in-feed';
}

export interface FilterState {
  state: string;
  city: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  condition: string;
  planOnly: boolean;
  sortBy: 'recentes' | 'menor_preco' | 'maior_preco' | 'relevancia';
}


export interface CreateAdFormData {
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  category: string;
  subcategory: string;
  condition: 'novo' | 'usado' | 'seminovo';
  images: string[];
  sellerName: string;
  sellerPhone: string;
  sellerWhatsapp: string;
  sellerEmail: string;
  city: string;
  state: string;
  neighborhood: string;
  plan: PlanType;
}

export interface MercadoPagoPreferenceRequest {
  adId?: string;
  title: string;
  description: string;
  unitPrice: number;
  quantity: number;
  planType: PlanType;
  payerName: string;
  payerEmail: string;
  payerPhone?: string;
}

export interface MercadoPagoPreferenceResponse {
  success: boolean;
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  pixCode?: string;
  pixQrBase64?: string;
  boletoCode?: string;
  amount: number;
  planName: string;
}
