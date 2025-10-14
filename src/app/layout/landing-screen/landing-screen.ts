import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from '../../shared/compomonents/navigation/navigation';
import { Footer } from '../../shared/compomonents/footer/footer';

@Component({
  selector: 'app-landing-screen',
  imports: [RouterOutlet, Navigation, Footer],
  templateUrl: './landing-screen.html',
  styleUrl: './landing-screen.scss',
})
export class LandingScreen {}
