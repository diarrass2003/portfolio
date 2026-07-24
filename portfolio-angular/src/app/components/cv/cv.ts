import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cv.html',
  styleUrl: './cv.css',
})
/**
 * Composant Curriculum Vitae — Midnight Aurora Edition
 * Design premium avec sidebar glassmorphism, timeline interactive
 * et animations reveal au scroll.
 */
export class Cv implements OnInit, AfterViewInit {
  constructor(public translation: TranslationService) {}

  /**
   * À l'initialisation, on remonte en haut de page.
   * Important car Angular conserve la position de scroll entre les routes.
   */
  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  /**
   * Après le rendu de la vue, on initialise les animations spécifiques au CV.
   */
  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    // --- ANIMATIONS D'APPARITION (REVEAL) ---
    // On observe les éléments avec la classe .reveal pour ajouter .visible au scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // --- ANIMATIONS DES BARRES DE COMPÉTENCES ---
    // Les barres s'animent de 0 à X% uniquement lorsqu'elles entrent dans l'écran
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.cv-skill-fill');
            fills.forEach((fill: Element) => {
              const el = fill as HTMLElement;
              // On récupère la largeur cible via l'attribut data-width (ex: "90%")
              const targetWidth = el.dataset['width'] || '0%';

              // On force le passage par 0 pour déclencher la transition CSS
              el.style.width = '0';
              requestAnimationFrame(() => {
                // Petit délai pour assurer que le navigateur détecte le changement de style
                setTimeout(() => {
                  el.style.width = targetWidth;
                }, 100);
              });
            });
            // Une fois animé, on arrête d'observer pour optimiser les performances
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    const skillsBlock = document.querySelector('.cv-skills-list');
    if (skillsBlock) skillObserver.observe(skillsBlock);
  }
}
