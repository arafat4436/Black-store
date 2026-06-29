# DARK MATTER | Premium Streetwear Store

A fully functional, modern, and ultra-premium e-commerce platform built for the "Dark Matter" streetwear brand. Featuring a strictly monochromatic stealth aesthetic, real-time cloud data sync, automated notifications, and a seamless user shopping experience.

![Dark Matter Store Banner](./public/images/hero-bg.png)

## 🌐 Live Demo
**[View the Live Store Here](https://arafat4436.github.io/Black-store/)**

---

## ⚡ Features

### 🛍️ Customer Experience
- **Sleek Monochromatic UI**: A highly premium, black-and-white aesthetic built with Tailwind CSS.
- **Permanent Cloud Accounts**: Users can register and log in securely using Firebase Email Authentication with password reset functionality.
- **Live Cloud Cart**: Cart state is saved instantly to the cloud, allowing users to switch devices without losing their selected items.
- **Account Dashboard**: Customers have a dedicated profile panel to view their complete order history and track live shipment statuses.
- **Automated Email Receipts**: Customers instantly receive a beautifully formatted HTML email confirmation (powered by EmailJS) whenever they place an order.
- **Mobile-First Design**: Completely responsive interface tailored perfectly for smartphones, tablets, and desktop devices.

### 🛡️ Admin Command Center
- **Live Data Dashboard**: View real-time revenue, order counts, and active product metrics.
- **Order Management**: Update shipment statuses (Processing, Shipped, Delivered) instantly.
- **Product CMS (ImgBB)**: Full CRUD (Create, Read, Update, Delete) capability for products directly in the browser. Features a drag-and-drop image uploader that automatically hosts images for free on ImgBB.
- **Customer Database**: View a real-time table of all registered users and their contact info.
- **Telegram Notifications**: The Admin instantly receives a Telegram message on their phone via a custom bot whenever a new order is placed.
- **Dual-Database Sync**: Data is stored securely in **Google Firebase Firestore** and simultaneously backed up to a **Google Sheet** for easy spreadsheet management.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Vanilla, No Component Libraries)
- **Database & Auth:** Google Firebase (Firestore & Authentication)
- **Image Hosting:** ImgBB API
- **Notifications:** Telegram Bot API (Admin) & EmailJS (Customers)
- **Backup Data Layer:** Google Apps Script (Real-time Google Sheets Sync)
- **CI/CD Deployment:** GitHub Actions automatically builds and deploys to GitHub Pages on every push to `main`.

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

### 3. Setup Environment Variables
You will need to replace the configuration keys in the following files with your own credentials if you fork this project:
- `src/lib/firebase.ts` (Firebase Config)
- `src/utils/notifications.ts` (Telegram Bot Token & EmailJS Keys)
- `src/pages/AdminPanel.tsx` (ImgBB API Key)

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
- `/src/pages` - Main views (Home, Shop, AdminPanel, Account, Contact).
- `/src/utils` - Notification logic (Telegram/EmailJS) and Google Sheets webhook integration.
- `.github/workflows` - CI/CD pipeline for GitHub Pages deployment.

---

*Designed and engineered for the stealth aesthetic.*
