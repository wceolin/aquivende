import React from 'react';
import { ExternalLink, ShieldCheck, Settings, Award } from 'lucide-react';
import { PartnerConfig } from '../types';

interface PartnerTopBarProps {
  partner: PartnerConfig;
  onOpenAdmin: () => void;
}

export const PartnerTopBar: React.FC<PartnerTopBarProps> = ({
  partner,
  onOpenAdmin,
}) => {
  if (!partner.active) return null;

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Partner Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
            <Award className="w-3 h-3 text-amber-400" />
            <span>Parceiro Oficial</span>
          </div>

          <a
            href={partner.websiteUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity truncate"
          >
            {partner.logoUrl ? (
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="h-6 max-w-[120px] object-contain rounded bg-white/10 p-0.5"
              />
            ) : (
              <div className="w-6 h-6 rounded bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                {partner.name.charAt(0)}
              </div>
            )}

            <div className="truncate">
              <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                {partner.name}
              </span>
              {partner.tagline && (
                <span className="hidden sm:inline text-slate-400 text-[11px] ml-2 font-normal">
                  — {partner.tagline}
                </span>
              )}
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-400 shrink-0" />
          </a>
        </div>

        {/* Right Admin Link */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-all"
            title="Acessar Painel de Administração"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span>Painel Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
