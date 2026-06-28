import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsuFcaRHRcXJuo5WDqoFVOPv2eEKN_SDc",
  authDomain: "black-store-d3e6e.firebaseapp.com",
  projectId: "black-store-d3e6e",
  storageBucket: "black-store-d3e6e.firebasestorage.app",
  messagingSenderId: "144765848992",
  appId: "1:144765848992:web:bc7720023aec928462a8c5",
  measurementId: "G-W54C9M6HQ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
