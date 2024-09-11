// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDgFpfohlUHzCFjNBaaNge3ASB39Um_3dE",
  authDomain: "financial-fellows-expo.firebaseapp.com",
  projectId: "financial-fellows-expo",
  storageBucket: "financial-fellows-expo.appspot.com",
  messagingSenderId: "423447915784",
  appId: "1:423447915784:web:b3763777a4ce90102110bd",
  measurementId: "G-4DFPSLJ6CN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const db = getFirestore(app)
export const auth = getAuth(app)


export const expensesRef = collection(db, 'expenses')
export const incomeRef = collection(db, 'incomes')
export const transactionRef = collection(db, 'transactions')
export const budgetRef = collection(db, 'budgets')

export default app;