import { Component } from '@angular/core';
import { Features } from './components/features/features';
import { HeroSection } from './components/hero-section/hero-section';
import { SkillsDevelopment } from './components/skills-development/skills-development';
import { LuminaCallout } from './components/lumina-callout/lumina-callout';
import { PricingModels } from './components/pricing-models/pricing-models';

@Component({
  selector: 'app-landing-page',
  imports: [Features, HeroSection, SkillsDevelopment, LuminaCallout, PricingModels],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss'
})
export class LandingPage {

}
