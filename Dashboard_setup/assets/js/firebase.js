const firebaseConfig = {
  apiKey: "AIzaSyB3ohfhlRjlBLXoIp4Ug2FqGzmdN65aOjg",
  authDomain: "smart-farming-ef27a.firebaseapp.com",
  databaseURL: "https://smart-farming-ef27a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-farming-ef27a",
  storageBucket: "smart-farming-ef27a.firebasestorage.app",
  messagingSenderId: "433202635300",
  appId: "1:433202635300:web:7cc923b36a093f70daeeb1",
  measurementId: "G-H8TX6GW0R6"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
