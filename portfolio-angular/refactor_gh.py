import re
import os

path = 'src/app/services/github.ts'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

new_class_content = """export class GithubService {
  private readonly API_URL = 'https://api.github.com/repos/';

  async getRepoStats(repoPath: string): Promise<RepoStats> {
    const cacheKey = `gh_stats_${repoPath}`;
    const cachedStats = this.getCachedStats(cacheKey);
    if (cachedStats) return cachedStats;

    return this.fetchLiveStats(repoPath, cacheKey);
  }

  private getCachedStats(cacheKey: string): RepoStats | null {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    return Date.now() - timestamp > 3600000 ? null : data;
  }

  private async fetchLiveStats(repoPath: string, cacheKey: string): Promise<RepoStats> {
    const cachedStr = localStorage.getItem(cacheKey);
    const fallback = cachedStr ? JSON.parse(cachedStr).data : { stars: 0, forks: 0 };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${this.API_URL}${repoPath}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      return await this.handleResponse(response, repoPath, cacheKey, fallback);
    } catch (error: any) {
      this.handleFetchError(error, repoPath);
      return fallback;
    }
  }

  private async handleResponse(
      response: Response, repoPath: string, cacheKey: string, fallback: RepoStats
  ): Promise<RepoStats> {
    if (response.status === 404) {
      console.warn(`GitHub repository '${repoPath}' not found.`);
      return { stars: 0, forks: 0 };
    }
    if (response.status === 403) {
      console.info(`Rate limit reached for GitHub API. Using cached data for ${repoPath}.`);
      if (fallback.stars > 0 || fallback.forks > 0) return fallback;
      throw new Error('Rate limit exceeded');
    }
    if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

    const data = await response.json();
    const stats = { stars: data.stargazers_count || 0, forks: data.forks_count || 0 };
    localStorage.setItem(cacheKey, JSON.stringify({ data: stats, timestamp: Date.now() }));
    return stats;
  }

  private handleFetchError(error: any, repoPath: string): void {
    if (error.name === 'AbortError') {
      console.warn(`GitHub API request timed out for ${repoPath}.`);
    } else {
      console.warn(`Could not fetch live GitHub stats for ${repoPath}. Error: ${error.message}`);
    }
  }
}"""

code = re.sub(r'export class GithubService \{[\s\S]*^\}', new_class_content, code, flags=re.MULTILINE)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)
