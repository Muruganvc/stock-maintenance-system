import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDms0gK0DUCh-VBw-78FcnGoRIyNjwHmls",
    authDomain: "stock-mtenance-system.firebaseapp.com",
    databaseURL: "https://stock-mtenance-system-default-rtdb.firebaseio.com",
    projectId: "stock-mtenance-system",
    storageBucket: "stock-mtenance-system.firebasestorage.app",
    messagingSenderId: "276737364455",
    appId: "1:276737364455:web:2ddb3bc9944c03f24ded42"
};


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),
  importProvidersFrom([AngularFireModule.initializeApp(firebaseConfig), AngularFireAuth, AngularFireDatabase, AngularFirestore])
  ]
};
