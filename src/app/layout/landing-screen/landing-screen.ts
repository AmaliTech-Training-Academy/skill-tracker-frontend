import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { NavigationEnd, RouterOutlet, Router } from '@angular/router';
import { filter } from 'rxjs';

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
export class LandingScreen {
  private readonly fullPageRoutePaths: string[] = [
    APP_CONSTANTS.FULL_PAGE_ROUTES.LEVEL_SELECTION,
    APP_CONSTANTS.FULL_PAGE_ROUTES.INTEREST_SELECTION,
  ];

  public isFullPageLayout: WritableSignal<boolean>;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private router: Router) {
    const initialUrl = this.router.url;
    const isInitialFullPage = this.fullPageRoutePaths.some((path) => initialUrl.includes(path));

    this.isFullPageLayout = signal(isInitialFullPage);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        this.isFullPageLayout.set(this.fullPageRoutePaths.some((path) => url.includes(path)));
      });
  }
}
