import React from 'react';
import { SlidersHorizontal, Sparkles, FilterX, Flame } from 'lucide-react';
import { Ad } from '../types';
import { AdCard } from './AdCard';
import { BannerAd } from './BannerAd';
import { CATEGORIES } from '../data/mockAds';

interface AdGridProps {
  ads: Ad[];
  onSelectAd: (ad: Ad) => void;
  onToggleFavorite: (adId: string) => void;
  favorites: string[];
  selectedCategory: string;
  selectedCity: string;
  sortBy: string;
  setSortBy: (sort: 'recentes' | 'menor_preco' | 'maior_preco' | 'relevancia') => void;
  onResetFilters: () => void;
  totalCount: number;
}

export const AdGrid: React.FC<AdGridProps> = ({
  ads,
  onSelectAd,
  onToggleFavorite,
  favorites,
  selectedCategory,
  selectedCity,
  sortBy,
  setSortBy,
  onResetFilters,
  totalCount,
}) => {
  const currentCatObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Grid Header & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentCatObj ? currentCatObj.name : 'Todos os Anúncios'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {ads.length} de {totalCount}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {selectedCity !== 'todas'
              ? `Filtrado em ${selectedCity}`
              : 'Mostrando anúncios de todo o Brasil com entrega ou retirada local'}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          {(selectedCategory !== 'todos' || selectedCity !== 'todas') && (
            <button
              onClick={onResetFilters}
              className="text-xs text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              Ordenar por:
            </span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'recentes' | 'menor_preco' | 'maior_preco' | 'relevancia')
              }
              className="bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="recentes" className="bg-white dark:bg-slate-900">
                Mais Recentes & Destaques
              </option>
              <option value="relevancia" className="bg-white dark:bg-slate-900">
                Apenas Destaques Ouro
              </option>
              <option value="menor_preco" className="bg-white dark:bg-slate-900">
                Menor Preço
              </option>
              <option value="maior_preco" className="bg-white dark:bg-slate-900">
                Maior Preço
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid List */}
      {ads.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 my-6">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-4">
            <FilterX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Nenhum anúncio encontrado para esses filtros
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Tente buscar com palavras mais genéricas ou selecione outra categoria ou cidade.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Ver Todos os Anúncios
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ads.map((ad, idx) => {
            const isFav = favorites.includes(ad.id);
            const showInlineBanner = (idx + 1) % 6 === 0;

            return (
              <React.Fragment key={ad.id}>
                <AdCard
                  ad={ad}
                  onSelectAd={onSelectAd}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={isFav}
                />
                {showInlineBanner && <BannerAd type="in-feed" />}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </section>
  );
};
