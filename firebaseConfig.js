import { initializeApp } from "firebase/app";
import { getDatabase, goOnline, goOffline } from "firebase/database";

const firebaseConfig = {
  apiKey: "XXXXXXXX-XXXXXXXX-XXXXXXX",
  authDomain: "XXXXXXXX-XXXXXXXX-XXXXXXX",
  databaseURL: "XXXXXXXX-XXXXXXXX-XXXXXXX",
  projectId: "XXXXXXXX-XXXXXXXX-XXXXXXX",
  storageBucket: "XXXXXXXX-XXXXXXXX-XXXXXXX",
  messagingSenderId: "XXXXXXXX-XXXXXXXX-XXXXXXX",
  appId: "XXXXXXXX-XXXXXXXX-XXXXXXX",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
goOnline(database);
database.persistenceEnabled = true;

export { database, goOffline, goOnline };
