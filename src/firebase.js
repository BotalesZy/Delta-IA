// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tus credenciales reales de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDxkjDIYh17qKyytIyRBTJ0_-qTPuhTbW4",
    authDomain: "login-delta-e82be.firebaseapp.com",
    projectId: "login-delta-e82be",
    storageBucket: "login-delta-e82be.firebasestorage.app",
    messagingSenderId: "30847662410",
    appId: "1:30847662410:web:a894df67e4cbd88d47e9b3",
    measurementId: "G-9Q9EZ6P3KB"
};

// Inicializamos la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Exportamos los servicios listos para usar en tus componentes
export const auth = getAuth(app);
export const db = getFirestore(app);