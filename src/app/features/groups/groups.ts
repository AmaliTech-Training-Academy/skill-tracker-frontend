import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComingSoon } from '@app/shared/components/coming-soon/coming-soon';

@Component({
  selector: 'app-groups',
  imports: [ComingSoon],
  templateUrl: './groups.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Groups {}
