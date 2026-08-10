import React, { useState } from 'react';
import {
  Heart,
  MapPin,
  Clock,
  Sparkles,
  MessageCircle,
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Ad } from '../types';
import { PLANS } from '../data/mockAds';

interface AdCardProps {
  ad: Ad;
  onSelectAd: (ad: Ad) => void;
  onToggleFavorite: (adId: string) => void;
  isFavorite: boolean;
}

export const AdCard: React.FC<AdCardProps> = ({
  ad,
  onSelectAd,
  onToggleFavorite,
  isFavorite,
}) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const planInfo = PLANS[ad.plan] || PLANS.gratuito;
  const isFeatured = ad.plan === 'destaque_ouro' || ad.plan === 'destaque_turbo';

  const formattedPrice =
    ad.price === 0
      ? 'A Combinar'
      : new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          maximumFractionDigits: 0,
        }).format(ad.price);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ad.images.length > 1) {
      setCurrentImageIdx((prev) => (prev + 1) % ad.images.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ad.images.length > 1) {
      setCurrentImageIdx((prev) => (prev - 1 + ad.images.length) % ad.images.length);
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = ad.seller.whatsapp || ad.seller.phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${ad.seller.name}! Vi seu anúncio "${ad.title}" no ClassiQuick. Ainda está disponível?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelectAd(ad)}
      className={`group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between relative ${
        ad.plan === 'destaque_turbo'
          ? 'border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20'
          : ad.plan === 'destaque_ouro'
          ? 'border-2 border-amber-400 shadow-lg shadow-amber-400/10'
          : 'border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={ad.images[currentImageIdx] || ad.images[0]}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Plan / Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {isFeatured && (
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md backdrop-blur-md ${planInfo.badgeColor}`}
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>{planInfo.badgeText}</span>
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md self-start">
            {ad.condition === 'novo' ? 'Novo' : ad.condition === 'seminovo' ? 'Seminovo' : 'Usado'}
          </span>
        </div>

        {/* Favorite Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(ad.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95 transition-all z-10 shadow-md"
          title={isFavorite ? 'Remover dos Favoritos' : 'Salvar Favorito'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-pink-500 text-pink-500' : 'hover:text-pink-500'
            }`}
          />
        </button>

        {/* Image Controls if multiple images */}
        {ad.images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={handlePrevImage}
              className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Bar overlay: Views and Photos Count */}
        <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-[11px] text-white/90 font-medium z-10">
          <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
            <Eye className="w-3 h-3 text-slate-300" />
            {ad.viewsCount} visualizações
          </span>
          {ad.images.length > 1 && (
            <span className="bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
              {currentImageIdx + 1}/{ad.images.length}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">
              {formattedPrice}
            </span>
            {ad.negotiable && (
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                Negociável
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
            {ad.title}
          </h3>
        </div>

        <div>
          {/* Location & Time */}
          <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {ad.location.city}, {ad.location.state}
                {ad.location.neighborhood ? ` - ${ad.location.neighborhood}` : ''}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Anunciado recentemente</span>
              </span>

              {ad.seller.verified && (
                <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verificado</span>
                </span>
              )}
            </div>
          </div>

          {/* Direct WhatsApp CTA Button for Paid listings or inspect */}
          {isFeatured ? (
            <button
              onClick={handleWhatsApp}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Direto</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectAd(ad);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Ver Detalhes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
