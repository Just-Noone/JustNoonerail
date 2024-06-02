import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDUHdl4BOhR04vYMmDJ-2yxBEvjpSlecq0",
    authDomain: "justnoonerail.firebaseapp.com",
    projectId: "justnoonerail",
    storageBucket: "justnoonerail.appspot.com",
    messagingSenderId: "1020265453278",
    appId: "1:1020265453278:web:eab7d2b1a659b17fb4544f",
    measurementId: "G-9HYZX0MGBT"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
