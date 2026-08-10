import React from 'react';
import {
  Car,
  Home,
  Smartphone,
  Armchair,
  Wrench,
  Shirt,
  Bike,
  Briefcase,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockAds';

interface HeroSearchProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  planOnlyFilter: boolean;
  setPlanOnlyFilter: (val: boolean) => void;
  activeCount: number;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Car,
  Home,
  Smartphone,
  Armchair,
  Wrench,
  Shirt,
  Bike,
  Briefcase,
};

export const HeroSearch: React.FC<HeroSearchProps> = ({
  selectedCategory,
  setSelectedCategory,
  planOnlyFilter,
  setPlanOnlyFilter,
  activeCount,
}) => {
  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl overflow-hidden mb-8">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Main Hero Headline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-4">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Compre e Venda com Segurança e Rapidez</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          A Plataforma de Classificados{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
            Mais Rápida do Brasil
          </span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
          Carros, imóveis, celulares, móveis e serviços perto de você. Anuncie de graça em poucos segundos com pagamentos em destaque via Mercado Pago.
        </p>

        {/* Feature Highlights Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Vendedores Verificados</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Destaque via Mercado Pago</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>+{activeCount} Anúncios Ativos</span>
          </div>
        </div>

        {/* Category Icons Carousel / Grid */}
        <div className="mt-10 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
              Navegar por Categorias
            </h3>
            <button
              onClick={() => setSelectedCategory('todos')}
              className={`text-xs font-semibold transition-colors ${
                selectedCategory === 'todos' ? 'text-emerald-400 underline' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ver Todas
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <button
              onClick={() => setSelectedCategory('todos')}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all border ${
                selectedCategory === 'todos'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30 scale-105'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-700/60 flex items-center justify-center">
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="truncate w-full text-center">Todas</span>
            </button>

            {CATEGORIES.map((cat) => {
              const IconComp = ICON_MAP[cat.iconName] || Layers;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30 scale-105'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-emerald-500/30 text-white' : 'bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="truncate w-full text-center">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Filter Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            <button
              onClick={() => setPlanOnlyFilter(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                !planOnlyFilter ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todos os Anúncios
            </button>
            <button
              onClick={() => setPlanOnlyFilter(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
                planOnlyFilter
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-amber-300 hover:bg-slate-700 border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apenas Destaques Ouro / Turbo</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium hidden md:block">
            Exibindo os anúncios mais recentes em tempo real
          </div>
        </div>
      </div>
    </div>
  );
};
