import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
/**
 * Composant de pied de page.
 * Gère l'inscription à la Newsletter et le bouton flottant "Retour en haut".
 */
export class Footer {
  newsletterStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  showBackToTop = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public translation: TranslationService,
  ) {}

  /**
   * Envoi du formulaire de newsletter de façon asynchrone (via Formspree).
   */
  async onNewsletterSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('.newsletter-input') as HTMLInputElement;
    const email = input.value;

    if (!email) return;

    this.newsletterStatus = 'loading';

    try {
      const res = await fetch('https://formspree.io/f/xdapoaww', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email, subject: 'Inscription Newsletter' }),
      });

      if (res.ok) {
        input.value = '';
        this.newsletterStatus = 'success';
      } else {
        throw new Error('Error');
      }
    } catch {
      this.newsletterStatus = 'error';
      setTimeout(() => {
        this.newsletterStatus = 'idle';
      }, 3000);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.showBackToTop = window.scrollY > 500;
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
