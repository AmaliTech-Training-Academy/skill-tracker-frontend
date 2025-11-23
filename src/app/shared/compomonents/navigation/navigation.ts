import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '@app/store/auth/auth.selectors';
import { APP_CONSTANTS } from '@app/core/constants/app.constants';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navigation implements OnInit, OnDestroy {
  public isMobileMenuOpen = false;
  public showOnlyLogo = false;
  public isAuthenticated = this.store.selectSignal(selectIsAuthenticated);

  public readonly minimalLogoRoutes = [
    '/login',
    '/signup',
    '/reset-password',
    '/forgot-password',
    '/email-verification',
  ];

  public readonly navItems = [
    { label: 'Platform', href: '/' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Skills', href: '#skills' },
    { label: 'Pricing', href: '#pricing' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.updateShowOnlyLogo(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        this.updateShowOnlyLogo(event.urlAfterRedirects || event.url);

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
    let normalized = url.split(/[?#]/)[0].replace(/\/+$/, '');
    if (!normalized.startsWith('/')) normalized = '/' + normalized;

    this.showOnlyLogo = this.minimalLogoRoutes.some(
      (route) => normalized === route || normalized.startsWith(route + '/'),
    );

    this.cdr.markForCheck();
  }

  public toggleMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public navigateToDashboard(): void {
    this.router.navigateByUrl(APP_CONSTANTS.APP_ROUTES.DASHBOARD);
  }
}
