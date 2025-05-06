import { initializeApp } from "@react-native-firebase/app";
import { getFirestore } from "@react-native-firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC0g9hR7XxAZztsbhYRH2_9RvkZ-7IhNYQ",
  projectId: "homeautomation-f0b24",
  messagingSenderId: "270173926390",
  appId: "1:270173926390:android:d59a72f1652ac3a7748dd7"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { database };
