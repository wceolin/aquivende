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
  ArrowLeft,
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
  const [city, setCity] = useState('');
  const [state, setState] = useState('ES');
  const [neighborhood, setNeighborhood] = useState('');

  // Plan Selection
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('destaque_ouro');

  if (!isOpen) return null;

  const maxImages = selectedPlan === 'gratuito' ? 3 : 7;

  const handleAddImageUrl = () => {
    if (images.length >= maxImages) {
      alert(`O plano ${selectedPlan === 'gratuito' ? 'Gratuito' : 'Pago'} permite no máximo ${maxImages} fotos. Escolha um plano de destaque para até 7 fotos.`);
      return;
    }
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
        <div className="bg-slate-900 text-white shrink-0 border-b border-slate-800">
          {/* Line 1: Site logo VIXI and Close button */}
          <div className="p-3 sm:px-5 flex items-center justify-between border-b border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2 text-white hover:opacity-90 cursor-pointer"
              title="Voltar para a Página Inicial"
            >
              <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-base shadow-sm">
                V
              </div>
              <span>VIXI</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Line 2: Navigation Back Row */}
          <div className="p-3 sm:px-5 flex items-center justify-between bg-slate-950/60 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Início</span>
              </button>
              <h2 className="text-sm font-bold text-white">Criar Anúncio</h2>
            </div>

            <span className="text-[11px] font-medium text-slate-300 hidden sm:inline">
              Anuncie grátis ou escolha Destaque
            </span>
          </div>
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

          {/* Section 2: Photos Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>2. Fotos do Anúncio ({images.length}/{maxImages})</span>
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                selectedPlan === 'gratuito'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              }`}>
                {selectedPlan === 'gratuito' ? 'Até 3 fotos no Plano Grátis' : 'Até 7 fotos no Plano Pago'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Cole a URL da foto ou selecione do dispositivo ->"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3.5 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 text-xs shrink-0"
                >
                  Add URL
                </button>

                <label className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5 text-xs shrink-0 shadow-xs">
                  <ImageIcon className="w-4 h-4" />
                  <span>Subir Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;

                      if (images.length >= maxImages) {
                        alert(`O plano ${selectedPlan === 'gratuito' ? 'Gratuito' : 'Pago'} permite no máximo ${maxImages} fotos. Escolha um plano de destaque para até 7 fotos.`);
                        return;
                      }

                      const slotsLeft = maxImages - images.length;
                      const filesToLoad = Array.from(files).slice(0, slotsLeft);

                      if (files.length > slotsLeft) {
                        alert(`Você selecionou ${files.length} imagens. Foram carregadas apenas ${slotsLeft} para não ultrapassar o limite de ${maxImages} fotos do seu plano.`);
                      }

                      for (let i = 0; i < filesToLoad.length; i++) {
                        const file = filesToLoad[i] as File;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const res = ev.target?.result as string;
                          if (res) {
                            setImages((prev) => {
                              if (prev.length >= maxImages) return prev;
                              return [...prev, res];
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
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
                <input
                  type="text"
                  required
                  placeholder="Digite sua cidade (ex: Vitória, Vila Velha, São Paulo...)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  placeholder="Digite seu bairro (ex: Praia do Canto, Centro, Jardins...)"
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
