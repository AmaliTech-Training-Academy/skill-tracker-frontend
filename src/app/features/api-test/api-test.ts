import { Component, inject, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ApiService } from '@app/core';
import { finalize } from 'rxjs';

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
   * Test: Successfult POST request
   */
  createPost() {
    this.reset();
    this.loading.set(true);

    const newPost = {
      title: 'My Test Post',
      body: 'This is a fake post for testing the ApiService.post() method.',
      userId: 1,
    };

    this.api
      .post<{ id: number; title: string; body: string; userId: number }>('posts', newPost, {
        retryCount: 1,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          console.log('POST response', res);
          this.data = res;
        },
        error: (err) => {
          console.error('POST error:', err);
          this.errorMessage = err.message;
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
