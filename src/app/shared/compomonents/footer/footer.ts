import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer implements OnInit, OnDestroy {
  public showFooter = false;
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.updateFooter(this.router.url);

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        this.updateFooter(event.urlAfterRedirects || event.url);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateFooter(url: string) {
    // Normalize URL: remove query params, hash fragments, and trailing slashes
    let normalized = url.split(/[?#]/)[0].replace(/\/+$/, '');
    if (!normalized.startsWith('/')) normalized = '/' + normalized;

    // Show footer only on homepage
    this.showFooter = normalized === '/';

    // Trigger template update for OnPush
    this.cdr.markForCheck();
  }
}
