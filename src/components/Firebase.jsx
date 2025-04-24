// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDJPZt8ijcEQ9LKbIpu1afP3jbeWugIbug",

    authDomain: "auctionhub-c91d5.firebaseapp.com",
  
    projectId: "auctionhub-c91d5",
  
    storageBucket: "auctionhub-c91d5.firebasestorage.app",
  
    messagingSenderId: "572259826856",
  
    appId: "1:572259826856:web:1ba07836ca858e111c969d",
  
    measurementId: "G-Q2JLPE7H2Q"
  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
