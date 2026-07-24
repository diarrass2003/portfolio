import { trigger, transition, style, query, animate, group } from '@angular/animations';

/**
 * Définition des animations de transition de routes.
 * Utilise un effet de fondu (fade) combiné à un léger glissement (slide)
 * pour une navigation fluide et premium.
 */
export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    // Positionne les vues (old et new) de manière absolue pour qu'elles se superposent pendant la transition
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          opacity: 0,
        }),
      ],
      { optional: true },
    ),

    // La nouvelle vue arrive
    query(':enter', [style({ opacity: 0, transform: 'translateY(10px)' })], { optional: true }),

    // Séquence d'animation
    group([
      // L'ancienne vue disparait
      query(':leave', [animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-10px)' }))], {
        optional: true,
      }),

      // La nouvelle vue apparait
      query(':enter', [animate('400ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))], {
        optional: true,
      }),
    ]),
  ]),
]);
