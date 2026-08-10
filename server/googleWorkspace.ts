import { google } from 'googleapis';
import { Readable } from 'stream';
import { Ad, CreateAdFormData } from '../src/types.js';

const SPREADSHEET_ID = '1qF_KYPqLoHuMh8gLA5pXXvqzPrKUj_ReCeFOQuEHZxs';
const DRIVE_FOLDER_ID = '1jJj0qnzg1mj4yCaJusoUaMcPx0rypu7a';

// Initialize Google OAuth / Auth Client
function getAuth() {
  return new google.auth.GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });
}

function getSheetsClient() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

function getDriveClient() {
  const auth = getAuth();
  return google.drive({ version: 'v3', auth });
}

/**
 * Ensure Sheets tabs (Anuncios, Usuarios) exist and have headers.
 */
export async function initGoogleSheets() {
  try {
    const sheets = getSheetsClient();
    
    // Check existing sheets
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetTitles = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    
    const requests = [];

    if (!sheetTitles.includes('Anuncios')) {
      requests.push({
        addSheet: {
          properties: { title: 'Anuncios' }
        }
      });
    }

    if (!sheetTitles.includes('Usuarios')) {
      requests.push({
        addSheet: {
          properties: { title: 'Usuarios' }
        }
      });
    }

    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests }
      });
      console.log('Criadas abas "Anuncios" e "Usuarios" na planilha VIXI.');
    }

    // Check headers for 'Anuncios'
    const anunciosHeaders = [
      'ID', 'Título', 'Categoria', 'Subcategoria', 'Preço', 'Condição', 
      'Negociável', 'Cidade', 'Estado', 'Bairro', 'Anunciante', 'Telefone', 
      'WhatsApp', 'Email', 'Plano', 'Imagens', 'Data Criacao', 
      'Visualizacoes', 'Status', 'PaymentStatus'
    ];

    const anunciosRange = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Anuncios!A1:T1',
    });

    if (!anunciosRange.data.values || anunciosRange.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Anuncios!A1:T1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [anunciosHeaders] }
      });
    }

    // Check headers for 'Usuarios'
    const usuariosHeaders = ['Nome', 'Email', 'Data Cadastro', 'Origem'];
    const usuariosRange = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Usuarios!A1:D1',
    });

    if (!usuariosRange.data.values || usuariosRange.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Usuarios!A1:D1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [usuariosHeaders] }
      });
    }

    console.log('Google Sheets VIXI inicializado com sucesso!');
  } catch (err: any) {
    console.warn('Google Sheets init warning (OAuth/Permission):', err?.message || err);
  }
}

/**
 * Append a user registration row to 'Usuarios' sheet
 */
export async function saveUserToSheets(user: { name: string; email: string }) {
  try {
    const sheets = getSheetsClient();
    const row = [
      user.name,
      user.email,
      new Date().toLocaleString('pt-BR'),
      'VIXI App'
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Usuarios!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row]
      }
    });

    console.log(`Usuário ${user.email} salvo na planilha Google Sheets.`);
    return true;
  } catch (err: any) {
    console.error('Erro ao salvar usuário no Google Sheets:', err?.message || err);
    return false;
  }
}

/**
 * Upload a image (base64 data URL or buffer) to Google Drive folder
 */
export async function uploadImageToDrive(base64DataUrl: string, fileName: string): Promise<string> {
  try {
    if (!base64DataUrl.startsWith('data:image')) {
      // It's already an external HTTP URL
      return base64DataUrl;
    }

    const drive = getDriveClient();

    // Extract mime type and buffer
    const matches = base64DataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches) {
      return base64DataUrl;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const fileMetadata = {
      name: `${fileName}_${Date.now()}.jpg`,
      parents: [DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType,
      body: stream,
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = file.data.id;

    if (fileId) {
      // Set permissions to anyone with link can view
      try {
        await drive.permissions.create({
          fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
      } catch (permErr) {
        console.warn('Permissão pública no Drive aviso:', permErr);
      }

      // Public direct thumbnail URL that renders cleanly in <img> tags
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }

    return base64DataUrl;
  } catch (err: any) {
    console.error('Erro ao fazer upload da imagem no Google Drive:', err?.message || err);
    return base64DataUrl;
  }
}

/**
 * Append an Ad row to 'Anuncios' sheet
 */
export async function saveAdToSheets(ad: Ad) {
  try {
    const sheets = getSheetsClient();
    const row = [
      ad.id,
      ad.title,
      ad.category,
      ad.subcategory || '',
      ad.price,
      ad.condition,
      ad.negotiable ? 'Sim' : 'Não',
      ad.location.city,
      ad.location.state,
      ad.location.neighborhood,
      ad.seller.name,
      ad.seller.phone,
      ad.seller.whatsapp,
      ad.seller.email || '',
      ad.plan,
      ad.images.join(' | '),
      ad.createdAt,
      ad.viewsCount,
      ad.status,
      ad.paymentStatus
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Anuncios!A:T',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row]
      }
    });

    console.log(`Anúncio ${ad.title} (${ad.id}) salvo na planilha Google Sheets!`);
    return true;
  } catch (err: any) {
    console.error('Erro ao salvar anúncio no Google Sheets:', err?.message || err);
    return false;
  }
}

/**
 * Fetch all Ads stored in Google Sheets
 */
export async function getAdsFromSheets(): Promise<Ad[]> {
  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Anuncios!A2:T1000',
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    const fetchedAds: Ad[] = rows.map((row) => {
      const [
        id, title, category, subcategory, price, condition,
        negotiable, city, state, neighborhood, sellerName,
        sellerPhone, sellerWhatsapp, sellerEmail, plan, imagesStr,
        createdAt, viewsCount, status, paymentStatus
      ] = row;

      const imagesList = imagesStr ? imagesStr.split(' | ').map((s: string) => s.trim()).filter(Boolean) : [];

      return {
        id: id || `ad-${Math.random().toString(36).substring(2, 8)}`,
        title: title || 'Anúncio sem título',
        description: `Anúncio cadastrado via Google Sheets`,
        price: Number(price) || 0,
        negotiable: negotiable === 'Sim',
        category: category || 'Outros',
        subcategory: subcategory || '',
        condition: (condition as any) || 'seminovo',
        images: imagesList.length > 0 ? imagesList : [
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80',
        ],
        location: {
          city: city || 'São Paulo',
          state: state || 'SP',
          neighborhood: neighborhood || 'Centro',
        },
        seller: {
          name: sellerName || 'Anunciante VIXI',
          phone: sellerPhone || '(11) 99999-9999',
          whatsapp: sellerWhatsapp || '5511999999999',
          email: sellerEmail || '',
          verified: true,
          rating: 5.0,
          joinedDate: 'VIXI Partner',
        },
        plan: (plan as any) || 'gratuito',
        createdAt: createdAt || new Date().toISOString(),
        viewsCount: Number(viewsCount) || 1,
        status: (status as any) || 'ativo',
        paymentStatus: (paymentStatus as any) || 'free',
      };
    });

    return fetchedAds;
  } catch (err: any) {
    console.warn('Aviso ao buscar anúncios do Google Sheets:', err?.message || err);
    return [];
  }
}
