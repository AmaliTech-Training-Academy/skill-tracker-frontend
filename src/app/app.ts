import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ApiService } from '@app/core';
import { ApiTest } from './features/api-test/api-test';
import { Toast } from './shared/compomonents/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('SkillBoost');
  name = 'Angular';
  http = inject(ApiService);

  constructor() {}
}
