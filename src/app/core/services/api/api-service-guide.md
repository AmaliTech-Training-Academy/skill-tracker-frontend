# 🧭 API Service Guide

## Overview

The `ApiService` provides a **centralized, reusable wrapper** around Angular’s `HttpClient`.
It simplifies HTTP calls across the app by handling:

- ✅ Base URL management
- ✅ Common headers and parameters
- ✅ Type-safe requests and responses
- ✅ Centralized error handling (via **ErrorInterceptor**)
- ✅ Automatic retry logic (via **RetryInterceptor**)

---

## 🧩 Location

**File:** `src/app/core/services/api/api-service.ts`

---

## 🚀 Basic Usage

All methods return **RxJS `Observable`** streams.
You can either `.subscribe()` directly or use them with the `async` pipe in templates.

```typescript
import { ApiService } from '@app/core/services/api/api-service';

constructor(private api: ApiService) {}
```

💯 Excellent observation — you’re absolutely right.

If you already have an **AuthInterceptor** that automatically attaches the `Authorization` header with the bearer token, then you **don’t need to manually pass headers** in your `ApiService` calls (except for special cases like file uploads or custom headers).

Let’s clean up your documentation to reflect that.

---

Here’s the updated section for your guide 👇

---

## 🌐 Methods

### 1. `get<Res>()`

Fetches data from an API endpoint.

```typescript
this.api.get<User[]>('users', { params: { _limit: 5 } }).subscribe({
  next: (res) => console.log(res),
  error: (err) => console.error(err.message),
});
```

**Options:**

- `params`: Query parameters (`HttpParams` or object)
- `headers`: _(Optional)_ Custom headers — **only needed for special cases** like custom tokens or file uploads.

> 🧠 Note: The **AuthInterceptor** automatically appends your `Authorization: Bearer <token>` header for authenticated requests.
> You don’t need to include it manually.

> 🔄 Retry behavior is handled globally by the **RetryInterceptor** — no need to configure retries manually.

---

### 2. `post<Res, Req>()`

Sends data to create a resource.

```typescript
interface CreatePost {
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

const payload: CreatePost = {
  title: 'Hello world',
  body: 'This is a sample post',
  userId: 1,
};

this.api.post<PostResponse, CreatePost>('posts', payload).subscribe({
  next: (res) => console.log('Created:', res),
  error: (err) => console.error(err.message),
});
```

✅ Automatically includes:

- `Content-Type: application/json`
- `Authorization` (via `AuthInterceptor`)

---

### 3. `put<Res, Req>()`

Updates an existing resource.

```typescript
interface UpdatePost {
  title: string;
  body: string;
  userId: number;
}

this.api
  .put<PostResponse, UpdatePost>('posts/1', {
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

Deletes a resource.

```typescript
this.api.delete('posts/1').subscribe({
  next: () => console.log('Deleted successfully'),
  error: (err) => console.error(err.message),
});
```

If your API returns a response body after deletion:

```typescript
this.api.delete('posts/1').subscribe((res) => console.log(res));
```

---

## 🔐 Best Practices

- Always use **typed requests and responses** for maintainability.
- Don’t manually handle retries — let the **RetryInterceptor** do that.
- Keep components dumb: handle logic inside services.
- Use centralized constants and environments for configuration.

---

## 🏁 Summary

| Method             | Purpose     | Default Return Type | Customizable |
| ------------------ | ----------- | ------------------- | ------------ |
| `get<Res>()`       | Fetch data  | `Observable<any>`   | ✅           |
| `post<Res, Req>()` | Create data | `Observable<Res>`   | ✅           |
| `put<Res, Req>()`  | Update data | `Observable<Res>`   | ✅           |
| `delete()`         | Delete data | `Observable<void>`  | ✅           |

---
