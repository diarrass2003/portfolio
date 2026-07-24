import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Swiper } from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.css'],
})
export class TestimonialsComponent implements AfterViewInit {
  testimonials = [
    {
      name: 'Alexandre Rivière',
      role: 'CEO @ TechFlow',
      content:
        'Diarrassouba a transformé notre vision technique en une réalité performante. Son expertise Full Stack et son sens du détail UI/UX sont exceptionnels.',
      avatar: 'https://i.pravatar.cc/150?u=alex',
      rating: 5,
    },
    {
      name: 'Sophie Martinet',
      role: 'Product Manager @ NovaSoft',
      content:
        "Une collaboration fluide et des résultats au-delà de nos attentes. La qualité du code et la rapidité d'exécution font de lui un partenaire de choix.",
      avatar: 'https://i.pravatar.cc/150?u=sophie',
      rating: 5,
    },
    {
      name: 'Marc Lefebvre',
      role: 'Directeur Technique @ InovLab',
      content:
        'Excellent développeur, très autonome et force de proposition. Il maîtrise parfaitement les architectures modernes et sait résoudre les problèmes complexes.',
      avatar: 'https://i.pravatar.cc/150?u=marc',
      rating: 5,
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialisation de Swiper
      setTimeout(() => {
        new Swiper('.testimonials-swiper', {
          modules: [Pagination, Autoplay],
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          breakpoints: {
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          },
        });
      }, 500);
    }
  }

  getRatingArray(rating: number): any[] {
    return new Array(rating);
  }
}
