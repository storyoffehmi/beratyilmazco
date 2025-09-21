// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyBmgM7b3b7y-ackKrXrKlXLlc8WfEOdqfc",

  authDomain: "beratyilmazco-44f88.firebaseapp.com",

  projectId: "beratyilmazco-44f88",

  storageBucket: "beratyilmazco-44f88.firebasestorage.app",

  messagingSenderId: "707267698660",

  appId: "1:707267698660:web:8efb97cce6be656ac1f1f1",

  measurementId: "G-JVX1K5LMED"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services we need
export const auth = getAuth(app);
export const db = getFirestore(app);