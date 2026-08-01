import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company.html',
  styleUrl: './company.css',
})
/**
 * Composant Company (Mon Entreprise)
 * Présente l'entreprise, ses services technologiques, ses métriques clés et un appel à l'action.
 */
export class Company {
  constructor(public translation: TranslationService) {}
}
