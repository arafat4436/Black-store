// Google Sheets Integration Utility
// Sends user registration and order data to Google Sheets in real-time
// via a Google Apps Script web app.
//
// Uses GET with query parameters instead of POST because Google Apps Script
// redirects (302) POST requests, and browsers convert POST→GET on redirect,
// causing doPost() to never fire. Using doGet() with encoded data is reliable.

// Hardcoded URL so it works for all customers across all devices
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycby9NoS23H23zwPDLh0jmwkFX_nifAEwlZXkyTybIRNmWOUxaerhz_ey_oHWJuo0vwPeMA/exec';

export const getGoogleSheetUrl = (): string => {
  return GOOGLE_SHEET_URL;
};

export const setGoogleSheetUrl = (_url: string): void => {
  // Deprecated since it is hardcoded now
  console.log("Google Sheet URL is now hardcoded.");
};

interface UserPayload {
  type: 'user';
  name: string;
  phone: string;
  email?: string;
  password?: string;
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
