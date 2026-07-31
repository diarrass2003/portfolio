import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, signal, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgClass } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { GithubService, RepoStats } from '../../services/github';
import { Swiper } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

interface Project {
  id: string;
  repo: string;
  category: 'angular' | 'fullstack' | 'uiux';
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
 * Affiche une grille de projets interactifs avec filtres par catégorie, carrousels d'images isolés et stats GitHub.
 */
export class Projects implements AfterViewInit, OnDestroy {
  private autoScrollInterval: any;

  activeCategory = signal<string>('all');

  projects = signal<Project[]>([
    {
      id: 'p1',
      repo: 'LeYASSOUNG/ShopAfrica',
      category: 'fullstack',
      images: ['Assets/images/quicklodge_1.png', 'Assets/images/quicklodge_2.png'],
      tags: ['Angular', 'Java', 'PostgreSQL'],
      githubUrl: 'https://github.com/LeYASSOUNG/ShopAfrica',
      demoUrl: '#',
    },
    {
      id: 'p2',
      repo: 'LeYASSOUNG/gestion-stock',
      category: 'fullstack',
      images: ['Assets/images/lumina_1.png', 'Assets/images/lumina_2.png'],
      tags: ['Next.js', 'Node.js', 'Spring Boot'],
      githubUrl: 'https://github.com/LeYASSOUNG/gestion-stock',
      demoUrl: '#',
    },
    {
      id: 'p3',
      repo: 'LeYASSOUNG/portfolio',
      category: 'angular',
      images: ['Assets/images/midnight_1.png', 'Assets/images/midnight_2.png'],
      tags: ['Angular', 'UI/UX', 'PWA'],
      githubUrl: 'https://github.com/LeYASSOUNG/portfolio',
      demoUrl: '#',
    },
  ]);

  filteredProjects = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.projects();
    return this.projects().filter((p) => p.category === cat);
  });

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public translation: TranslationService,
    private github: GithubService,
  ) {}

  setFilter(category: string) {
    this.activeCategory.set(category);
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initSwipers(), 200);
    }
  }

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

  private swiperInstances: Swiper[] = [];

  ngOnDestroy() {
    this.destroySwipers();
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  private destroySwipers() {
    this.swiperInstances.forEach((instance) => {
      if (instance && !instance.destroyed) {
        instance.destroy(true, true);
      }
    });
    this.swiperInstances = [];
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
          setTimeout(() => (isTouching = false), 3000);
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
          grid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          grid.scrollTo({ left: currentScroll + cardWidth, behavior: 'smooth' });
        }
      }, 5000);
    }, 1000);
  }

  /**
   * Initialise de manière isolée les carrousels Swiper pour chaque carte de projet.
   */
  private initSwipers() {
    this.destroySwipers();
    setTimeout(() => {
      document.querySelectorAll('.project-glass-card').forEach((card) => {
        const swiperContainer = card.querySelector('.project-inner-swiper') as HTMLElement;
        if (!swiperContainer) return;
        const nextEl = card.querySelector('.swiper-button-next') as HTMLElement;
        const prevEl = card.querySelector('.swiper-button-prev') as HTMLElement;
        const paginationEl = card.querySelector('.project-img-pagination') as HTMLElement;

        const instance = new Swiper(swiperContainer, {
          modules: [Navigation, Pagination],
          slidesPerView: 1,
          loop: false,
          nested: true,
          touchReleaseOnEdges: true,
          navigation: { nextEl, prevEl },
          pagination: { el: paginationEl, clickable: true },
        });
        this.swiperInstances.push(instance);
      });
    }, 200);
  }
}
