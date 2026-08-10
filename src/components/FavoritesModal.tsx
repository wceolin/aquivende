import React from 'react';
import { X, Heart, Trash2, ExternalLink } from 'lucide-react';
import { Ad } from '../types';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Ad[];
  onSelectAd: (ad: Ad) => void;
  onRemoveFavorite: (adId: string) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectAd,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Anúncios Favoritos ({favorites.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30 text-pink-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Sua lista de favoritos está vazia.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Clique no ícone de coração nos cards de anúncios para salvá-los para mais tarde.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((ad) => (
                <div
                  key={ad.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-4 hover:border-emerald-500 transition-all cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectAd(ad);
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={ad.images[0]}
                      alt={ad.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {ad.title}
                      </h4>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {ad.price === 0
                          ? 'A Combinar'
                          : `R$ ${ad.price.toLocaleString('pt-BR')}`}
                      </span>
                      <p className="text-[11px] text-slate-500 truncate">
                        {ad.location.city}, {ad.location.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(ad.id);
                      }}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
                      title="Remover dos favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
