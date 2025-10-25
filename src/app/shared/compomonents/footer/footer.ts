import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  standalone: true
})
export class Footer implements OnInit {
  showFooter = false;

  constructor(private router: Router) {}

  ngOnInit() {
    
    this.checkRoute(this.router.url);

    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  private checkRoute(url: string) {
    
    this.showFooter = url === '/' || url === '';
  }
}