import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoon {
  @Input() public title: string = 'Coming Soon';
  @Input() public description: string = 'Stay tuned for updates!';

  @Input() public iconName: string = 'rocket';
}
