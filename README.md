# SkillTrakerFrontend

SkillBoost is a dynamic, personalized platform designed to help users develop and track their technical and communication skills through AI-generated challenges, comprehensive feedback, and progress tracking.

## 📌 Table of Contents

- [🚀 Getting Started](#-getting-started)
- [🛠️ Tech Stack](#-tech-stack)
- [✨ Key Features](#-key-features)
- [📦 Installing](#-installing)
- [💻 Running the Application](#-running-the-application)
- [🏗️ Architecture & Approach](#-architecture--approach)
- [👤 Author](#-author)

---

## 🚀 Getting Started

Ensure you have Node.js (v18+) and the Angular CLI installed.

---

## 🛠️ Tech Stack

**State Management:**

- **NgRx** (Store, Effects, Selectors) - Primary state management.
- **RxJS** - Reactive programming streams.

**UI & Styling:**

- SCSS (with BEM naming convention & custom mixins).
- **Ngx-Charts** - Data visualization for dashboard metrics.
- **Angular Shepherd** - User guided tours.

**Real-Time Communication:**

- **STOMP over WebSockets** (RabbitMQ) - For real-time execution results and feedback.

**Development & Quality:**

- **Jest** - Unit testing framework (replaced Karma).
- EsLint + Prettier - Code quality & formatting.
- Husky + Lint-Staged - Pre-commit hooks.
- Commitlint - Semantic commit message enforcement.

---

## ✨ Key Features

**🔐 Core & Security**

- **Secure Authentication:** HttpOnly cookie-based auth with secure NgRx state re-hydration on page load.
- **Multi-Step Onboarding:** Interactive wizard for collecting user interests and skill levels.
- **Global Error Handling:** Centralized error interceptors with context-based suppression logic.

**📊 Dashboard & Progression**

- **Interactive Dashboard:** Data-driven dashboard featuring stat cards, progress tracking charts, and recommended tasks.
- **Guided Tours:** Interactive walkthroughs for new users using Angular Shepherd.
- **Real-Time Notifications:** WebSocket integration to receive immediate feedback on submissions.

**📝 Task Execution Engine**

- **Coding Challenges:** Integrated code editor environment for solving technical algorithms with real-time test execution.
- **Writing Assessments:** Dedicated interface for submitting essays and long-form written responses.
- **Knowledge Quizzes:** Interactive engine for taking Multiple Choice Questions (MCQs) to test theoretical knowledge.

## 📦 Installing

Clone the repository and install dependencies:

```bash
git clone https://github.com/AmaliTech-Training-Academy/skill-tracker-frontend
cd skill-tracker-frontend
npm install
```

---

## 💻 Running the Application

### Start the development server:

```bash
ng serve
```

Navigate to http://localhost:4200/. The application will automatically reload if you change any of the source files.

### Run tests:

```bash
npm test
```

### Lint & Format the code

```bash
npm run lint
npm run format
```

### Build for production:

```bash
npm run build
```

## 🏗️ Architecture & Approach

---

### 1\. State Management (NgRx)

We utilize a **Redux pattern** via NgRx to manage application state.

- **Auth Store:** Handles user sessions, login/logout flows, and secure re-hydration (checking `/me` on app load instead of storing tokens in localStorage).

- **Dashboard Store:** Centralizes data fetching for stats, progress charts, and tasks to ensure a single source of truth for the UI.

### 2\. Component Architecture

We follow the **Smart vs. Dumb Component** pattern:

- **Smart (Container) Components:** Connect to the NgRx store, dispatch actions, and handle logic (e.g., `DashboardMainComponent`).

- **Dumb (Presentational) Components:** purely receive data via `@Input()` and emit events via `@Output()` (e.g., `StatCardComponent`, `ProgressBarComponent`).

### 3\. Routing & Security

Routes are protected by a suite of dedicated guards:

- `AuthGuard`: Protects private routes.

- `GuestGuard`: Prevents authenticated users from accessing login/register pages.

- `OnboardingGuard`: Ensures users complete the wizard before accessing the dashboard.

- `EmailVerificationGuard`: Prevents infinite redirect loops for unverified users.

### 4\. Code Quality Standards

- **Strict Typing:** No `any` types allowed.

- **ESM/CommonJS Compatibility:** configured Jest to handle ESM modules (like `ngx-charts`) via module mapping.

- **Pre-commit Hooks:** Husky ensures no code is committed unless it passes linting and tests.

## 👤 Author

- Amalitech GTP Frontend Team

## 🧠 License

This project is licensed under the [MIT License](https://opensource.org/license/mit)
