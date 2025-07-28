import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAPJ0IV49HRnuDmAV8BGETwOTIGCMt0sYI',
    authDomain: 'property-listing-89bef.firebaseapp.com',
    projectId: 'property-listing-89bef',
    storageBucket: 'property-listing-89bef.firebasestorage.app',
    messagingSenderId: '973081449390',
    appId: '1:973081449390:web:7c996ed90add998a356e3f',
    measurementId: 'G-1WBPPYEBMF',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signUpUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
    return signOut(auth);
};

export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export default app;
