import React from 'react';
import {
  X,
  SlidersHorizontal,
  MapPin,
  Tag,
  DollarSign,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Check,
} from 'lucide-react';
import { FilterState } from '../types';
import { CATEGORIES } from '../data/mockAds';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [tempFilters, setTempFilters] = React.useState<FilterState>(filters);

  React.useEffect(() => {
    setTempFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Filtros Avançados de Busca
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Refine localização, valores, categoria e estado do produto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Location Filters: Estado & Cidade */}
          <div className="space-y-3">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Localização (Estado e Cidade)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="block text-slate-500 text-[11px] mb-1 font-semibold">Estado (UF)</span>
                <select
                  value={tempFilters.state}
                  onChange={(e) =>
                    setTempFilters({ ...tempFilters, state: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="todos">Todos os Estados</option>
                  <option value="SP">São Paulo (SP)</option>
                  <option value="RJ">Rio de Janeiro (RJ)</option>
                  <option value="PR">Paraná (PR)</option>
                  <option value="MG">Minas Gerais (MG)</option>
                  <option value="RS">Rio Grande do Sul (RS)</option>
                  <option value="SC">Santa Catarina (SC)</option>
                </select>
              </div>

              <div>
                <span className="block text-slate-500 text-[11px] mb-1 font-semibold">Cidade</span>
                <select
                  value={tempFilters.city}
                  onChange={(e) =>
                    setTempFilters({ ...tempFilters, city: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="todas">Todas as Cidades</option>
                  <option value="São Paulo">São Paulo</option>
                  <option value="Rio de Janeiro">Rio de Janeiro</option>
                  <option value="Curitiba">Curitiba</option>
                  <option value="Belo Horizonte">Belo Horizonte</option>
                  <option value="Porto Alegre">Porto Alegre</option>
                  <option value="Florianópolis">Florianópolis</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>Categoria</span>
            </label>
            <select
              value={tempFilters.category}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, category: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="todos">Todas as Categorias</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Faixa de Preço (R$)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Mínimo R$"
                  value={tempFilters.minPrice}
                  onChange={(e) =>
                    setTempFilters({ ...tempFilters, minPrice: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Máximo R$"
                  value={tempFilters.maxPrice}
                  onChange={(e) =>
                    setTempFilters({ ...tempFilters, maxPrice: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Item Condition */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
              Condição do Produto
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'novo', label: 'Novo' },
                { id: 'seminovo', label: 'Seminovo' },
                { id: 'usado', label: 'Usado' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() =>
                    setTempFilters({ ...tempFilters, condition: c.id })
                  }
                  className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all ${
                    tempFilters.condition === c.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-4 h-4 text-emerald-600" />
              <span>Ordenar Resultados Por</span>
            </label>
            <select
              value={tempFilters.sortBy}
              onChange={(e) =>
                setTempFilters({
                  ...tempFilters,
                  sortBy: e.target.value as any,
                })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="recentes">Mais Recentes Primeiro</option>
              <option value="relevancia">Destaques Mercado Pago (Top)</option>
              <option value="menor_preco">Menor Preço</option>
              <option value="maior_preco">Maior Preço</option>
            </select>
          </div>

          {/* Featured Ads Toggle */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  Apenas Anúncios em Destaque Ouro
                </span>
                <span className="text-[10px] text-slate-500">
                  Mostra somente anúncios com plano ativo Mercado Pago
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={tempFilters.planOnly}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, planOnly: e.target.checked })
              }
              className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Filtros</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Aplicar Filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
};
