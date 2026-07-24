import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Point d'entrée principal de l'application Angular (Bootstrapping).
 * Dans une architecture "Standalone", nous amorçons directement le composant racine `App`
 * sans passer par un AppModule.
 */
bootstrapApplication(App, appConfig).catch((err: any) => console.error(err));
