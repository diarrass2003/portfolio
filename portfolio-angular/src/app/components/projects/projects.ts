import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgClass } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { GithubService, RepoStats } from '../../services/github';
import { Swiper } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

interface Project {
  id: string;
  repo: string;
  images: string[];
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  stats?: RepoStats;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
/**
 * Composant Projets
 * Affiche une grille de projets interactifs avec carrousels d'images et stats GitHub.
 */
export class Projects implements AfterViewInit, OnDestroy {
  private autoScrollInterval: any;
  // Signal réactif contenant la liste des projets.
  // L'utilisation de Signal permet une mise à jour fluide de l'UI lors de la réception des stats GitHub.
  projects = signal<Project[]>([
    {
      id: 'p1',
      repo: 'LeYASSOUNG/ShopAfrica',
      images: ['Assets/images/quicklodge_1.png', 'Assets/images/quicklodge_2.png'],
      tags: ['Angular', 'Java', 'PostgreSQL'],
      githubUrl: 'https://github.com/LeYASSOUNG/ShopAfrica',
      demoUrl: '#',
    },
    {
      id: 'p2',
      repo: 'LeYASSOUNG/gestion-stock',
      images: ['Assets/images/lumina_1.png', 'Assets/images/lumina_2.png'],
      tags: ['Next.js', 'Node.js', 'Spring Boot'],
      githubUrl: 'https://github.com/LeYASSOUNG/gestion-stock',
      demoUrl: '#',
    },
    {
      id: 'p3',
      repo: 'LeYASSOUNG/portfolio',
      images: ['Assets/images/midnight_1.png', 'Assets/images/midnight_2.png'],
      tags: ['Angular', 'UI/UX', 'PWA'],
      githubUrl: 'https://github.com/LeYASSOUNG/portfolio',
      demoUrl: '#',
    },
  ]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public translation: TranslationService,
    private github: GithubService,
  ) {}

  /**
   * Initialisation : Récupération asynchrone des statistiques GitHub (Stars/Forks).
   */
  async ngOnInit() {
    const currentProjects = this.projects();
    await Promise.all(
      currentProjects.map(async (project, i) => {
        if (project.repo) {
          const stats = await this.github.getRepoStats(project.repo);
          this.projects.update((projects) => {
            const updated = [...projects];
            updated[i] = { ...updated[i], stats };
            return updated;
          });
        }
      })
    );
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initSwipers();
      this.initMobileAutoScroll();
    }
  }

  ngOnDestroy() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  /**
   * Initialise le défilement automatique du carrousel des projets sur mobile.
   */
  private initMobileAutoScroll() {
    const MOBILE_BREAKPOINT = 992;
    if (window.innerWidth > MOBILE_BREAKPOINT) return;

    setTimeout(() => {
      const grid = document.querySelector('.projects-grid') as HTMLElement;
      if (!grid) return;

      let isTouching = false;
      grid.addEventListener('touchstart', () => (isTouching = true), { passive: true });
      grid.addEventListener(
        'touchend',
        () => {
          setTimeout(() => (isTouching = false), 3000); // Pause the auto-scroll for 3s after touch
        },
        { passive: true },
      );

      this.autoScrollInterval = setInterval(() => {
        if (isTouching) return;

        const currentScroll = grid.scrollLeft;
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        const card = grid.querySelector('.project-wrapper');
        const cardWidth = card ? card.clientWidth : 300;

        if (currentScroll >= maxScroll - 10) {
          grid.scrollTo({ left: 0, behavior: 'smooth' }); // Rewind to start
        } else {
          grid.scrollTo({ left: currentScroll + cardWidth, behavior: 'smooth' }); // Scroll to next
        }
      }, 5000);
    }, 1000); // Attend que le DOM soit complètement rendu
  }

  /**
   * Initialise les carrousels Swiper pour les images de chaque projet.
   */
  private initSwipers() {
    setTimeout(() => {
      // Configuration des carrousels internes imbriqués
      new Swiper('.project-inner-swiper', {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        loop: false, // Pas de boucle infinie pour les images
        nested: true, // Indique que le swiper est imbriqué (évite les conflits de swipe)
        touchReleaseOnEdges: true, // Permet de continuer le scroll de la page après la dernière image
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.project-img-pagination', type: 'fraction' },
      });
    }, 600);
  }
}
