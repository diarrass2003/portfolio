import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { PwaInstallService } from '../../services/pwa-install.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
})
/**
 * Composant de la barre de navigation.
 * Il assure le routage intra-page, le basculement mobile (Hamburger) et gère la préférence utilisateur pour le mode sombre.
 */
export class Navbar {
  activeSection = 'home';
  isMenuOpen = false;
  isDarkTheme = false;
  isScrolled = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    public translation: TranslationService,
    public pwaInstall: PwaInstallService,
  ) {
    // Restaure le thème sauvegardé, ou utilise la préférence système du navigateur
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkTheme = saved === 'dark' || (!saved && prefersDark);
      this.applyTheme(this.isDarkTheme);
    }
  }

  /** Ouvre ou ferme le menu de la version mobile (Hamburger) */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /** Ferme explicitement le menu mobile (utile lors du clic sur un lien) */
  closeMenu() {
    this.isMenuOpen = false;
  }

  /** Définit la section courante explicitement lors d'un clic */
  setActive(section: string) {
    this.activeSection = section;
    this.closeMenu(); // Ferme le menu si on est sur mobile
  }

  /** Bascule manuellement entre le Thème Clair et le Thème Sombre */
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme(this.isDarkTheme);
    // Sauvegarde en localStorage pour les prochaines visites
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }
  }

  /** Bascule entre le Français et l'Anglais */
  toggleLanguage() {
    const newLang = this.translation.currentLang() === 'fr' ? 'en' : 'fr';
    this.translation.setLanguage(newLang);
  }

  /** Applique la classe CSS globale 'dark' sur l'élément racine <html> */
  private applyTheme(dark: boolean) {
    if (dark) {
      this.document.documentElement.classList.add('dark');
    } else {
      this.document.documentElement.classList.remove('dark');
    }
  }

  /**
   * Logique de 'ScrollSpy'. Détecte dynamiquement la section visible
   * sur le viewport pour mettre en surbrillance le lien correspondant dans le menu.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;

      const sections = ['home', 'about', 'skills', 'projects', 'game', 'contact'];
      for (const section of sections) {
        const element = this.document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            this.activeSection = section;
          }
        }
      }
    }
  }
}
