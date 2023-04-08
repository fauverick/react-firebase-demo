import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyD6-SIIBdxVCYgGUDENbikeNXdpszkvQcY",
  authDomain: "fir-course-ab7f7.firebaseapp.com",
  projectId: "fir-course-ab7f7",
  storageBucket: "fir-course-ab7f7.appspot.com",
  messagingSenderId: "659504647791",
  appId: "1:659504647791:web:cea7ea9117029824c8079a",
  measurementId: "G-FH99JR68NM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)