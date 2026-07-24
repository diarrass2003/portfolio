import { Routes } from '@angular/router';

/**
 * Configuration globale des routes de la Single Page Application (SPA).
 * Associe une URL à un composant Angular généré.
 */
export const routes: Routes = [
    { 
      path: '', 
      loadComponent: () => import('./components/home/home').then(m => m.Home), 
      data: { animation: 'HomePage' } 
    }, // Page d'accueil par défaut (le portfolio central)
    { 
      path: 'cv', 
      loadComponent: () => import('./components/cv/cv').then(m => m.Cv), 
      data: { animation: 'CvPage' } 
    }, // Page du profil complet CV
    { path: '**', redirectTo: '' } // Redirection de sécurité
];
