import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Ad, CreateAdFormData, PlanType, MercadoPagoPreferenceRequest } from './src/types.js';
import { INITIAL_ADS, PLANS } from './src/data/mockAds.js';
import {
  initGoogleSheets,
  saveAdToSheets,
  getAdsFromSheets,
  uploadImageToDrive,
  saveUserToSheets,
} from './server/googleWorkspace.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // In-memory ads store initialized with mock data
  let adsList: Ad[] = [...INITIAL_ADS];

  // Initialize Google Sheets tabs
  initGoogleSheets().catch((err) => console.warn('Erro ao inicializar Google Sheets:', err));

  // Initialize Mercado Pago Config
  const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000000000000000-000000-0000000000000000-000000';
  const client = new MercadoPagoConfig({ accessToken: mpAccessToken });
  const preference = new Preference(client);

  // API Routes
  // 1. GET /api/ads - List and filter ads
  app.get('/api/ads', async (req, res) => {
    try {
      const {
        query,
        category,
        city,
        minPrice,
        maxPrice,
        condition,
        planOnly,
        sortBy = 'recentes',
      } = req.query;

      // Sync with Google Sheets
      const sheetAds = await getAdsFromSheets();
      
      // Combine memory list and sheet ads, prioritizing unique IDs
      const allAdsMap = new Map<string, Ad>();
      
      // First put in-memory ads
      for (const ad of adsList) {
        allAdsMap.set(ad.id, ad);
      }

      // Then overwrite or add sheet ads
      for (const ad of sheetAds) {
        allAdsMap.set(ad.id, ad);
      }

      let filtered = Array.from(allAdsMap.values()).filter((ad) => ad.status === 'ativo');

      if (query && typeof query === 'string' && query.trim() !== '') {
        const q = query.toLowerCase().trim();
        filtered = filtered.filter(
          (ad) =>
            ad.title.toLowerCase().includes(q) ||
            ad.description.toLowerCase().includes(q) ||
            ad.category.toLowerCase().includes(q) ||
            ad.location.city.toLowerCase().includes(q)
        );
      }

      if (category && typeof category === 'string' && category !== 'todos') {
        filtered = filtered.filter((ad) => ad.category.toLowerCase() === category.toLowerCase());
      }

      if (city && typeof city === 'string' && city !== 'todas') {
        filtered = filtered.filter((ad) => ad.location.city.toLowerCase() === city.toLowerCase());
      }

      if (minPrice) {
        const minP = Number(minPrice);
        if (!isNaN(minP)) {
          filtered = filtered.filter((ad) => ad.price >= minP);
        }
      }

      if (maxPrice) {
        const maxP = Number(maxPrice);
        if (!isNaN(maxP)) {
          filtered = filtered.filter((ad) => ad.price <= maxP);
        }
      }

      if (condition && typeof condition === 'string' && condition !== 'todos') {
        filtered = filtered.filter((ad) => ad.condition === condition);
      }

      if (planOnly === 'true') {
        filtered = filtered.filter((ad) => ad.plan === 'destaque_ouro' || ad.plan === 'destaque_turbo');
      }

      // Sorting
      if (sortBy === 'menor_preco') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'maior_preco') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'relevancia') {
        filtered.sort((a, b) => {
          const priorityA = PLANS[a.plan]?.priority || 1;
          const priorityB = PLANS[b.plan]?.priority || 1;
          return priorityB - priorityA;
        });
      } else {
        // 'recentes' - default: Priority + Date
        filtered.sort((a, b) => {
          const priorityA = PLANS[a.plan]?.priority || 1;
          const priorityB = PLANS[b.plan]?.priority || 1;
          if (priorityB !== priorityA) {
            return priorityB - priorityA; // Paid ads stay at the top
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      }

      res.json({ success: true, count: filtered.length, data: filtered });
    } catch (err) {
      console.error('Error fetching ads:', err);
      res.status(500).json({ success: false, message: 'Erro ao buscar anúncios.' });
    }
  });

  // 2. GET /api/ads/:id - Single ad detail + view count increment
  app.get('/api/ads/:id', (req, res) => {
    const { id } = req.params;
    const adIndex = adsList.findIndex((a) => a.id === id);

    if (adIndex === -1) {
      return res.status(404).json({ success: false, message: 'Anúncio não encontrado.' });
    }

    // Increment view count
    adsList[adIndex].viewsCount += 1;
    res.json({ success: true, data: adsList[adIndex] });
  });

  // 3. POST /api/ads - Create new ad
  app.post('/api/ads', async (req, res) => {
    try {
      const body: CreateAdFormData = req.body;

      if (!body.title || !body.category) {
        return res.status(400).json({ success: false, message: 'Título e Categoria são obrigatórios.' });
      }

      // Process images - Upload base64 or custom images to Google Drive folder
      let finalImages: string[] = [];
      if (body.images && body.images.length > 0) {
        for (let i = 0; i < body.images.length; i++) {
          const img = body.images[i];
          if (img.startsWith('data:image')) {
            const driveUrl = await uploadImageToDrive(img, `${body.title.replace(/\s+/g, '_')}_${i}`);
            finalImages.push(driveUrl);
          } else {
            finalImages.push(img);
          }
        }
      } else {
        finalImages = ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80'];
      }

      const newAd: Ad = {
        id: `ad-${Date.now()}`,
        title: body.title,
        description: body.description || '',
        price: Number(body.price) || 0,
        negotiable: Boolean(body.negotiable),
        category: body.category,
        subcategory: body.subcategory,
        condition: body.condition || 'seminovo',
        images: finalImages,
        location: {
          city: body.city || 'São Paulo',
          state: body.state || 'SP',
          neighborhood: body.neighborhood || 'Centro',
        },
        seller: {
          name: body.sellerName || 'Anunciante VIXI',
          phone: body.sellerPhone || '(11) 99999-9999',
          whatsapp: body.sellerWhatsapp ? body.sellerWhatsapp.replace(/\D/g, '') : '5511999999999',
          email: body.sellerEmail,
          verified: true,
          rating: 5.0,
          joinedDate: 'Hoje',
        },
        plan: body.plan || 'gratuito',
        createdAt: new Date().toISOString(),
        viewsCount: 1,
        status: 'ativo',
        paymentStatus: body.plan === 'gratuito' ? 'free' : 'pending',
      };

      // Add to local memory
      adsList.unshift(newAd);

      // Save row to Google Sheets
      saveAdToSheets(newAd).catch((err) => console.error('Erro em segundo plano ao salvar no Sheets:', err));

      res.status(201).json({ success: true, data: newAd });
    } catch (err) {
      console.error('Error creating ad:', err);
      res.status(500).json({ success: false, message: 'Falha ao cadastrar o anúncio.' });
    }
  });

  // 3.5. POST /api/users - Register or log user to Google Sheets
  app.post('/api/users', async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Nome e E-mail são obrigatórios.' });
      }

      await saveUserToSheets({ name, email });
      res.json({ success: true, message: 'Usuário registrado com sucesso no Google Sheets!' });
    } catch (err) {
      console.error('Error saving user:', err);
      res.status(500).json({ success: false, message: 'Erro ao registrar usuário.' });
    }
  });

  // 4. PATCH /api/ads/:id/plan - Upgrade / confirm plan payment
  app.patch('/api/ads/:id/plan', (req, res) => {
    const { id } = req.params;
    const { plan, paymentStatus } = req.body;

    const adIndex = adsList.findIndex((a) => a.id === id);
    if (adIndex === -1) {
      return res.status(404).json({ success: false, message: 'Anúncio não encontrado.' });
    }

    if (plan && PLANS[plan as PlanType]) {
      adsList[adIndex].plan = plan as PlanType;
    }
    if (paymentStatus) {
      adsList[adIndex].paymentStatus = paymentStatus;
    }

    res.json({ success: true, data: adsList[adIndex] });
  });

  // 5. DELETE /api/ads/:id - Change ad status or remove
  app.delete('/api/ads/:id', (req, res) => {
    const { id } = req.params;
    const adIndex = adsList.findIndex((a) => a.id === id);
    if (adIndex === -1) {
      return res.status(404).json({ success: false, message: 'Anúncio não encontrado.' });
    }

    adsList[adIndex].status = 'vendido';
    res.json({ success: true, message: 'Anúncio marcado como vendido!' });
  });

  // 6. POST /api/mercadopago/create-preference - Mercado Pago Integration Endpoint
  app.post('/api/mercadopago/create-preference', async (req, res) => {
    try {
      const {
        adId,
        title,
        description,
        unitPrice,
        quantity = 1,
        planType,
        payerName,
        payerEmail,
      }: MercadoPagoPreferenceRequest = req.body;

      const origin = req.headers.origin || `http://localhost:${PORT}`;

      const preferenceBody = {
        items: [
          {
            id: adId || `plan-${planType}`,
            title: `Plano MercadoClassi: ${title}`,
            description: description || `Destaque para o anúncio #${adId}`,
            unit_price: Number(unitPrice),
            quantity: Number(quantity),
            currency_id: 'BRL',
          },
        ],
        payer: {
          name: payerName || 'Cliente Anunciante',
          email: payerEmail || 'cliente@exemplo.com.br',
        },
        back_urls: {
          success: `${origin}/?payment=success&adId=${adId}`,
          pending: `${origin}/?payment=pending&adId=${adId}`,
          failure: `${origin}/?payment=failure&adId=${adId}`,
        },
        auto_return: 'approved' as const,
        notification_url: `${origin}/api/mercadopago/webhook`,
        statement_descriptor: 'CLASSIFICADOS',
        external_reference: adId || `REF-${Date.now()}`,
      };

      let preferenceId = `MP-PREF-${Date.now()}`;
      let initPoint = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`;
      let sandboxInitPoint = `https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`;

      try {
        // Try calling actual Mercado Pago API if configured or fallback seamlessly
        const response = await preference.create({ body: preferenceBody });
        if (response && response.id) {
          preferenceId = response.id;
          initPoint = response.init_point || initPoint;
          sandboxInitPoint = response.sandbox_init_point || sandboxInitPoint;
        }
      } catch (sdkError) {
        console.warn('Mercado Pago SDK API using sandbox fallback mode:', sdkError);
      }

      // Generate PIX simulated copy-paste code
      const fakePixKey = `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substring(2, 12)}520400005303986540${Number(unitPrice).toFixed(2).replace('.', '')}5802BR5916MERCADOCLASSI6009SAO PAULO62070503***6304`;

      // Update ad status to pending if adId exists
      if (adId) {
        const adIndex = adsList.findIndex((a) => a.id === adId);
        if (adIndex !== -1) {
          adsList[adIndex].mercadoPagoPreferenceId = preferenceId;
        }
      }

      return res.json({
        success: true,
        preferenceId,
        initPoint,
        sandboxInitPoint,
        pixCode: fakePixKey,
        boletoCode: `34191.79001 01043.510047 91020.150008 8 ${Math.floor(Math.random() * 89999999 + 10000000)}`,
        amount: Number(unitPrice),
        planName: title,
      });
    } catch (err) {
      console.error('Error creating Mercado Pago Preference:', err);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar a preferência de pagamento do Mercado Pago.',
      });
    }
  });

  // 7. POST /api/mercadopago/webhook - Mercado Pago IPN Callback Handler
  app.post('/api/mercadopago/webhook', (req, res) => {
    console.log('Received Mercado Pago Webhook IPN Notification:', req.body);
    const { data, type } = req.body;
    if (type === 'payment' && data?.id) {
      console.log(`Payment #${data.id} updated!`);
    }
    res.status(200).send('OK');
  });

  // Serve Vite in development mode vs static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
