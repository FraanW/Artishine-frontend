import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "artisan-ai-backend.firebaseapp.com",
    projectId: "artisan-ai-backend",
    storageBucket: "artisan-ai-backend.firebasestorage.app",
    messagingSenderId: "630012105345",
    appId: "1:630012105345:web:28d3379971a58dc24eb380",
    measurementId: "G-QR1VKL4DKG"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const getRecaptcha = (containerId = 'recaptcha-container') => {
  return new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
};

export default app;


