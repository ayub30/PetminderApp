
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyCBdLLWLhP-tiDPuRUdNqLij4M-21T8UQk",
  authDomain: "react-auth-dcf03.firebaseapp.com",
  projectId: "react-auth-dcf03",
  storageBucket: "react-auth-dcf03.appspot.com",
  messagingSenderId: "1097447928213",
  appId: "1:1097447928213:web:47c73dc35cd1516a9d869c"
};


const app = initializeApp(firebaseConfig);



const auth = getAuth(app);
export const  db =getFirestore(app);
export { auth };
