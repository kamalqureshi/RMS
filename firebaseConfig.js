import { initializeApp } from "firebase/app";
import { getDatabase, goOnline, goOffline } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyApj4HWYhFq-GW3KpWEd_A_bk3EAs6c22Q",
  authDomain: "rental-management-system-01.firebaseapp.com",
  databaseURL:
    "https://rental-management-system-01-default-rtdb.firebaseio.com",
  projectId: "rental-management-system-01",
  storageBucket: "rental-management-system-01.appspot.com",
  messagingSenderId: "476743866480",
  appId: "1:476743866480:web:b0d0409bd1ee52ddd8fcb5",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
goOnline(database);
database.persistenceEnabled = true;

export { database, goOffline, goOnline };
