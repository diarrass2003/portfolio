import { Injectable, signal } from '@angular/core';

export interface RepoStats {
  stars: number;
  forks: number;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly API_URL = 'https://api.github.com/repos/';

  /**
   * Récupère les statistiques (étoiles, forks) d'un dépôt GitHub public avec mise en cache.
   * @param repoPath Chemin du dépôt (ex: 'LeYASSOUNG/portfolio')
   */
  async getRepoStats(repoPath: string): Promise<RepoStats> {
    const cacheKey = `gh_stats_${repoPath}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > 3600000; // 1 heure de cache
      if (!isExpired) return data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(`${this.API_URL}${repoPath}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      // Si le dépôt n'est pas trouvé (ou est privé), on retourne 0 sans erreur bloquante
      if (response.status === 404) {
        console.warn(`GitHub repository '${repoPath}' not found. It might be private or renamed.`);
        return { stars: 0, forks: 0 };
      }

      // Si on atteint la limite de taux (403), on retourne les données en cache
      if (response.status === 403) {
        if (cached) {
          console.info(`Rate limit reached for GitHub API. Using cached data for ${repoPath}.`);
          return JSON.parse(cached).data;
        }
        throw new Error('Rate limit exceeded');
      }

      if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

      const data = await response.json();
      const stats = {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
      };

      // Sauvegarde en cache
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: stats,
          timestamp: Date.now(),
        }),
      );

      return stats;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`GitHub API request timed out for ${repoPath}.`);
      } else {
        console.warn(`Could not fetch live GitHub stats for ${repoPath}. Error: ${error.message}`);
      }
      if (cached) return JSON.parse(cached).data;
      return { stars: 0, forks: 0 };
    }
  }
}
