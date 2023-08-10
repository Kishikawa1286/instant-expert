import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBGhGkT-ss5sqgOp-jOw7P7ZeBYBkKpRdg',
  authDomain: 'instant-agent.firebaseapp.com',
  projectId: 'instant-agent',
  storageBucket: 'instant-agent.appspot.com',
  messagingSenderId: '14626751698',
  appId: '1:14626751698:web:babc5d53639cfe1174590b',
  measurementId: 'G-QJ1D3KJBQV',
};

export const firebaseApp = initializeApp(firebaseConfig);
