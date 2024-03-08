// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDGOLK5kF0-PWmIMWI4Piq4cSeZyY2zp1c",
    authDomain: "podcast-app-react-major.firebaseapp.com",
    projectId: "podcast-app-react-major",
    storageBucket: "podcast-app-react-major.appspot.com",
    messagingSenderId: "973992302259",
    appId: "1:973992302259:web:7678112c85fe51f85582c6",
    measurementId: "G-3YLPKRSJVC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { auth, db, storage };