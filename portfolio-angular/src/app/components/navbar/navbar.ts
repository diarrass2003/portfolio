import { Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { PwaInstallService } from '../../services/pwa-install.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
})
/**
 * Composant de la barre de navigation.
 * Assure le routage intra-page, le basculement mobile (Hamburger)
 * et délègue la gestion des thèmes au ThemeService (SOLID).
 */
export class Navbar {
  activeSection = 'home';
  isMenuOpen = false;
  isScrolled = false;

  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  public translation = inject(TranslationService);
  public pwaInstall = inject(PwaInstallService);
  public themeService = inject(ThemeService);

  get isDarkTheme(): boolean {
    return this.themeService.isDarkTheme();
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
    this.themeService.toggleTheme();
  }

  /** Bascule entre le Français et l'Anglais */
  toggleLanguage() {
    const newLang = this.translation.currentLang() === 'fr' ? 'en' : 'fr';
    this.translation.setLanguage(newLang);
  }

  /**
   * Logique de 'ScrollSpy'. Détecte dynamiquement la section visible
   * sur le viewport pour mettre en surbrillance le lien correspondant dans le menu.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;

      const sections = ['home', 'about', 'company', 'skills', 'projects', 'game', 'contact'];
      for (const section of sections) {
        const element = this.document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const SCROLL_OFFSET = 100;
          if (rect.top <= SCROLL_OFFSET && rect.bottom >= SCROLL_OFFSET) {
            this.activeSection = section;
          }
        }
      }
    }
  }
}
