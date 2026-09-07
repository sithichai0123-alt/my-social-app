import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlruTPdcfWPMgJkQufyhtZnPST_mbDvKs",
  authDomain: "warmly-app-9e8d6.firebaseapp.com",
  projectId: "warmly-app-9e8d6",
  storageBucket: "warmly-app-9e8d6.appspot.com",
  messagingSenderId: "340884704147",
  appId: "1:340884704147:web:86ab4e1a8aceab0daeb666"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export function getUid() {
  let uid = localStorage.getItem("wm_uid");
  if (!uid) {
    uid = "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("wm_uid", uid);
  }
  return uid;
}
