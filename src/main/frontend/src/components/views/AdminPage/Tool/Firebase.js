import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-3eRH9frcyReekPH0B1QyK4vWj_EnbMI",
  authDomain: "uploading-f78b0.firebaseapp.com",
  projectId: "uploading-f78b0",
  storageBucket: "uploading-f78b0.appspot.com",
  messagingSenderId: "804469467521",
  appId: "1:804469467521:web:9fcee313077645537a2080"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)