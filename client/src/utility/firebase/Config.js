import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

      const firebaseConfig = {
        apiKey: "AIzaSyDZ1fA5oQARuKCYRcEwRL9p78UyKGJ5WAU",
        authDomain: "pdfbook-b2b91.firebaseapp.com",
        projectId: "pdfbook-b2b91",
        storageBucket: "pdfbook-b2b91.appspot.com",
        messagingSenderId: "534780926971",
        appId: "1:534780926971:web:18b8ddcf64a5d1c560c95e",
        measurementId: "G-4EGSVFETKW"
      };
const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app)