import { Component, inject, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ApiService } from '@app/core';

@Component({
  selector: 'app-api-test',
  imports: [CommonModule, JsonPipe],
  templateUrl: './api-test.html',
  styleUrl: './api-test.scss',
})
export class ApiTest {
  private api = inject(ApiService);

  data: any;
  loading = signal(false);
  errorMessage = '';

  /**
   * Test: Successful GET request
   */
  getUsers() {
    this.reset();
    this.loading.set(true);

    this.api
      .get('users', {
        params: { _limit: 5 },
        headers: { 'Custom-Header': 'DemoTest' },
        retryCount: 1,
      })
      .subscribe({
        next: (res) => {
          console.log(' yes ', res);
          this.data = res;
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.loading.set(false);
        },
      });
  }

  /**
   * Test: Error handling by calling an invalid endpoint
   */
  getWithError() {
    this.reset();
    this.loading.set(true);

    this.api.get('invalid-endpoint', { retryCount: 0 }).subscribe({
      next: (res) => {
        this.data = res;
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading.set(false);
      },
    });
  }

  private reset() {
    this.data = null;
    this.errorMessage = '';
  }
}
