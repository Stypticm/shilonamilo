"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.auth = exports.firestore = exports.firebase_app = void 0;
const auth_1 = require("@firebase/auth");
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const storage_1 = require("firebase/storage");
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
let firebase_app = (0, app_1.getApps)().length === 0 ? (0, app_1.initializeApp)(firebaseConfig) : (0, app_1.getApps)()[0];
exports.firebase_app = firebase_app;
const firestore = (0, firestore_1.getFirestore)(firebase_app);
exports.firestore = firestore;
const auth = (0, auth_1.getAuth)(firebase_app);
exports.auth = auth;
const storage = (0, storage_1.getStorage)(firebase_app);
exports.storage = storage;
