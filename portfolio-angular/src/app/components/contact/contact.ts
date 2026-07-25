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
  emailCopied = false;
  phoneCopied = false;

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
   * Copie un texte ciblé dans le presse-papier de l'utilisateur.
   * @param text La chaine de caractères à copier.
   * @param type Le type de donnée ('email' ou 'phone') pour mettre à jour l'icône correspondante.
   */
  async copyText(text: string, type: 'email' | 'phone') {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'email') this.emailCopied = true;
      if (type === 'phone') this.phoneCopied = true;

      setTimeout(() => {
        if (type === 'email') this.emailCopied = false;
        if (type === 'phone') this.phoneCopied = false;
      }, 1600);
    } catch (err) {
      console.warn('Erreur lors de la copie dans le presse-papier', err);
    }
  }
}
