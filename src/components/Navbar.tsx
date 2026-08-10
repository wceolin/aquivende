import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Heart,
  User,
  ShoppingBag,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  Menu,
  X,
  Layers,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockAds';

interface NavbarProps {
  onOpenCreateAd: () => void;
  onOpenMyAds: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  myAdsCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onSearchSubmit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateAd,
  onOpenMyAds,
  onOpenFavorites,
  favoritesCount,
  myAdsCount,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  onSearchSubmit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>
          Anuncie grátis por 30 dias ou destaque com Mercado Pago em até 12x no Cartão ou PIX instantâneo!
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                C
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                  Classi<span className="text-emerald-600 dark:text-emerald-400">Quick</span>
                </span>
                <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase -mt-1">
                  Classificados Online
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSubmit}
            className="hidden lg:flex items-center flex-1 max-w-2xl bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700/60 focus-within:ring-2 focus-within:ring-emerald-500 transition-all"
          >
            <div className="flex items-center flex-1 px-3 gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="O que você está procurando hoje?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Category Select */}
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-medium px-2 py-1 focus:outline-none cursor-pointer max-w-[130px]"
            >
              <option value="todos" className="bg-white dark:bg-slate-900">
                Todas Categorias
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-900">
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Location Select */}
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
            <div className="flex items-center gap-1 px-2 text-xs text-slate-600 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer max-w-[110px]"
              >
                <option value="todas" className="bg-white dark:bg-slate-900">
                  Brasil Inteiro
                </option>
                <option value="São Paulo" className="bg-white dark:bg-slate-900">
                  São Paulo (SP)
                </option>
                <option value="Rio de Janeiro" className="bg-white dark:bg-slate-900">
                  Rio de Janeiro (RJ)
                </option>
                <option value="Curitiba" className="bg-white dark:bg-slate-900">
                  Curitiba (PR)
                </option>
                <option value="Belo Horizonte" className="bg-white dark:bg-slate-900">
                  Belo Horizonte (MG)
                </option>
                <option value="Porto Alegre" className="bg-white dark:bg-slate-900">
                  Porto Alegre (RS)
                </option>
                <option value="Florianópolis" className="bg-white dark:bg-slate-900">
                  Florianópolis (SC)
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1 shrink-0 ml-1"
            >
              Buscar
            </button>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Favorites */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Anúncios Favoritos"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-scale-in">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* My Ads */}
            <button
              onClick={onOpenMyAds}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline">Meus Anúncios</span>
              {myAdsCount > 0 && (
                <span className="w-5 h-5 bg-emerald-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {myAdsCount}
                </span>
              )}
            </button>

            {/* Post Free Ad CTA */}
            <button
              onClick={onOpenCreateAd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Anunciar Grátis</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Form (Expanded) */}
        <div className="lg:hidden pb-3 pt-1">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Buscar produtos, carros, imóveis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shrink-0"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filtro de Localização
            </span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="todas">Brasil Inteiro</option>
              <option value="São Paulo">São Paulo (SP)</option>
              <option value="Rio de Janeiro">Rio de Janeiro (RJ)</option>
              <option value="Curitiba">Curitiba (PR)</option>
              <option value="Belo Horizonte">Belo Horizonte (MG)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onOpenMyAds();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Meus Anúncios ({myAdsCount})</span>
            </button>

            <button
              onClick={() => {
                onOpenFavorites();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Favoritos ({favoritesCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
