// Google Sheets Integration Utility
// Sends user registration and order data to Google Sheets in real-time
// via a Google Apps Script web app.
//
// Uses GET with query parameters instead of POST because Google Apps Script
// redirects (302) POST requests, and browsers convert POST→GET on redirect,
// causing doPost() to never fire. Using doGet() with encoded data is reliable.

const GOOGLE_SHEET_URL_KEY = 'dark_matter_google_sheet_url';

export const getGoogleSheetUrl = (): string => {
  return localStorage.getItem(GOOGLE_SHEET_URL_KEY) || '';
};

export const setGoogleSheetUrl = (url: string): void => {
  localStorage.setItem(GOOGLE_SHEET_URL_KEY, url);
};

interface UserPayload {
  type: 'user';
  name: string;
  phone: string;
  email?: string;
}

interface OrderPayload {
  type: 'order';
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  total: number;
  paymentMethod: string;
  date: string;
}

type SheetPayload = UserPayload | OrderPayload;

export const sendToGoogleSheet = async (payload: SheetPayload): Promise<boolean> => {
  const url = getGoogleSheetUrl();
  if (!url) {
    console.warn('[GoogleSheets] No Google Sheet URL configured. Skipping sync.');
    return false;
  }

  try {
    // Encode the entire payload as a single query parameter.
    // Using GET avoids the 302 redirect issue that breaks POST requests
    // to Google Apps Script from browser fetch().
    const params = new URLSearchParams();
    params.append('data', JSON.stringify(payload));
    
    const fullUrl = `${url}?${params.toString()}`;
    
    await fetch(fullUrl, {
      method: 'GET',
      mode: 'no-cors',
    });
    
    console.log(`[GoogleSheets] Successfully sent ${payload.type} data.`);
    return true;
  } catch (error) {
    console.error('[GoogleSheets] Failed to send data:', error);
    return false;
  }
};
