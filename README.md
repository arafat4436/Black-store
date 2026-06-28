# DARK MATTER | Premium Streetwear Store

A fully functional, modern, and ultra-premium e-commerce platform built for the "Dark Matter" streetwear brand. Featuring a strictly monochromatic stealth aesthetic, real-time cloud data sync, and a seamless user shopping experience.

![Dark Matter Store Banner](./public/images/hero-bg.png)

## 🌐 Live Demo
**[View the Live Store Here](https://arafat4436.github.io/Black-store/)**

---

## ⚡ Features

### 🛍️ Customer Experience
- **Sleek Monochromatic UI**: A highly premium, black-and-white aesthetic built with Tailwind CSS.
- **Permanent Cloud Accounts**: Users can register and log in via their phone number. Accounts are securely stored in Google Firebase.
- **Live Cloud Cart**: Cart state is saved instantly to the cloud, allowing users to switch devices without losing their selected items.
- **Real-Time Order Tracking**: Customers can track their processing and shipping status directly from the Contact page using their phone number.
- **Mobile-First Design**: Completely responsive interface tailored perfectly for smartphones, tablets, and desktop devices.

### 🛡️ Admin Command Center
- **Live Data Dashboard**: View real-time revenue, order counts, and active product metrics.
- **Order Management**: Update shipment statuses (Processing, Shipped, Delivered) instantly.
- **Product CMS**: Add new drops to the catalog directly from the Admin Panel; the live store updates immediately for all users.
- **Dual-Database Sync**: Data is stored securely in **Google Firebase Firestore** and simultaneously backed up in real-time to a **Google Sheet** for easy spreadsheet management.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Vanilla, No Component Libraries)
- **Icons:** Lucide React
- **Primary Database:** Google Firebase (Firestore)
- **Backup Data Layer:** Google Apps Script (Real-time Google Sheets Sync)
- **Deployment:** GitHub Pages

---

## 🚀 Getting Started

If you want to run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/arafat4436/Black-store.git
cd Black-store
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Firebase
- Create a new project in the [Firebase Console](https://console.firebase.google.com/).
- Enable **Firestore Database** in Test Mode.
- Update the Firebase config inside `src/lib/firebase.ts` with your own project credentials.

### 4. Run the development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 📁 Architecture Highlights

- `/src/components` - Reusable UI elements (Header, ProductCard, AuthModal, CheckoutModal).
- `/src/pages` - Main views (Home, Shop, AdminPanel, Contact).
- `/src/lib/firebase.ts` - Firebase initialization and connection.
- `/src/utils/googleSheets.ts` - Webhook integration for spreadsheet backup.

---

*Designed and engineered for the stealth aesthetic.*
