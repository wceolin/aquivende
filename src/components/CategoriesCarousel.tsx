import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/mockAds';

const CATEGORY_ICONS: Record<string, string> = {
  veiculos: '🚗',
  imoveis: '🏠',
  eletronicos: '💻',
  moveis: '🛋️',
  servicos: '🛠️',
  moda: '👕',
  esportes: '🚲',
  empregos: '💼',
};

interface CategoriesCarouselProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesCarousel: React.FC<CategoriesCarouselProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 shadow-xs relative">
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden sm:flex w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-sm border border-slate-200 dark:border-slate-700"
          aria-label="Rolar para esquerda"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth py-1 px-1 flex-1 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* 'Todas' Pill */}
          <button
            onClick={() => onSelectCategory('todos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
              selectedCategory === 'todos'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-102'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <span className="text-sm">✨</span>
            <span>Todas as Categorias</span>
          </button>

          {/* Category Items */}
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const emojiIcon = CATEGORY_ICONS[cat.id] || '🏷️';

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-102 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <span className="text-base">{emojiIcon}</span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden sm:flex w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-sm border border-slate-200 dark:border-slate-700"
          aria-label="Rolar para direita"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
