import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  isAuthenticated = signal<boolean>(false);

  constructor() {
    // Check login status on startup only if in browser
    if (isPlatformBrowser(this.platformId)) {
      const auth = localStorage.getItem('auth');
      if (auth) this.isAuthenticated.set(true);
    }
  }

  login(username: string, password: string): boolean {
    if (username === 'root' && password === 'admin123') {
      const credentials = btoa(`${username}:${password}`);
      
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('auth', credentials);
      }
      
      this.isAuthenticated.set(true);
      this.router.navigate(['/upload']);
      return true;
    }
    return false;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth');
    }
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getAuthorizationHeader(): string {
    if (isPlatformBrowser(this.platformId)) {
      const auth = localStorage.getItem('auth');
      return auth ? `Basic ${auth}` : '';
    }
    return '';
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('auth');
    }
    return null;
  }
}