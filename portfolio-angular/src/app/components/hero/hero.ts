import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
})
/**
 * Composant Hero Section
 * La première section visible, présentant le titre principal, les badges et les statistiques.
 */
export class Hero {
  constructor(public translation: TranslationService) {}
}
