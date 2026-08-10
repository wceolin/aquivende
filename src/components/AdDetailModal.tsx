import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Eye,
  ShieldCheck,
  Share2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { Ad } from '../types';

interface AdDetailModalProps {
  ad: Ad | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (adId: string) => void;
  isFavorite: boolean;
  onUpgradePlan: (ad: Ad) => void;
}

export const AdDetailModal: React.FC<AdDetailModalProps> = ({
  ad,
  isOpen,
  onClose,
  onToggleFavorite,
  isFavorite,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !ad) return null;

  const formattedPrice =
    ad.price === 0
      ? 'Sob Consulta / A Combinar'
      : new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(ad.price);

  const handleWhatsApp = () => {
    const phone = ad.seller.whatsapp || ad.seller.phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${ad.seller.name}! Vi seu anúncio "${ad.title}" no VIXI. Podemos negociar?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900/90">
          {/* Line 1: Site Name VIXI and Actions */}
          <div className="p-3 sm:px-5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
            <button
              onClick={onClose}
              className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white hover:opacity-90 cursor-pointer"
              title="Voltar para a Página Inicial"
            >
              <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-base shadow-sm">
                V
              </div>
              <span>VIXI</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Compartilhar Anúncio"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{copiedLink ? 'Copiado!' : 'Compartilhar'}</span>
              </button>

              <button
                onClick={() => onToggleFavorite(ad.id)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title={isFavorite ? 'Remover dos Favoritos' : 'Salvar Favorito'}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-pink-500 text-pink-500' : ''
                  }`}
                />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Line 2: Navigation Back Options */}
          <div className="p-2.5 sm:px-5 flex items-center justify-between bg-white dark:bg-slate-900">
            <button
              onClick={onClose}
              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos Anúncios / Início</span>
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              {ad.category}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                <img
                  src={ad.images[activeImageIdx] || ad.images[0]}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />

                {ad.images.length > 1 && (
                  <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    <button
                      onClick={() =>
                        setActiveImageIdx(
                          (prev) => (prev - 1 + ad.images.length) % ad.images.length
                        )
                      }
                      className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 pointer-events-auto shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIdx((prev) => (prev + 1) % ad.images.length)
                      }
                      className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 pointer-events-auto shadow-md"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {ad.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {ad.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIdx === idx
                          ? 'border-emerald-500 scale-105 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {ad.title}
                </h1>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-sans">
                    {formattedPrice}
                  </span>
                  {ad.negotiable && (
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      Aceita Negociação
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">
                      {ad.location.city}, {ad.location.state}
                      {ad.location.neighborhood ? ` (${ad.location.neighborhood})` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Publicado recentemente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{ad.viewsCount} pessoas visualizaram este anúncio</span>
                  </div>
                </div>
              </div>

              {/* Seller Contact Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center gap-3">
                  {ad.seller.avatarUrl ? (
                    <img
                      src={ad.seller.avatarUrl}
                      alt={ad.seller.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center">
                      {ad.seller.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {ad.seller.name}
                      </h4>
                      {ad.seller.verified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" title="Vendedor Verificado" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      No ClassiQuick desde {ad.seller.joinedDate || '2023'} • Avaliação: ⭐ {ad.seller.rating}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Conversar pelo WhatsApp</span>
                  </button>

                  <a
                    href={`tel:${ad.seller.phone}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Ligar: {ad.seller.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Descrição do Anúncio</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {ad.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
