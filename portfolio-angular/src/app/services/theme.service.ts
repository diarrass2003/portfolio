import { Injectable, signal, inject, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
/**
  * Service de gestion du thème (Mode Sombre / Mode Clair).
  * Encapsule l'état du thème, la persistance dans localStorage et l'application sur le DOM (SOLID).
  */
export class ThemeService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;

  // Signal réactif stockant l'état du thème sombre
  isDarkTheme = signal<boolean>(false);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDark = saved === 'dark' || (!saved && prefersDark);
      this.isDarkTheme.set(initialDark);
      this.applyCurrentTheme();
    }
  }

  /** Bascule manuellement entre le Thème Clair et le Thème Sombre */
  toggleTheme() {
    const nextDark = !this.isDarkTheme();
    this.isDarkTheme.set(nextDark);
    this.applyCurrentTheme();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    }
  }

  /** Applique la classe CSS 'dark' sur <html> en fonction de l'état réactif */
  private applyCurrentTheme() {
    const root = this.document.documentElement;
    if (this.isDarkTheme()) {
      this.renderer.addClass(root, 'dark');
    } else {
      this.renderer.removeClass(root, 'dark');
    }
  }
}
