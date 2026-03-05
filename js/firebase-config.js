// ============================================================
//  GraamBazaar — Firebase Configuration
//  Replace ALL placeholder values with your Firebase project
// ============================================================
import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCkHLcF8apr-tcQiLz1pZml3Znn4MqUQsY",
  authDomain: "vote-2c1d3.firebaseapp.com",
  projectId: "vote-2c1d3",
  storageBucket: "vote-2c1d3.firebasestorage.app",
  messagingSenderId: "53168748133",
  appId: "1:53168748133:web:9ef356e5de6743e3bc788c",
  measurementId: "G-YBKL6VZHQ0"
};

const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);
