import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCLZ8OvmDimbrKwv2Sia26As8yvSbjEq0M',
  authDomain: 'pub-coastal.firebaseapp.com',
  databaseURL:
    'https://pub-coastal-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'pub-coastal',
  storageBucket: 'pub-coastal.firebasestorage.app',
  messagingSenderId: '665982940607',
  appId: '1:665982940607:web:f1fc93f143fd423c1b9d0a',
  measurementId: 'G-SRVH4GRBHJ',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const database = getDatabase(app);
