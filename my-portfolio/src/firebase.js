import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBa6W6OI-uS8icaJvTTKHA7Yog0c-KPHhk",
  authDomain: "myportfolio-8c863.firebaseapp.com",
  projectId: "myportfolio-8c863",
  storageBucket: "myportfolio-8c863.firebasestorage.app",
  messagingSenderId: "902746816293",
  appId: "1:902746816293:web:63b5e95334114fcc0424cc",
  measurementId: "G-DJQ3MEYHB4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // optional, only if you use it

export { app, analytics }; // export analytics if needed