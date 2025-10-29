# Jest Configuration

## Overview
Jest is configured as the testing framework for this Angular application, replacing the default Karma/Jasmine setup.

## Configuration Files

### jest.config.js
Main Jest configuration with Angular-specific settings:
- **Preset**: `jest-preset-angular` for Angular compatibility
- **Test Environment**: `jsdom` for DOM simulation
- **Coverage**: Configured for TypeScript files with exclusions
- **Path Mapping**: Aliases for clean imports (`@app`, `@core`, `@shared`, `@features`)

### setup-jest.ts
Test environment setup file that:
- Imports Jest preset for Angular
- Mocks browser APIs (CSS, ResizeObserver, IntersectionObserver)
- Provides DOM compatibility for Node.js environment

## Scripts
```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:ci       # Run tests for CI (no watch, with coverage)
```

## Test File Patterns
Jest will find and run tests in:
- `src/**/__tests__/**/*.(ts|js)` - Files in `__tests__` folders
- `src/**/(*.)+(spec|test).(ts|js)` - Files ending with `.spec.ts` or `.test.ts`

## Coverage Reports
Generated in `coverage/` directory with formats:
- **HTML**: Interactive report viewable in browser
- **LCOV**: For CI/CD integration
- **Text Summary**: Console output

## Path Aliases
Import aliases configured for cleaner test imports:
```typescript
import { UserService } from '@app/services/user.service';
import { AuthGuard } from '@core/guards/auth.guard';
import { ButtonComponent } from '@shared/components/button.component';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
```

## Browser API Mocks
The setup file provides mocks for:
- `window.CSS`
- `window.getComputedStyle`
- `document.doctype`
- `ResizeObserver`
- `IntersectionObserver`

These prevent errors when testing components that use modern browser APIs.

## API Mocks
For HTTP requests and service testing, use Jest's mocking capabilities:

### Service Mocks
```typescript
// Mock entire service
jest.mock('@app/services/user.service');

// Mock specific methods
const mockUserService = {
  getUsers: jest.fn().mockResolvedValue([{ id: 1, name: 'Test User' }]),
  createUser: jest.fn().mockResolvedValue({ id: 2, name: 'New User' })
};
```

### HTTP Client Mocks
```typescript
// Mock HttpClient responses
const mockHttpClient = {
  get: jest.fn().mockReturnValue(of({ data: 'test' })),
  post: jest.fn().mockReturnValue(of({ success: true }))
};

// In test setup
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      { provide: HttpClient, useValue: mockHttpClient }
    ]
  });
});
```

### API Response Mocks
```typescript
// Mock API responses with different scenarios
const mockApiResponse = {
  success: { status: 200, data: { users: [] } },
  error: { status: 500, error: 'Server Error' },
  loading: new Promise(resolve => setTimeout(resolve, 1000))
};

// Use in tests
it('should handle API success', () => {
  mockUserService.getUsers.mockResolvedValue(mockApiResponse.success);
  // Test implementation
});
```
