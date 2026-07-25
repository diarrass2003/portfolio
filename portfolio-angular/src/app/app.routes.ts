import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Cv } from './components/cv/cv';

/**
 * Configuration globale des routes de la Single Page Application (SPA).
 * Associe une URL à un composant Angular généré.
 */
export const routes: Routes = [
  {
    path: '',
    component: Home,
    data: { animation: 'HomePage' },
  }, // Page d'accueil par défaut (le portfolio central)
  {
    path: 'cv',
    component: Cv,
    data: { animation: 'CvPage' },
  }, // Page du profil complet CV
  { path: '**', redirectTo: '' }, // Redirection de sécurité
];
