import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const storageConfig = {
    apiKey: 'AIzaSyCiVGWFTR0y2OxbMFtHiPIYMpGdJZ85IJQ',
    authDomain: 'louvorbase.firebaseapp.com',
    projectId: 'louvorbase',
    storageBucket: 'louvorbase.appspot.com',
    messagingSenderId: '86183746329',
    appId: '1:86183746329:web:016d061168a974bffe0388',
};

export const app = initializeApp(storageConfig);
export const storage = getStorage(app);
