import { initializeApp } from `firebase/app`;
import { getAuth, onAuthStateChanged } from `firebase/auth`;
import { getFirestore } from `firebase/firestore`;

const firebaseApp = initializeApp({
        apiKey: "AIzaSyDUHdl4BOhR04vYMmDJ-2yxBEvjpSlecq0",
        authDomain: "justnoonerail.firebaseapp.com",
        projectId: "justnoonerail",
        storageBucket: "justnoonerail.appspot.com",
        messagingSenderId: "1020265453278",
        appId: "1:1020265453278:web:eab7d2b1a659b17fb4544f",
        measurementId: "G-9HYZX0MGBT"
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

//Detect auth state
onAuthStateChanged(auth, user => {
    if (user /= null) {
        console.log(`logged in!`);
    } else {
        console.log(`No user`);
    }
})