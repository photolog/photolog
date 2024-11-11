import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UrlMatchService {
  currentUrl$: Observable<string>;

  constructor(private router: Router) {
    this.currentUrl$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects),
    );
  }

  /**
   * Checks if a given URL matches a specific pattern with dynamic segments
   * @param url The current URL to check
   * @param pattern A string pattern (e.g., '/photos/:photoId') or a RegExp
   * @returns boolean - true if the URL matches the pattern
   */
  doesUrlMatch(url: string, pattern: string | RegExp): boolean {
    if (typeof pattern === 'string') {
      const regex = this.convertPatternToRegex(pattern);
      return regex.test(url);
    } else if (pattern instanceof RegExp) {
      return pattern.test(url);
    }
    return false;
  }

  /**
   * Converts a URL pattern with dynamic segments (e.g., '/photos/:photoId') to a RegExp
   * @param pattern URL pattern with parameters (e.g., '/photos/:photoId')
   * @returns RegExp
   */
  private convertPatternToRegex(pattern: string): RegExp {
    const escapedPattern = pattern.replace(/([.+?^=!:${}()|[\]/\\])/g, '\\$1');
    const regexString = escapedPattern.replace(
      /\/:([a-zA-Z0-9_]+)/g,
      '/([^/]+)',
    );
    return new RegExp(`^${regexString}$`);
  }
}
