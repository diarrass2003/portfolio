import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NgClass],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
/**
 * Composant dédié à la section Contact.
 * Encapsule la gestion du formulaire de prise de rendez-vous / contact sans création de backend via Formspree.
 */
export class Contact {
  isSubmitting = false;
  formMessageClass = '';
  formMessageText = '';

  constructor(public translation: TranslationService) {}

  /**
   * Méthode déclenchée à la soumission du formulaire HTML.
   * Utilise l'API fetch pour envoyer les données au serveur distant (Formspree).
   */
  async onSubmitContact(event: Event) {
    event.preventDefault(); // Annule le rechargement de page par défaut du formulaire
    this.isSubmitting = true;

    const form = event.target as HTMLFormElement;

    try {
      // Exécute la requête HTTP POST avec FormData formaté en JSON
      const res = await fetch('https://formspree.io/f/xdapoaww', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });

      if (res.ok) {
        this.formMessageClass = 'success';
        this.formMessageText = '✅ ' + this.translation.translate('contact.success');
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      this.formMessageClass = 'error';
      this.formMessageText = '❌ ' + this.translation.translate('contact.error');
    } finally {
      this.isSubmitting = false; // Restaure l'état d'interaction du bouton d'envoi
    }
  }

  /**
   * Copie un texte ciblé dans le presse-papier de l'utilisateur (ex: l'adresse mail).
   * @param text La chaine de caractères à copier.
   * @param btnElement L'élément graphique dont on veut remplacer le contenu par une icône "Check".
   */
  copyText(text: string, btnElement: HTMLElement) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = btnElement.innerHTML; // Sauvegarde l'icône originale
      btnElement.innerHTML = '<i class="fas fa-check" style="color:#22c55e"></i>';

      // Restaure le bouton HTML à son état d'origine après 1,6 secondes
      setTimeout(() => {
        btnElement.innerHTML = orig;
      }, 1600);
    });
  }
}
