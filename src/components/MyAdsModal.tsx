import React from 'react';
import { X, ShoppingBag, Zap, CheckCircle, Trash2, Eye, ExternalLink } from 'lucide-react';
import { Ad } from '../types';
import { PLANS } from '../data/mockAds';

interface MyAdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  myAds: Ad[];
  onSelectAd: (ad: Ad) => void;
  onUpgradePlan: (ad: Ad) => void;
  onMarkAsSold: (adId: string) => void;
}

export const MyAdsModal: React.FC<MyAdsModalProps> = ({
  isOpen,
  onClose,
  myAds,
  onSelectAd,
  onUpgradePlan,
  onMarkAsSold,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Painel do Anunciante - Meus Anúncios ({myAds.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {myAds.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-600" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Você ainda não publicou nenhum anúncio.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Clique no botão "Anunciar Grátis" no topo para criar seu primeiro anúncio em poucos segundos!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myAds.map((ad) => {
                const planInfo = PLANS[ad.plan] || PLANS.gratuito;
                const isFeatured = ad.plan === 'destaque_ouro' || ad.plan === 'destaque_turbo';

                return (
                  <div
                    key={ad.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div
                      className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                      onClick={() => {
                        onClose();
                        onSelectAd(ad);
                      }}
                    >
                      <img
                        src={ad.images[0]}
                        alt={ad.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${planInfo.badgeColor}`}>
                            {planInfo.badgeText}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {ad.viewsCount} views
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {ad.title}
                        </h4>
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                          {ad.price === 0 ? 'A Combinar' : `R$ ${ad.price.toLocaleString('pt-BR')}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                      {!isFeatured && ad.status === 'ativo' && (
                        <button
                          onClick={() => {
                            onClose();
                            onUpgradePlan(ad);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Destacar no Mercado Pago</span>
                        </button>
                      )}

                      {ad.status === 'ativo' && (
                        <button
                          onClick={() => onMarkAsSold(ad.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
                        >
                          Marcar Vendido
                        </button>
                      )}

                      {ad.status === 'vendido' && (
                        <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-xs rounded-lg">
                          Vendido
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
