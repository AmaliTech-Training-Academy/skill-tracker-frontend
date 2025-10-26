// navigation.ts — modify your existing file
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss'],
})
export class Navigation implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  showOnlyLogo = false;

  minimalLogoRoutes = ['/login', '/signup', '/reset-password', '/forgot-password', '/email-verification'];

  navItems = [
    { label: 'Platform', link: '/', exact: false },
    { label: 'How It Works', link: '#how-it-works', exact: false },
    { label: 'Skills', link: '#skills', exact: false },
    { label: 'Pricing', link: '#pricing', exact: false }
  ];

  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    
    this.updateShowOnlyLogo(this.router.url);

   this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((ne) => {
        this.updateShowOnlyLogo(ne.urlAfterRedirects ?? ne.url);
      
        if (this.showOnlyLogo) {
          this.isMobileMenuOpen = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateShowOnlyLogo(url: string): void {
    
    const normalized = url.startsWith('/') ? url : `/${url}`;
    this.showOnlyLogo = this.minimalLogoRoutes.includes(normalized);
  }

  toggleMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
