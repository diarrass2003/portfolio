import { Injectable, signal } from '@angular/core';

/**
 * Service gérant l'invite d'installation PWA (Progressive Web App).
 * Capte l'événement natif du navigateur et expose un signal réactif
 * pour afficher/masquer le bouton "Installer".
 */
@Injectable({
  providedIn: 'root',
})
export class PwaInstallService {
  // Signal réactif : true si l'installation est proposable
  canInstall = signal(false);

  private deferredPrompt: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (event: Event) => {
        // Empêche le mini-infobar automatique du navigateur
        event.preventDefault();
        this.deferredPrompt = event;
        this.canInstall.set(true);
      });

      // Cache le bouton si l'app est déjà installée
      window.addEventListener('appinstalled', () => {
        this.canInstall.set(false);
        this.deferredPrompt = null;
      });
    }
  }

  /** Déclenche la boîte de dialogue d'installation native du navigateur */
  async install(): Promise<void> {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      this.canInstall.set(false);
    }
    this.deferredPrompt = null;
  }
}
