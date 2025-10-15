---

# 🧭 API Service Guide

## Overview

The `ApiService` provides a **centralized, reusable wrapper** around Angular’s `HttpClient`.
It helps simplify HTTP calls across the app by handling:

* ✅ Base URL management
* ✅ Common headers and parameters
* ✅ Retry logic
* ✅ Centralized error handling
* ✅ Type-safe requests and responses

---

## 🧩 Location

**File:** `src/app/core/services/api-service.ts`

---

## 🚀 Basic Usage

All methods return **RxJS `Observable`** streams, so you can `.subscribe()` or use `async` pipes.

```typescript
import { ApiService } from '@app/core';
```

Example injection:

```typescript
constructor(private api: ApiService) {}
```

---

## 🌐 Methods

### 1. `get<Res>()`

Fetches data from an API endpoint.

```typescript
this.api
  .get<User[]>('users', {
    params: { _limit: 5 },
    headers: { Authorization: 'Bearer token' },
    retryCount: 1,
  })
  .subscribe({
    next: (res) => console.log(res),
    error: (err) => console.error(err.message),
  });
```

**Options:**

- `params`: Query parameters (`HttpParams` or object)
- `headers`: Custom headers (`HttpHeaders` or object)
- `retryCount`: Number of automatic retries (default: `2`)

---

### 2. `post<Res, Req>()`

Sends data to create a resource.

```typescript
interface CreatePostDto {
  title: string;
  body: string;
  userId: number;
}

interface PostResponse {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const newPost: CreatePostDto = {
  title: 'Hello world',
  body: 'This is a sample post',
  userId: 1,
};

this.api.post<PostResponse, CreatePostDto>('posts', newPost).subscribe({
  next: (res) => console.log('Created:', res),
  error: (err) => console.error(err.message),
});
```

✅ Automatically includes the `Content-Type: application/json` header.

---

### 3. `put<Res, Req>()`

Updates an existing resource.

```typescript
interface UpdatePostDto {
  title: string;
  body: string;
  userId: number;
}

this.api
  .put<PostResponse, UpdatePostDto>('posts/1', {
    title: 'Updated title',
    body: 'Updated content',
    userId: 1,
  })
  .subscribe({
    next: (res) => console.log('Updated:', res),
    error: (err) => console.error(err.message),
  });
```

---

### 4. `delete()`

Deletes a resource by URL.

```typescript
this.api.delete('posts/1').subscribe({
  next: () => console.log('Deleted successfully'),
  error: (err) => console.error(err.message),
});
```

If your API returns a response body on delete:

```typescript
this.api.delete('posts/1').subscribe((res) => console.log(res.message));
```

---

## ⚙️ Options Object

Every method accepts an optional `ApiRequestOptions` object:

```typescript
interface ApiRequestOptions {
  retryCount?: number;
  params?: HttpParams | { [param: string]: string | number | boolean };
  headers?: HttpHeaders | { [header: string]: string | string[] };
}
```

---

## 🧠 Error Handling

All errors are automatically passed through your custom `ErrorHandlerService`.
It normalizes messages and handles common HTTP status codes like `400`, `401`, `404`, and `500`.

Example:

```typescript
this.api.get('invalid-endpoint').subscribe({
  error: (err) => console.error(err.message),
});
```

Might log:

> `"The requested resource was not found."`

---

## 🧰 Utility Functions (Internal)

| Function                    | Purpose                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `fullUrl(endpoint: string)` | Joins `environment.url` with endpoint safely               |
| `buildParams(params)`       | Converts object or `HttpParams` to query string            |
| `buildHeaders(headers)`     | Merges provided headers with defaults (JSON Content-Type)  |
| `handleError(error)`        | Delegates to `ErrorHandlerService` for consistent messages |

---

## 🧪 Example Component (for Testing)

```typescript
@Component({
  selector: 'app-api-test',
  template: `
    <button (click)="getUsers()">GET</button>
    <button (click)="createPost()">POST</button>
    <button (click)="updatePost()">PUT</button>
    <button (click)="deletePost()">DELETE</button>
    <pre>{{ data | json }}</pre>
  `,
})
export class ApiTestComponent {
  data: any;
  loading = false;

  constructor(private api: ApiService) {}

  getUsers() {
    this.api.get('users', { params: { _limit: 5 } }).subscribe((res) => (this.data = res));
  }

  createPost() {
    this.api
      .post('posts', { title: 'Demo', body: 'Example', userId: 1 })
      .subscribe((res) => (this.data = res));
  }

  updatePost() {
    this.api
      .put('posts/1', { title: 'Updated', body: 'Content', userId: 1 })
      .subscribe((res) => (this.data = res));
  }

  deletePost() {
    this.api.delete('posts/1').subscribe(() => (this.data = { message: 'Deleted' }));
  }
}
```

---

## 🔐 Best Practices

- Always use **typed requests and responses** for maintainability.
- Use `retryCount` carefully — usually 1–2 retries are enough.
- Handle all business logic in your services, not components.
- Keep API endpoints centralized (e.g., `environment.url`).

---

## 🏁 Summary

| Method             | Purpose     | Default Return Type | Customizable |
| ------------------ | ----------- | ------------------- | ------------ |
| `get<Res>()`       | Fetch data  | `Observable<any>`   | ✅           |
| `post<Res, Req>()` | Create data | `Observable<Res>`   | ✅           |
| `put<Res, Req>()`  | Update data | `Observable<Res>`   | ✅           |
| `delete()`         | Delete data | `Observable<void>`  | ✅           |

---
