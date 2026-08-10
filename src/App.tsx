import React, { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  Heart,
  ShoppingBag,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  FilterX,
  X,
  ShieldCheck,
  Zap,
  User,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import {
  Ad,
  CreateAdFormData,
  MercadoPagoPreferenceResponse,
  PlanType,
  PartnerConfig,
  CompanyBannerConfig,
  FilterState,
} from './types';
import { CATEGORIES, PLANS } from './data/mockAds';
import { AdCard } from './components/AdCard';
import { CreateAdModal } from './components/CreateAdModal';
import { AdDetailModal } from './components/AdDetailModal';
import { MercadoPagoModal } from './components/MercadoPagoModal';
import { FavoritesModal } from './components/FavoritesModal';
import { MyAdsModal } from './components/MyAdsModal';
import { CategoriesCarousel } from './components/CategoriesCarousel';
import { FilterModal } from './components/FilterModal';
import { AdminModal } from './components/AdminModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { UserAuthModal, UserAccount } from './components/UserAuthModal';

export default function App() {
  // State for Ads & Query
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Advanced Filter State
  const [filters, setFilters] = useState<FilterState>({
    state: 'todos',
    city: 'todas',
    category: 'todos',
    minPrice: '',
    maxPrice: '',
    condition: 'todos',
    planOnly: false,
    sortBy: 'recentes',
  });

  // Admin & Partner Config
  const [partnerConfig, setPartnerConfig] = useState<PartnerConfig>({
    name: 'TechStore Brasil',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    tagline: 'Parceiro Oficial de Tecnologia e Eletrônicos com Garantia',
    websiteUrl: 'https://techstore.com.br',
    active: true,
  });

  const [companyBanners, setCompanyBanners] = useState<CompanyBannerConfig[]>([
    {
      id: 'b1',
      companyName: 'Imobiliária Alfa',
      title: 'Lançamentos de Imóveis Comerciais e Residenciais',
      bannerUrl: '',
      linkUrl: 'https://imobiliariaalfa.com.br',
      active: true,
      position: 'top',
    },
  ]);

  // Favorites & User Posted Ads
  const [favorites, setFavorites] = useState<string[]>([]);
  const [myAdIds, setMyAdIds] = useState<string[]>([]);

  // User Auth Account State
  const [isUserAuthModalOpen, setIsUserAuthModalOpen] = useState(false);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('vixi_user_account');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('vixi_user_account');
    setUserAccount(null);
  };

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isMyAdsModalOpen, setIsMyAdsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('vixi_admin_auth') === 'true';
  });

  // Mercado Pago State
  const [isMercadoPagoModalOpen, setIsMercadoPagoModalOpen] = useState(false);
  const [mpPreference, setMpPreference] = useState<MercadoPagoPreferenceResponse | null>(null);
  const [mpTargetAd, setMpTargetAd] = useState<{ id: string; title: string; plan: PlanType } | null>(null);

  // Detect URL path for /admin routing
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const isNavigatingToAdmin = path === '/admin' || path === '/admin/' || hash === '#admin';

      if (isNavigatingToAdmin) {
        if (sessionStorage.getItem('vixi_admin_auth') === 'true') {
          setIsAdminModalOpen(true);
          setIsAdminAuthModalOpen(false);
        } else {
          setIsAdminAuthModalOpen(true);
          setIsAdminModalOpen(false);
        }
      }
    };

    checkAdminRoute();

    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminAuthModalOpen(false);
    setIsAdminModalOpen(true);
  };

  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    if (window.location.pathname.toLowerCase() === '/admin' || window.location.hash.toLowerCase() === '#admin') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleCloseAdminAuthModal = () => {
    setIsAdminAuthModalOpen(false);
    if (window.location.pathname.toLowerCase() === '/admin' || window.location.hash.toLowerCase() === '#admin') {
      window.history.pushState({}, '', '/');
    }
  };

  // Sync Carousel Category selection with filters
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFilters((prev) => ({ ...prev, category: categoryId }));
  };

  // Fetch Ads from Backend API
  const fetchAds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);

      const activeCat = selectedCategory !== 'todos' ? selectedCategory : filters.category;
      if (activeCat && activeCat !== 'todos') params.append('category', activeCat);

      if (filters.city && filters.city !== 'todas') params.append('city', filters.city);
      if (filters.planOnly) params.append('planOnly', 'true');
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.condition && filters.condition !== 'todos') params.append('condition', filters.condition);

      const res = await fetch(`/api/ads?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        let list: Ad[] = json.data;

        // Apply price filters on client side if requested
        if (filters.minPrice) {
          const min = parseFloat(filters.minPrice);
          if (!isNaN(min)) list = list.filter((a) => a.price >= min);
        }
        if (filters.maxPrice) {
          const max = parseFloat(filters.maxPrice);
          if (!isNaN(max)) list = list.filter((a) => a.price <= max);
        }
        if (filters.state && filters.state !== 'todos') {
          list = list.filter((a) => a.location.state === filters.state);
        }

        setAds(list);
      }
    } catch (err) {
      console.error('Error loading ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [searchQuery, selectedCategory, filters]);

  // Handle Favorites toggle
  const toggleFavorite = (adId: string) => {
    setFavorites((prev) =>
      prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
    );
  };

  // Handle Create Ad Submit
  const handleCreateAdSubmit = async (formData: CreateAdFormData) => {
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (json.success && json.data) {
        const newAd: Ad = json.data;
        setMyAdIds((prev) => [newAd.id, ...prev]);
        setIsCreateModalOpen(false);

        // If user picked a paid plan, trigger Mercado Pago preference creation!
        if (formData.plan === 'destaque_ouro' || formData.plan === 'destaque_turbo') {
          await triggerMercadoPagoPayment(newAd.id, newAd.title, formData.plan);
        } else {
          fetchAds();
        }
      }
    } catch (err) {
      console.error('Error posting ad:', err);
    }
  };

  // Trigger Mercado Pago Checkout Preference API
  const triggerMercadoPagoPayment = async (adId: string, title: string, planType: PlanType) => {
    try {
      const planConfig = PLANS[planType];
      const res = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adId,
          title: `Plano ${planConfig.name}`,
          description: `Anúncio em destaque por ${planConfig.durationDays} dias no VIXI`,
          unitPrice: planConfig.price,
          quantity: 1,
          planType,
          payerName: 'Anunciante Classificados',
          payerEmail: 'cliente@exemplo.com.br',
        }),
      });

      const json: MercadoPagoPreferenceResponse = await res.json();
      if (json.preferenceId) {
        setMpPreference(json);
        setMpTargetAd({ id: adId, title, plan: planType });
        setIsMercadoPagoModalOpen(true);
      }
    } catch (err) {
      console.error('Error creating Mercado Pago Preference:', err);
    }
  };

  // On Mercado Pago Payment Approved Callback
  const handlePaymentSuccess = async () => {
    if (mpTargetAd) {
      await fetch(`/api/ads/${mpTargetAd.id}/plan`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: mpTargetAd.plan,
          paymentStatus: 'approved',
        }),
      });
      setIsMercadoPagoModalOpen(false);
      setMpPreference(null);
      setMpTargetAd(null);
      fetchAds();
    }
  };

  // Mark Ad as Sold
  const handleMarkAsSold = async (adId: string) => {
    try {
      await fetch(`/api/ads/${adId}`, { method: 'DELETE' });
      fetchAds();
    } catch (err) {
      console.error('Error marking as sold:', err);
    }
  };

  // Open Ad Details & Increment views
  const handleSelectAd = async (ad: Ad) => {
    setSelectedAd(ad);
    setIsDetailModalOpen(true);
    try {
      await fetch(`/api/ads/${ad.id}`);
    } catch (e) {
      // ignore
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
    setFilters({
      state: 'todos',
      city: 'todas',
      category: 'todos',
      minPrice: '',
      maxPrice: '',
      condition: 'todos',
      planOnly: false,
      sortBy: 'recentes',
    });
  };

  const handleReturnHome = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    handleResetFilters();
    setSelectedAd(null);
    setIsCreateModalOpen(false);
    setIsFavoritesModalOpen(false);
    setIsMyAdsModalOpen(false);
    setIsAdminModalOpen(false);
    setIsUserAuthModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active Filter Count
  const activeFiltersCount =
    (filters.state !== 'todos' ? 1 : 0) +
    (filters.city !== 'todas' ? 1 : 0) +
    (filters.category !== 'todos' ? 1 : 0) +
    (filters.minPrice !== '' ? 1 : 0) +
    (filters.maxPrice !== '' ? 1 : 0) +
    (filters.condition !== 'todos' ? 1 : 0) +
    (filters.planOnly ? 1 : 0);

  const favoritedAdsObjects = ads.filter((a) => favorites.includes(a.id));
  const myAdsObjects = ads.filter((a) => myAdIds.includes(a.id));

  const isHomePage =
    selectedCategory === 'todas' &&
    !searchQuery.trim() &&
    filters.state === 'todos' &&
    !selectedAd &&
    !isCreateModalOpen &&
    !isFavoritesModalOpen &&
    !isMyAdsModalOpen &&
    !isAdminModalOpen &&
    !isUserAuthModalOpen;
  const featuredAdsCount = ads.filter((a) => a.plan !== 'gratuito').length;

  return (
    <div className="min-h-screen bg-[#F7F8F9] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col">
      {/* 1. Main Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-20 shadow-xs sticky top-0">
        {/* Row 1: Logo VIXI & User Account Auth Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-6">
            <button
              onClick={handleReturnHome}
              className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white hover:opacity-90 transition-opacity cursor-pointer text-left focus:outline-none"
              title="Voltar para a Página Inicial"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-sm">
                V
              </div>
              <span>VIXI</span>
            </button>

            {/* Quick Filter Navigation Tabs */}
            <nav className="hidden lg:flex gap-5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <button
                onClick={() => handleSelectCategory('todos')}
                className={`py-3.5 transition-colors ${
                  selectedCategory === 'todos' && !filters.planOnly
                    ? 'text-emerald-600 border-b-2 border-emerald-600 font-bold'
                    : 'hover:text-emerald-600'
                }`}
              >
                Comprar & Buscar
              </button>
              <button
                onClick={() => handleSelectCategory('imoveis')}
                className={`py-3.5 transition-colors ${
                  selectedCategory === 'imoveis'
                    ? 'text-emerald-600 border-b-2 border-emerald-600 font-bold'
                    : 'hover:text-emerald-600'
                }`}
              >
                Imóveis
              </button>
              <button
                onClick={() => handleSelectCategory('veiculos')}
                className={`py-3.5 transition-colors ${
                  selectedCategory === 'veiculos'
                    ? 'text-emerald-600 border-b-2 border-emerald-600 font-bold'
                    : 'hover:text-emerald-600'
                }`}
              >
                Veículos
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, planOnly: !prev.planOnly }))}
                className={`py-3.5 flex items-center gap-1 ${
                  filters.planOnly ? 'text-amber-500 font-bold border-b-2 border-amber-500' : 'hover:text-amber-500'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Destaques Mercado Pago</span>
              </button>
            </nav>
          </div>

          {/* User Account / Login Button at Far Right */}
          <div>
            {userAccount ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUserAuthModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px]">
                    {userAccount.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate hidden sm:inline">{userAccount.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 text-xs font-bold p-1.5 rounded-lg transition-colors"
                  title="Sair da Conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsUserAuthModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold transition-all shadow-xs border border-slate-800 active:scale-95"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Entrar / Criar Conta</span>
                <span className="sm:hidden text-[11px]">Entrar</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Search Input & Action Icons (Favorites, My Ads, Announce Free) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Line 2 Back to Home Navigation Button (Only shown when not on home page) */}
          {!isHomePage && (
            <button
              onClick={handleReturnHome}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95"
              title="Voltar para a Página Inicial"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Início</span>
            </button>
          )}

          {/* Header Search Input */}
          <div className="relative flex-1 min-w-[180px]">
            <input
              type="text"
              placeholder="O que você procura hoje no VIXI?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-8 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white placeholder-slate-400 shadow-inner"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Favorites Button */}
            <button
              onClick={() => setIsFavoritesModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 relative transition-colors"
              title="Favoritos Salvos"
            >
              <Heart className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* My Ads Button */}
            <button
              onClick={() => setIsMyAdsModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 relative transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Meus Anúncios"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Meus Anúncios</span>
            </button>

            {/* Announce Free Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Anunciar Grátis</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Horizontal Categories Carousel (Single Line) */}
      <CategoriesCarousel
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 3. Filter Button Row & Ads Feed */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
        {/* Filter Line Bar directly above the ads grid */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Anúncios Disponíveis</span>
              <span className="text-xs text-slate-400 font-semibold">
                ({ads.length})
              </span>
            </h2>

            {/* Active Filter Badges */}
            {activeFiltersCount > 0 && (
              <div className="hidden md:flex items-center gap-2 text-[11px]">
                <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {activeFiltersCount} filtro(s) ativo(s)
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-slate-400 hover:text-pink-600 font-bold flex items-center gap-1 transition-colors"
                >
                  <FilterX className="w-3 h-3" /> Limpar tudo
                </button>
              </div>
            )}
          </div>

          {/* Prominent Filter Button on a single line above ads */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-all border border-slate-700/60 active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>Filtros Avançados</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Ads Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <div className="w-9 h-9 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">Carregando anúncios do VIXI...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto my-8 space-y-3 shadow-xs">
            <FilterX className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Nenhum anúncio encontrado
            </h3>
            <p className="text-xs text-slate-400">
              Não encontramos resultados para os filtros selecionados. Tente limpar os filtros ou buscar outro termo.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-block mt-2"
            >
              Ver Todos os Anúncios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {ads.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onSelectAd={handleSelectAd}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(ad.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-6 text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 text-white rounded font-black text-xs flex items-center justify-center">
              V
            </div>
            <span className="font-bold text-slate-800 dark:text-white">
              VIXI &copy; 2026
            </span>
            <span>— Plataforma de Classificados Inteligente</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Mercado Pago API v2
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateAdModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitAd={handleCreateAdSubmit}
      />

      <AdDetailModal
        ad={selectedAd}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedAd ? favorites.includes(selectedAd.id) : false}
        onUpgradePlan={(ad) => triggerMercadoPagoPayment(ad.id, ad.title, 'destaque_ouro')}
      />

      <MercadoPagoModal
        isOpen={isMercadoPagoModalOpen}
        onClose={() => setIsMercadoPagoModalOpen(false)}
        preferenceData={mpPreference}
        adTitle={mpTargetAd?.title || ''}
        planType={mpTargetAd?.plan || 'destaque_ouro'}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favorites={favoritedAdsObjects}
        onSelectAd={handleSelectAd}
        onRemoveFavorite={toggleFavorite}
      />

      <MyAdsModal
        isOpen={isMyAdsModalOpen}
        onClose={() => setIsMyAdsModalOpen(false)}
        myAds={myAdsObjects}
        onSelectAd={handleSelectAd}
        onUpgradePlan={(ad) => triggerMercadoPagoPayment(ad.id, ad.title, 'destaque_ouro')}
        onMarkAsSold={handleMarkAsSold}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        onResetFilters={handleResetFilters}
      />

      <UserAuthModal
        isOpen={isUserAuthModalOpen}
        onClose={() => setIsUserAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setUserAccount(user);
          setIsUserAuthModalOpen(false);
        }}
      />

      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={handleCloseAdminAuthModal}
        onSuccess={handleAdminAuthSuccess}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={handleCloseAdminModal}
        partner={partnerConfig}
        onSavePartner={(newPartner) => setPartnerConfig(newPartner)}
        companyBanners={companyBanners}
        onSaveCompanyBanners={(newBanners) => setCompanyBanners(newBanners)}
        totalAdsCount={ads.length}
        featuredAdsCount={featuredAdsCount}
      />
    </div>
  );
}

