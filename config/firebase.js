// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: [YOUR_KEY],
  authDomain: [YOUR_AUTH_DOMAIN],
  projectId: [YOUR_PROJECT_ID],
  storageBucket: [YOUR_STORAGEBUCKET],
  messagingSenderId: [YOUR_SENDER_ID],
  appId: [YOUR_APP_ID],
  measurementId: [YOUR_MEASUREMENT_ID]
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
