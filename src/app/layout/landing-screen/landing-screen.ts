import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from '../../shared/components/navigation/navigation';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-landing-screen',
  imports: [RouterOutlet, Navigation, Footer],
  templateUrl: './landing-screen.html',
  styleUrl: './landing-screen.scss',
})
export class LandingScreen {}
