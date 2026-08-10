import React, { useState } from 'react';
import { Megaphone, ExternalLink, Info, Sparkles } from 'lucide-react';

interface BannerAdProps {
  type: 'leaderboard' | 'sidebar' | 'in-feed' | 'bottom-sticky';
  customTitle?: string;
  customImage?: string;
  linkUrl?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({
  type,
  customTitle = 'Espaço Publicitário - Anuncie sua Marca Aqui',
  customImage,
  linkUrl = '#',
}) => {
  const [showInfo, setShowInfo] = useState(false);

  if (type === 'leaderboard') {
    return (
      <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-800 relative overflow-hidden my-6">
        {/* Background ambient glow */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/2 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Patrocinado
                </span>
                <span className="text-xs text-slate-400">Google AdSense / Banner Topo</span>
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white mt-0.5">
                {customTitle}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              title="Informações do anúncio"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saiba mais</span>
            </button>
            <a
              href={linkUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 transition-all shadow-md active:scale-95"
            >
              <span>Anunciar Empresa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {showInfo && (
          <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
            <p>
              Espaço de mídia otimizado (728x90 / Leaderboard). Suporta Google AdSense, banners em HTML5 ou mídia patrocinada direta.
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="text-amber-400 hover:underline font-medium ml-2"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm relative overflow-hidden my-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Espaço AdSense 300x250
          </span>
          <Megaphone className="w-4 h-4 text-slate-400" />
        </div>

        {customImage ? (
          <img
            src={customImage}
            alt="Banner Publicitário"
            className="w-full h-48 object-cover rounded-xl mb-3"
          />
        ) : (
          <div className="w-full h-44 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700/60 flex flex-col items-center justify-center text-center p-4 mb-3">
            <Sparkles className="w-8 h-8 text-amber-400 mb-2 animate-bounce" />
            <p className="text-xs font-semibold text-slate-200">
              Sua marca em destaque para milhares de compradores locais!
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Banner Lateral Premium
            </p>
          </div>
        )}

        <h5 className="text-sm font-semibold mb-1 text-white">{customTitle}</h5>
        <p className="text-xs text-slate-400 mb-4">
          Alcance clientes qualificados no momento exato em que estão buscando produtos.
        </p>

        <a
          href={linkUrl}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <span>Anunciar Aqui</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  if (type === 'in-feed') {
    return (
      <div className="col-span-full my-4 bg-gradient-to-r from-emerald-900/20 via-slate-900/30 to-indigo-900/20 rounded-2xl p-5 border border-emerald-500/30 shadow-sm relative flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Patrocinado no Feed
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-400">Google AdSense Native</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Quer vender 5x mais rápido? Conheça os Planos de Destaque MercadoClassi
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Seu anúncio no topo das buscas com badge de Destaque Ouro e link direto para seu WhatsApp.
            </p>
          </div>
        </div>

        <a
          href="#planos"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm"
        >
          Ver Planos de Destaque
        </a>
      </div>
    );
  }

  return null;
};
