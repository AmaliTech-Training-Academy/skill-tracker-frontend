import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComingSoon } from '@app/shared/components/coming-soon/coming-soon';

@Component({
  selector: 'app-skill-arena',
  imports: [ComingSoon],
  templateUrl: './skill-arena.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillArena {}
