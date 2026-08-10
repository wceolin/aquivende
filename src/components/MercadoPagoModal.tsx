import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  QrCode,
  CreditCard,
  Barcode,
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  Clock,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { MercadoPagoPreferenceResponse, PlanType } from '../types';
import { PLANS } from '../data/mockAds';

interface MercadoPagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferenceData: MercadoPagoPreferenceResponse | null;
  adTitle: string;
  planType: PlanType;
  onPaymentSuccess: () => void;
}

export const MercadoPagoModal: React.FC<MercadoPagoModalProps> = ({
  isOpen,
  onClose,
  preferenceData,
  adTitle,
  planType,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [installments, setInstallments] = useState('1');

  if (!isOpen || !preferenceData) return null;

  const planInfo = PLANS[planType] || PLANS.destaque_ouro;

  const handleCopyPix = () => {
    if (preferenceData.pixCode) {
      navigator.clipboard.writeText(preferenceData.pixCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Mercado Pago Branding */}
        <div className="bg-gradient-to-r from-[#009EE3] to-[#007EB5] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
              <span className="font-black text-xl tracking-tighter">mp</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white">
                  Checkout Pro
                </span>
                <span className="text-[10px] text-white/80 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Seguro 256-bit
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">Mercado Pago Payments</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {paymentDone ? (
            /* Payment Success Screen */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Pagamento Aprovado!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Seu anúncio <strong className="text-slate-900 dark:text-white">"{adTitle}"</strong> foi promovido com sucesso para o plano{' '}
                <span className="text-emerald-600 font-bold">{planInfo.name}</span>!
              </p>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-left text-xs space-y-2">
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>ID da Transação MP:</span>
                  <span className="font-mono">{preferenceData.preferenceId}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>Status do Destaque:</span>
                  <span className="text-emerald-600 font-bold">Ativo no Topo por {planInfo.durationDays} dias</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Box */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Selecionado</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{planInfo.name} - VIXI</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Anúncio: {adTitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Valor Total</span>
                  <span className="text-xl font-black text-[#009EE3]">{planInfo.formattedPrice}</span>
                </div>
              </div>

              {/* Payment Methods Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('pix')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'pix'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>PIX (Instantâneo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'card'
                      ? 'bg-blue-50 text-blue-700 border-blue-500 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Cartão em 12x</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('boleto')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'boleto'
                      ? 'bg-slate-100 text-slate-900 border-slate-400 dark:bg-slate-700 dark:text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Barcode className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <span>Boleto Bancário</span>
                </button>
              </div>

              {/* Tab Content - PIX */}
              {activeTab === 'pix' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-center">
                    <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto shadow-md border border-slate-200 flex items-center justify-center mb-3">
                      {/* Generates realistic QR Code Graphic */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          preferenceData.pixCode || 'pix-classiquick-test'
                        )}`}
                        alt="PIX QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                      Escaneie com o app do seu banco ou copie a chave abaixo:
                    </p>

                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <input
                        type="text"
                        readOnly
                        value={preferenceData.pixCode || ''}
                        className="w-full text-xs font-mono bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none truncate"
                      />
                      <button
                        onClick={handleCopyPix}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirmando PIX no Mercado Pago...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Já fiz o Pagamento via PIX</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Tab Content - Credit Card */}
              {activeTab === 'card' && (
                <div className="space-y-3 animate-fade-in text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número do Cartão de Crédito
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#009EE3] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nome impresso no Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="NOME SOBRENOME"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#009EE3] outline-none uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Validade (MM/AA)
                      </label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#009EE3] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#009EE3] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Parcelas Mercado Pago
                    </label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#009EE3] outline-none"
                    >
                      <option value="1">1x de {planInfo.formattedPrice} (sem juros)</option>
                      <option value="2">2x de R$ {(planInfo.price / 2).toFixed(2)}</option>
                      <option value="3">3x de R$ {(planInfo.price / 3).toFixed(2)}</option>
                      <option value="6">6x de R$ {(planInfo.price / 6).toFixed(2)}</option>
                      <option value="12">12x de R$ {(planInfo.price / 12).toFixed(2)}</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#009EE3] hover:bg-[#007EB5] text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processando no Mercado Pago...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pagar {planInfo.formattedPrice} com Mercado Pago</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Tab Content - Boleto */}
              {activeTab === 'boleto' && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Linha Digitável do Boleto:
                    </p>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl font-mono text-slate-900 dark:text-white text-xs break-all border border-slate-200 dark:border-slate-700 mb-3">
                      {preferenceData.boletoCode}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Vencimento em 3 dias úteis. A aprovação ocorre em até 24h após o pagamento.
                    </p>
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Barcode className="w-4 h-4" />
                    )}
                    <span>Simular Confirmação do Boleto</span>
                  </button>
                </div>
              )}

              {/* External Mercado Pago Checkout Link */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <a
                  href={preferenceData.initPoint}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#009EE3] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Abrir página oficial do Mercado Pago em nova aba</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
