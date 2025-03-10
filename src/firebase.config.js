import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBa36uwRWtO7LzOOEJaQCkrBB_sxR3rqi8",
  authDomain: "house-marketplace-7d6ed.firebaseapp.com",
  projectId: "house-marketplace-7d6ed",
  storageBucket: "house-marketplace-7d6ed.firebasestorage.app",
  messagingSenderId: "20435275072",
  appId: "1:20435275072:web:d301de0b95c580b4c9fea5",
  measurementId: "G-ZJEZ2VQ52J",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const storage = getStorage();
