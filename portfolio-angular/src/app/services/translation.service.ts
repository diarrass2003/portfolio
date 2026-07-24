import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Language = 'fr' | 'en';

@Injectable({
  providedIn: 'root'
})
/**
 * Service Internationalisation (i18n)
 * Gère le changement de langue (FR/EN) de manière réactive via les Angular Signals.
 * Télécharge asynchronement les fichiers JSON de traduction.
 */
export class TranslationService {
  private http = inject(HttpClient);

  // Signal réactif stockant la langue actuelle. 
  currentLang = signal<Language>('fr');

  // Dictionnaire des traductions chargé
  private translations: any = {};
  
  // État de chargement pour éviter le scintillement (optionnel)
  public isLoaded = signal<boolean>(false);

  constructor() {
    // Initialisation : on récupère la langue sauvegardée par l'utilisateur
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang') as Language;
      if (savedLang) {
        this.currentLang.set(savedLang);
        // Applique la langue sauvegardée à l'attribut HTML dès le départ
        document.documentElement.lang = savedLang;
      }
    }
    
    // Charger la langue initiale
    this.loadTranslations(this.currentLang());
  }

  /**
   * Change la langue active, la sauvegarde localement et charge les nouvelles traductions.
   * Met également à jour l'attribut lang de <html> pour les lecteurs d'écran.
   */
  setLanguage(lang: Language) {
    if (this.currentLang() === lang) return;
    
    this.currentLang.set(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
      // Informe les lecteurs d'écran de la langue du contenu
      document.documentElement.lang = lang;
    }
    
    this.loadTranslations(lang);
  }

  /**
   * Télécharge le fichier JSON correspondant à la langue
   */
  private loadTranslations(lang: Language) {
    this.isLoaded.set(false);
    this.http.get(`Assets/i18n/${lang}.json`).subscribe({
      next: (data) => {
        this.translations[lang] = data;
        this.isLoaded.set(true);
      },
      error: (err) => {
        console.error(`Erreur de chargement des traductions pour ${lang}:`, err);
        // Fallback vide pour éviter les crashs si fichier non trouvé
        this.translations[lang] = {}; 
        this.isLoaded.set(true);
      }
    });
  }

  /**
   * Récupère une chaîne traduite basée sur une clé pointée (ex: "nav.home").
   * Si la clé n'existe pas ou n'est pas encore chargée, retourne la clé elle-même par défaut.
   */
  translate(key: string): string {
    const lang = this.currentLang();
    
    // LECTURE DU SIGNAL OBLIGATOIRE POUR LE MODE ZONELESS
    // Cela indique à Angular de re-rendre la vue lorsque isLoaded passe à true (fin de la requête HTTP)
    this.isLoaded();

    // Si la langue n'est pas encore chargée, retourner temporairement la clé
    if (!this.translations[lang]) {
      return key;
    }

    const keys = key.split('.');
    let result = this.translations[lang];
    
    for (const k of keys) {
      if (result) {
        result = result[k];
      } else {
        return key;
      }
    }
    
    return result || key;
  }
}

