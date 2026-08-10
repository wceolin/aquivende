import React, { useState } from 'react';
import {
  X,
  Settings,
  Award,
  Building,
  BarChart3,
  Save,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PartnerConfig, CompanyBannerConfig } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: PartnerConfig;
  onSavePartner: (newPartner: PartnerConfig) => void;
  companyBanners: CompanyBannerConfig[];
  onSaveCompanyBanners: (newBanners: CompanyBannerConfig[]) => void;
  totalAdsCount: number;
  featuredAdsCount: number;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  partner,
  onSavePartner,
  companyBanners,
  onSaveCompanyBanners,
  totalAdsCount,
  featuredAdsCount,
}) => {
  const [activeTab, setActiveTab] = useState<'partner' | 'company_ads' | 'stats'>('partner');

  // Partner Form State
  const [partnerName, setPartnerName] = useState(partner.name);
  const [partnerLogoUrl, setPartnerLogoUrl] = useState(partner.logoUrl);
  const [partnerTagline, setPartnerTagline] = useState(partner.tagline);
  const [partnerWebsiteUrl, setPartnerWebsiteUrl] = useState(partner.websiteUrl);
  const [partnerActive, setPartnerActive] = useState(partner.active);
  const [partnerSavedAlert, setPartnerSavedAlert] = useState(false);

  // Banners State
  const [banners, setBanners] = useState<CompanyBannerConfig[]>(companyBanners);
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  if (!isOpen) return null;

  const handleSavePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePartner({
      name: partnerName,
      logoUrl: partnerLogoUrl,
      tagline: partnerTagline,
      websiteUrl: partnerWebsiteUrl,
      active: partnerActive,
    });
    setPartnerSavedAlert(true);
    setTimeout(() => setPartnerSavedAlert(false), 2500);
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newTitle) return;

    const item: CompanyBannerConfig = {
      id: 'banner_' + Date.now(),
      companyName: newCompany,
      title: newTitle,
      bannerUrl: newBannerUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80',
      linkUrl: newLinkUrl || '#',
      active: true,
      position: 'top',
    };

    const updated = [item, ...banners];
    setBanners(updated);
    onSaveCompanyBanners(updated);

    setNewCompany('');
    setNewTitle('');
    setNewBannerUrl('');
    setNewLinkUrl('');
  };

  const handleDeleteBanner = (id: string) => {
    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);
    onSaveCompanyBanners(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Acesso Restrito
                </span>
                <span className="text-xs text-slate-400">VIXI Core</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">Painel do Administrador VIXI</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('partner')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'partner'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Parceiro Oficial (Topo)</span>
          </button>

          <button
            onClick={() => setActiveTab('company_ads')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'company_ads'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Anunciar Empresa ({banners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'stats'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Métricas do Sistema</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: Partner Logo & Config */}
          {activeTab === 'partner' && (
            <form onSubmit={handleSavePartnerSubmit} className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
                <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                  💡 Logo do Parceiro Oficial no Topo do Site
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  As informações configuradas aqui são salvas para a plataforma VIXI.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Exibir Banner de Parceiro no Topo
                </span>
                <input
                  type="checkbox"
                  checked={partnerActive}
                  onChange={(e) => setPartnerActive(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Parceiro Oficial *
                </label>
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Ex: TechStore Brasil"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL do Logo do Parceiro (Imagem PNG/SVG)
                </label>
                <input
                  type="text"
                  value={partnerLogoUrl}
                  onChange={(e) => setPartnerLogoUrl(e.target.value)}
                  placeholder="https://exemplo.com/logo-parceiro.png"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Slogan ou Frase Promocional
                </label>
                <input
                  type="text"
                  value={partnerTagline}
                  onChange={(e) => setPartnerTagline(e.target.value)}
                  placeholder="Ex: A maior loja de eletrônicos e seminovos da região com garantia"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Link Oficial do Parceiro
                </label>
                <input
                  type="text"
                  value={partnerWebsiteUrl}
                  onChange={(e) => setPartnerWebsiteUrl(e.target.value)}
                  placeholder="https://techstore.com.br"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {partnerSavedAlert && (
                <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Configurações do Parceiro salvas com sucesso!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações do Parceiro</span>
              </button>
            </form>
          )}

          {/* TAB 2: Company Ads Management */}
          {activeTab === 'company_ads' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  Anunciar Empresa (Publicidade B2B)
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Cadastre empresas parceiras e campanhas patrocinadas ativas na plataforma.
                </p>
              </div>

              {/* Form Add New Company Banner */}
              <form onSubmit={handleAddBanner} className="p-4 bg-slate-100 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">
                  Cadastrar Nova Empresa Parceira
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Nome da Empresa (Ex: Imobiliária Alfa)"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Título da Oferta / Chamada"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="URL da Imagem do Banner (Opcional)"
                    value={newBannerUrl}
                    onChange={(e) => setNewBannerUrl(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-[11px] text-slate-900 dark:text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Link do Site (URL Externa)"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-[11px] text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Anúncio de Empresa</span>
                </button>
              </form>

              {/* Banners List */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">
                  Empresas Cadastradas ({banners.length})
                </h5>

                {banners.length === 0 ? (
                  <p className="text-slate-400 py-4 text-center">Nenhuma empresa parceira cadastrada.</p>
                ) : (
                  banners.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          {b.companyName}
                        </span>
                        <h5 className="font-bold text-slate-900 dark:text-white mt-1 truncate">
                          {b.title}
                        </h5>
                        <p className="text-[10px] font-mono text-slate-400 truncate">
                          {b.linkUrl}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteBanner(b.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                        title="Remover Empresa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: System Statistics */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300 block">
                    Total de Anúncios no Servidor
                  </span>
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {totalAdsCount}
                  </span>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-center">
                  <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300 block">
                    Destaques Ativos Mercado Pago
                  </span>
                  <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                    {featuredAdsCount}
                  </span>
                </div>
              </div>

              <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-300">Receita Total de Destaques MP</span>
                  <span className="text-lg font-black text-emerald-400">
                    R$ {(featuredAdsCount * 29.9).toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Integrado via API Mercado Pago SDK v2 (Checkout Pro com PIX instantâneo e Cartão de Crédito).
                </p>
              </div>

              {/* Google Sheets & Drive Integration Info */}
              <div className="p-5 bg-slate-800/80 text-white rounded-2xl border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-xs text-white">Google Sheets & Drive Integrados</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Ao Vivo
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Os anúncios, fotos e cadastros de usuários são sincronizados em tempo real com a sua planilha oficial do Google Sheets e pasta de imagens no Google Drive.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href="https://docs.google.com/spreadsheets/d/1qF_KYPqLoHuMh8gLA5pXXvqzPrKUj_ReCeFOQuEHZxs/edit?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center text-[11px] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>📊 Abrir Planilha (Sheets)</span>
                  </a>

                  <a
                    href="https://drive.google.com/drive/folders/1jJj0qnzg1mj4yCaJusoUaMcPx0rypu7a?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-[11px] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>📁 Pasta de Fotos (Drive)</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
