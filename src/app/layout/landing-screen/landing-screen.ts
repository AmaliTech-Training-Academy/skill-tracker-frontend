import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, RouterOutlet, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

import { Navigation } from '../../shared/compomonents/navigation/navigation';
import { Footer } from '../../shared/compomonents/footer/footer';
import { APP_CONSTANTS } from '@app/core';
@Component({
  selector: 'app-landing-screen',
  imports: [RouterOutlet, Navigation, Footer],
  templateUrl: './landing-screen.html',
  styleUrl: './landing-screen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingScreen implements OnInit, OnDestroy {
  private readonly fullPageRoutePaths: string[] = [
    APP_CONSTANTS.FULL_PAGE_ROUTES.LEVEL_SELECTION,
    APP_CONSTANTS.FULL_PAGE_ROUTES.INTEREST_SELECTION,
    APP_CONSTANTS.FULL_PAGE_ROUTES.LOGIN,
    APP_CONSTANTS.FULL_PAGE_ROUTES.SIGNUP,
    APP_CONSTANTS.FULL_PAGE_ROUTES.FORGOT_PASSWORD,
    APP_CONSTANTS.FULL_PAGE_ROUTES.RESET_PASSWORD,
    APP_CONSTANTS.FULL_PAGE_ROUTES.EMAIL_VERIFICATION




  ];

  public isFullPageLayout: WritableSignal<boolean> = signal(false);
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit() {
    const initialUrl = this.router.url;
    const isInitialFullPage = this.fullPageRoutePaths.some((path) => initialUrl.includes(path));

    this.isFullPageLayout = signal(isInitialFullPage);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        this.isFullPageLayout.set(this.fullPageRoutePaths.some((path) => url.includes(path)));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
