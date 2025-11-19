import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-lumina-callout',
  templateUrl: './lumina-callout.html',
  styleUrl: './lumina-callout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LuminaCallout {
  public title = 'Meet Lumina: The AI that illuminates your technical path.';
  public description =
    'Our built-in AI guide and tutor, Lumina, creates personalized challenges designed just for you, shedding light on complex concepts and helping you find your way when you get stuck.';
  public robotImageSrc = 'assets/robot.png';
  public robotImageAlt = 'Lumina AI Robot';
}
