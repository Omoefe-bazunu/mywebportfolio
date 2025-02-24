import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC8jErvRyFsdDxNk2NqmaOCk5ac8nowoiM",
  authDomain: "omoefe-11d79.firebaseapp.com",
  projectId: "omoefe-11d79",
  storageBucket: "omoefe-11d79.firebasestorage.app",
  messagingSenderId: "757125749886",
  appId: "1:757125749886:web:7e5acf51e372c0ff368c2f",
  measurementId: "G-RDKDQSLLNV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const dbase = getFirestore(app);
const auth = getAuth(app);

export { dbase, storage, auth, app as default };
