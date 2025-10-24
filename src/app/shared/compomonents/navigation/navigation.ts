import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss'],
})
export class Navigation {
 isMobileMenuOpen = false;

   navItems = [
    { label: 'Platform', link: '/', exact: false },
    { label: 'How It Works', link: '#how-it-works', exact: false },
    { label: 'Skills', link: '#skills', exact: false },
    { label: 'Pricing', link: '#pricing', exact: false }
  ];

  toggleMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
