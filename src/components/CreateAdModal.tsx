import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Sparkles,
  Upload,
  Check,
  ShieldCheck,
  Zap,
  Tag,
  DollarSign,
  MapPin,
  User,
  Phone,
  MessageSquare,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { CreateAdFormData, PlanType } from '../types';
import { CATEGORIES, PLANS } from '../data/mockAds';

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAd: (data: CreateAdFormData) => Promise<void>;
}

export const CreateAdModal: React.FC<CreateAdModalProps> = ({
  isOpen,
  onClose,
  onSubmitAd,
}) => {
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [subcategory, setSubcategory] = useState('Geral');
  const [condition, setCondition] = useState<'novo' | 'usado' | 'seminovo'>('seminovo');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80',
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Seller info
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerWhatsapp, setSellerWhatsapp] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [neighborhood, setNeighborhood] = useState('Centro');

  // Plan Selection
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('destaque_ouro');

  if (!isOpen) return null;

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim() !== '') {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !sellerName || !sellerPhone) {
      alert('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    setLoading(true);
    try {
      await onSubmitAd({
        title,
        description,
        price: Number(price),
        negotiable,
        category,
        subcategory,
        condition,
        images: images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80',
        ],
        sellerName,
        sellerPhone,
        sellerWhatsapp: sellerWhatsapp || sellerPhone,
        sellerEmail,
        city,
        state,
        neighborhood,
        plan: selectedPlan,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Criar Novo Anúncio</h2>
              <p className="text-xs text-slate-300">
                Anuncie grátis ou escolha um Plano de Destaque no Mercado Pago
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-8 flex-1 text-xs">
          {/* Section 1: Product Basics */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>1. Informações Básicas do Produto / Serviço</span>
            </h3>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Título do Anúncio *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: iPhone 15 Pro Max 256GB - Estado de Novo na Caixa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Categoria *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estado de Conservação
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="novo">Novo na caixa</option>
                  <option value="seminovo">Seminovo / Pouco Uso</option>
                  <option value="usado">Usado</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preço (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">R$</span>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Descrição Detalhada
              </label>
              <textarea
                rows={3}
                placeholder="Descreva as características, estado de conservação, acessórios e detalhes de entrega..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Section 2: Photos Upload Simulation */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>2. Fotos do Anúncio</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cole a URL da foto (ou use a imagem padrão pré-carregada)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700"
              >
                Adicionar Foto
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-700">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Contact & Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>3. Dados do Anunciante & Localização</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Seu Nome / Nome Comercial *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Silva"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="(11) 98765-4321"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cidade *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="São Paulo">São Paulo (SP)</option>
                  <option value="Rio de Janeiro">Rio de Janeiro (RJ)</option>
                  <option value="Curitiba">Curitiba (PR)</option>
                  <option value="Belo Horizonte">Belo Horizonte (MG)</option>
                  <option value="Porto Alegre">Porto Alegre (RS)</option>
                  <option value="Florianópolis">Florianópolis (SC)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pinheiros, Jardins, Centro..."
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Plan Selection (Gratuito vs Mercado Pago Destaque) */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>4. Selecione o Plano do Anúncio</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Mercado Pago Checkout Inteligente
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Plan 1: Gratuito */}
              <div
                onClick={() => setSelectedPlan('gratuito')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedPlan === 'gratuito'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Gratuito</span>
                    {selectedPlan === 'gratuito' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <span className="text-xl font-black text-slate-900 dark:text-white">R$ 0,00</span>
                  <p className="text-[11px] text-slate-500 mt-1">Válido por 30 dias</p>
                  <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1">✓ Posição padrão na busca</li>
                    <li className="flex items-center gap-1">✓ Contato via WhatsApp</li>
                  </ul>
                </div>
              </div>

              {/* Plan 2: Destaque Ouro */}
              <div
                onClick={() => setSelectedPlan('destaque_ouro')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                  selectedPlan === 'destaque_ouro'
                    ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 ring-2 ring-amber-400/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-amber-300'
                }`}
              >
                <span className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-bl">
                  POPULAR ⭐
                </span>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-amber-800 dark:text-amber-300 text-sm">Destaque Ouro</span>
                    {selectedPlan === 'destaque_ouro' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                  </div>
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">R$ 29,90</span>
                  <p className="text-[11px] text-slate-500 mt-1">3x mais visualizações</p>
                  <ul className="mt-3 space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    <li className="flex items-center gap-1">⭐ Fixado no topo da categoria</li>
                    <li className="flex items-center gap-1">⭐ Borda e Badge Ouro</li>
                    <li className="flex items-center gap-1">⭐ PIX / Cartão Mercado Pago</li>
                  </ul>
                </div>
              </div>

              {/* Plan 3: Patrocinado Turbo */}
              <div
                onClick={() => setSelectedPlan('destaque_turbo')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedPlan === 'destaque_turbo'
                    ? 'border-emerald-500 bg-emerald-950/40 text-white ring-2 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-emerald-400 text-sm">Patrocinado Turbo 🚀</span>
                    {selectedPlan === 'destaque_turbo' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-xl font-black text-emerald-400">R$ 59,90</span>
                  <p className="text-[11px] text-slate-400 mt-1">Válido por 60 dias</p>
                  <ul className="mt-3 space-y-1.5 text-[11px] text-slate-300 font-medium">
                    <li className="flex items-center gap-1">🚀 Prioridade máxima na Home</li>
                    <li className="flex items-center gap-1">🚀 Botão direto no Card</li>
                    <li className="flex items-center gap-1">🚀 Mercado Pago Checkout</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 active:scale-95 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publicando Anúncio...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>
                    {selectedPlan === 'gratuito'
                      ? 'Publicar Anúncio Grátis'
                      : `Publicar e Pagar ${PLANS[selectedPlan].formattedPrice} via Mercado Pago`}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
