# Angular Project Structure Guide

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Folder Structure Details](#folder-structure-details)
   - [Core Folder (`/core/`)](#core-folder-core)
   - [Shared Folder (`/shared/`)](#shared-folder-shared)
   - [Store Folder (`/store/`)](#store-folder-store)
   - [Features Folder (`/features/`)](#features-folder-features)
4. [File Naming Conventions](#file-naming-conventions)
   - [Components](#components)
   - [Services](#services)
   - [Pipes](#pipes)
   - [Directives](#directives)
   - [Guards](#guards)
   - [Interceptors](#interceptors)
   - [Models](#models)
   - [NgRx Files](#ngrx-files)
5. [Decision Tree: Where to Place New Files](#decision-tree-where-to-place-new-files)
   - [Adding a New Component](#adding-a-new-component)
   - [Adding a New Service](#adding-a-new-service)
   - [Adding a New Pipe](#adding-a-new-pipe)
   - [Adding a New Directive](#adding-a-new-directive)
   - [Adding NgRx State](#adding-ngrx-state)
6. [Module Organization](#module-organization)
   - [Core Module](#core-module)
   - [Shared Module](#shared-module)
   - [Feature Modules](#feature-modules)
7. [Best Practices](#best-practices)
   - [Component Organization](#component-organization)
   - [Service Organization](#service-organization)
   - [State Management](#state-management)
   - [Import Organization](#import-organization)
8. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
9. [Team Guidelines](#team-guidelines)
   - [Before Adding New Files](#before-adding-new-files)
   - [Code Review Checklist](#code-review-checklist)
   - [Refactoring Guidelines](#refactoring-guidelines)
10. [Tools and Scripts](#tools-and-scripts)
    - [Generate Components](#generate-components)
    - [Generate Services](#generate-services)
    - [Generate NgRx Files](#generate-ngrx-files)
11. [Conclusion](#conclusion)

## Overview

This document outlines the standardized folder structure for an Angular medium-sized application. Following this structure ensures consistency, maintainability, and scalability across the development team.

## Project Structure

```
src/
 ├── app/
 │    ├── core/              → App-wide singletons and essential services
 │    ├── shared/            → Shared components, pipes, directives, validators
 │    ├── store/             → Global NgRx state management
 │    ├── features/          → Feature modules organized by domain
 │    │     ├── products/
 │    │     ├── services/
 │    │     ├── admin/       → Admin-specific UI + routing
 │    │     └── public/      → Public-facing UI + routing
 │    ├── app.routes.ts      → Top-level standalone routing
 │    ├── app.component.ts   → Shell or Main component
 │    └── app.config.ts      → App configuration
```

## Folder Structure Details

### Core Folder (`/core/`)

**Purpose:** Contains app-wide singleton services, interceptors, guards, and models that are used throughout the application.

**Structure:**

```
core/
 ├── services/
 │    ├── auth.service.ts
 │    ├── api.service.ts
 │    ├── notification.service.ts
 │    └── theme.service.ts
 ├── interceptors/
 │    ├── token.interceptor.ts
 │    ├── error.interceptor.ts
 │    └── loading.interceptor.ts
 ├── guards/
 │    ├── auth.guard.ts
 │    └── admin.guard.ts
 ├── models/
 │    ├── user.model.ts
 │    ├── api-response.model.ts
 │    └── auth.model.ts
 └── index.ts
```

**When to Add Files:**

- **Services:** App-wide singleton services (authentication, HTTP client, notifications)
- **Interceptors:** HTTP interceptors for tokens, errors, loading states
- **Guards:** Route guards for authentication and authorization
- **Models:** Global interfaces and types used across multiple features

### Shared Folder (`/shared/`)

**Purpose:** Contains reusable components, pipes, directives, and utilities that can be used across multiple features.

**Structure:**

```
shared/
 ├── components/
 │    ├── ui/
 │    │    ├── button/
 │    │    ├── modal/
 │    │    ├── loader/
 │    │    ├── card/
 │    │    ├── avatar/
 │    │    └── toast/
 │    ├── layout/
 │    │    ├── header/
 │    │    ├── sidebar/
 │    │    └── footer/
 │    └── forms/
 │         ├── input/
 │         ├── textarea/
 │         └── select/
 ├── pipes/
 │    ├── truncate.pipe.ts
 │    ├── time-ago.pipe.ts
 │    ├── safe-html.pipe.ts
 │    └── duration.pipe.ts
 ├── directives/
 │    ├── click-outside.directive.ts
 │    ├── lazy-load.directive.ts
 │    ├── auto-focus.directive.ts
 │    └── permission.directive.ts
 ├── validators/
 │    ├── custom-validators.ts
 │    └── async-validators.ts
 ├── utils/
 │    ├── date.utils.ts
 │    ├── string.utils.ts
 │    └── validation.utils.ts
 └── index.ts
```

**When to Add Files:**

- **UI Components:** Generic, reusable components (buttons, modals, cards)
- **Layout Components:** Common layout elements (headers, footers, sidebars)
- **Form Components:** Reusable form controls and inputs
- **Pipes:** Data transformation pipes used in multiple features
- **Directives:** Behavioral directives for DOM manipulation
- **Validators:** Custom form validators
- **Utils:** Helper functions and utilities

### Store Folder (`/store/`)

**Purpose:** Contains global NgRx state management files that affect the entire application.

**Structure:**

```
store/
 ├── app.state.ts
 ├── app.effects.ts
 ├── app.reducer.ts
 ├── auth/
 │    ├── auth.actions.ts
 │    ├── auth.reducer.ts
 │    ├── auth.effects.ts
 │    ├── auth.selectors.ts
 │    └── auth.state.ts
 ├── ui/
 │    ├── ui.actions.ts
 │    ├── ui.reducer.ts
 │    └── ui.selectors.ts
 └── index.ts
```

**When to Add Files:**

- **Global State:** Application-wide state (authentication, UI state, theme)
- **Cross-Feature State:** State that affects multiple features
- **App-Level Effects:** Effects that handle global side effects

### Features Folder (`/features/`)

**Purpose:** Contains feature-specific modules organized by business domain.

**Structure (for each feature):**

```
feature-name/
 ├── components/
 │    ├── feature-component-1/
 │    ├── feature-component-2/
 │    └── feature-component-3/
 ├── pages/
 │    ├── feature-page-1/
 │    └── feature-page-2/
 ├── services/
 │    └── feature.service.ts
 ├── store/
 │    ├── feature.actions.ts
 │    ├── feature.reducer.ts
 │    ├── feature.effects.ts
 │    └── feature.selectors.ts
 ├── models/
 │    └── feature.model.ts
 ├── feature.routes.ts
 └── index.ts
```

**When to Add Files:**

- **Components:** Feature-specific components that are not reusable
- **Pages:** Route components (smart components)
- **Services:** Business logic services for the feature
- **Store:** Feature-specific NgRx state management
- **Models:** Feature-specific interfaces and types
- **Routes:** Feature routing configuration

## File Naming Conventions

### Components

- **Format:** `component-name.component.ts`
- **Example:** `confession-card.component.ts`

**NB:** For Angular v20 and latest

- **Format:** `component-name.ts`
- **Example:** `movies-table.ts`

### Services

- **Format:** `service-name.service.ts`
- **Example:** `confession.service.ts`

### Pipes

- **Format:** `pipe-name.pipe.ts`
- **Example:** `truncate.pipe.ts`

### Directives

- **Format:** `directive-name.directive.ts`
- **Example:** `click-outside.directive.ts`

### Guards

- **Format:** `guard-name.guard.ts`
- **Example:** `auth.guard.ts`

### Interceptors

- **Format:** `interceptor-name.interceptor.ts`
- **Example:** `token.interceptor.ts`

### Models

- **Format:** `model-name.model.ts`
- **Example:** `confession.model.ts`

### NgRx Files

- **Actions:** `feature.actions.ts`
- **Reducer:** `feature.reducer.ts`
- **Effects:** `feature.effects.ts`
- **Selectors:** `feature.selectors.ts`
- **State:** `feature.state.ts`

## Decision Tree: Where to Place New Files

### Adding a New Component

**Is it reusable across multiple features?**

- **Yes:** Place in `/shared/components/ui/` or `/shared/components/forms/`
- **No:** Place in the specific feature's `/components/` folder

**Is it a page component (routable)?**

- **Yes:** Place in the feature's `/pages/` folder
- **No:** Place in the feature's `/components/` folder

### Adding a New Service

**Is it used across multiple features?**

- **Yes:** Place in `/core/services/`
- **No:** Place in the specific feature's `/services/` folder

**Is it a singleton service?**

- **Yes:** Place in `/core/services/` and add to `core.module.ts`
- **No:** Place in the feature's `/services/` folder

### Adding a New Pipe

**Is it used across multiple features?**

- **Yes:** Place in `/shared/pipes/`
- **No:** Place in the specific feature's folder (create a `/pipes/` subfolder if needed)

### Adding a New Directive

**Is it used across multiple features?**

- **Yes:** Place in `/shared/directives/`
- **No:** Place in the specific feature's folder (create a `/directives/` subfolder if needed)

### Adding NgRx State

**Does it affect multiple features or the entire app?**

- **Yes:** Place in `/store/`
- **No:** Place in the specific feature's `/store/` folder

## Module Organization

### Core Module

- Import only once in `app.module.ts`
- Contains singleton services and providers
- Should have a guard to prevent re-import

### Shared Module

- Import in feature modules that need shared components
- Export common components, pipes, and directives
- Import common Angular modules (CommonModule, FormsModule, etc.)

### Feature Modules

- Lazy-loaded modules for better performance
- Self-contained with their own routing
- Import SharedModule for common functionality

## Best Practices

### Component Organization

1. **Smart vs Dumb Components:** Keep page components smart, other components dumb
2. **Component Size:** Keep components focused and under 200 lines
3. **Component Communication:** Use @Input/@Output for parent-child, services for distant components

### Service Organization

1. **Single Responsibility:** Each service should have a single, well-defined purpose
2. **Dependency Injection:** Use Angular's DI system properly
3. **Error Handling:** Implement consistent error handling patterns

### State Management

1. **Feature State:** Keep feature state within the feature module
2. **Global State:** Only use global state for truly global concerns
3. **State Shape:** Keep state flat and normalized

### Import Organization

1. **Angular Imports:** First
2. **Third-party Imports:** Second
3. **Application Imports:** Last
4. **Relative Imports:** Use relative paths for same-feature files

## Common Mistakes to Avoid

### ❌ Don't Do This

- Placing feature-specific components in `/shared/`
- Creating deep nesting beyond 3 levels
- Mixing business logic in components
- Importing feature modules in other feature modules
- Creating circular dependencies

### ✅ Do This

- Keep feature boundaries clear
- Use barrel exports (`index.ts`) for clean imports
- Follow the single responsibility principle
- Use consistent naming conventions
- Document complex business logic

## Team Guidelines

### Before Adding New Files

1. **Check Existing:** Verify if similar functionality already exists
2. **Follow Decision Tree:** Use the decision tree to determine placement
3. **Naming Convention:** Follow established naming conventions
4. **Code Review:** Have placement decisions reviewed by team leads

### Code Review Checklist

- [ ] File is in the correct folder
- [ ] Naming convention is followed
- [ ] No circular dependencies created
- [ ] Proper imports/exports used
- [ ] Documentation is adequate

### Refactoring Guidelines

- **When to Move:** Move files when they become reusable or when boundaries change
- **How to Move:** Update all imports and verify no breaking changes
- **Communication:** Notify team of major structural changes

## Tools and Scripts

### Generate Components

```bash
# For shared components
ng generate component shared/components/ui/button

# For feature components
ng generate component features/confessions/components/confession-card

# For page components
ng generate component features/confessions/pages/confession-detail
```

### Generate Services

```bash
# For core services
ng generate service core/services/auth

# For feature services
ng generate service features/confessions/services/confession
```

### Generate NgRx Files

```bash
# For feature store
ng generate store features/confessions/store/Confession --module=features/confessions/confessions.module.ts
```

## Conclusion

This structure provides a solid foundation for medium-sized Angular applications. It promotes code reusability, maintainability, and team collaboration. Regular reviews and updates to this guide ensure it remains relevant as the project evolves.

Remember: The goal is consistency and clarity. When in doubt, discuss with the team and update this guide accordingly.
