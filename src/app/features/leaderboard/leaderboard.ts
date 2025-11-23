import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComingSoon } from '@app/shared/components/coming-soon/coming-soon';

@Component({
  selector: 'app-leaderboard',
  imports: [ComingSoon],
  templateUrl: './leaderboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Leaderboard {}
