import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navigation implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  showOnlyLogo = false;

  readonly minimalLogoRoutes = [
    '/login',
    '/signup',
    '/reset-password',
    '/forgot-password',
    '/email-verification',
  ];

  readonly navItems = [
    { label: 'Platform', link: '/', exact: false },
    { label: 'How It Works', link: '#how-it-works', exact: false },
    { label: 'Skills', link: '#skills', exact: false },
    { label: 'Pricing', link: '#pricing', exact: false },
  ];

  private destroy$ = new Subject<void>();

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Initial check on page load
    this.updateShowOnlyLogo(this.router.url);

    // Listen for route changes
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        this.updateShowOnlyLogo(event.urlAfterRedirects || event.url);

        if (this.showOnlyLogo) {
          this.isMobileMenuOpen = false; // close mobile menu automatically
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateShowOnlyLogo(url: string): void {
    // Normalize URL: remove query params, hash fragments, and trailing slashes
    let normalized = url.split(/[?#]/)[0].replace(/\/+$/, '');
    if (!normalized.startsWith('/')) normalized = '/' + normalized;

    // Check if route is in minimalLogoRoutes
    this.showOnlyLogo = this.minimalLogoRoutes.some(
      (route) => normalized === route || normalized.startsWith(route + '/')
    );

    // Trigger template update since OnPush is used
    this.cdr.markForCheck();
  }

  toggleMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
