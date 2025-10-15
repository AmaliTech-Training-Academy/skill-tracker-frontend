import { Component, inject, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ApiService } from '@app/core';
import { finalize } from 'rxjs';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface UpdatedPostDto {
  title: string;
  body: string;
  userId: number;
}

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

  getUsers() {
    this.reset();
    this.loading.set(true);

    this.api
      .get('users')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.data = res;
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
  }

  createPost() {
    this.reset();
    this.loading.set(true);

    const newPost = {
      title: 'My Test Post',
      body: 'This is a fake post for testing the ApiService.post() method.',
      userId: 1,
    };

    this.api
      .post<{ id: number; title: string; body: string; userId: number }>('posts', newPost)
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

  deletePost() {
    this.reset();
    this.loading.set(true);

    this.api
      .delete('posts/1')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.data = { message: 'Post deleted successfully' };
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
  }

  updatePost() {
    this.reset();
    this.loading.set(true);

    const updatedPost: UpdatedPostDto = {
      title: 'Updated Title',
      body: 'This post has been updated successfully',
      userId: 1,
    };

    this.api
      .update('posts/1', updatedPost)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          console.log('PUT response:', res);
          this.data = res;
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
  }

  getWithError() {
    this.reset();
    this.loading.set(true);

    this.api.get('invalid-endpoint').subscribe({
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
