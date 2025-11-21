import { Router } from '@angular/router';
import { ShepherdService } from 'angular-shepherd';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { updateTourStatus } from '@app/store/auth/auth.actions';
import { TourGuide } from '@app/core';

export const STEPS_BUTTONS = {
  back: {
    classes: 'back-button',
    secondary: true,
    text: 'Back',
    type: 'back',
  },
  cancel: {
    classes: 'cancel-button',
    secondary: true,
    text: 'Cancel',
    type: 'cancel',
  },
  next: {
    classes: 'next-button',
    text: 'Next',
    type: 'next',
  },
  finish: {
    classes: 'next-button',
    text: 'Finish',
    type: 'next',
  },
};

export const defaultStepOptions = {
  classes: 'shepherd-theme-arrows custom-default-class tour-card',
  scrollTo: true,
  cancelIcon: {
    enabled: true,
  },
};

export function getSteps(router: Router, service: ShepherdService, store: Store<AppState>) {
  return [
    {
      id: 'intro',
      title: 'Hello Welcome to Skill Dev',
      text: "Let's show you around!",
      buttons: [
        {
          text: 'Skip Tour',
          action: () => {
            store.dispatch(updateTourStatus({ tourStatus: TourGuide.COMPLETED }));
            service.cancel();
          },
          classes: 'shepherd-button-secondary',
        },
        {
          text: 'Take a Tour',
          action: () => service.next(),
          classes: 'shepherd-button-primary',
        },
      ],
    },
    {
      attachTo: {
        element: '[data-tour-id="sidebar-dashboard"]',
        on: 'right',
      },
      buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
      id: 'dashboard-link',
      title: 'Your Dashboard',
      text: 'You’ll find your progress, recommended tasks, and quick links to key features. Check back here anytime to track your learning journey.',
    },
    {
      attachTo: {
        element: '[data-tour-id="sidebar-tasks"]',
        on: 'right',
      },
      buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
      id: 'task-link',
      title: 'Tasks',
      text: 'Track and complete coding challenges and learning activities. Progress through tasks to build your skills step by step.',
    },
    {
      attachTo: {
        element: '[data-tour-id="sidebar-leaderboard"]',
        on: 'right',
      },
      buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
      id: 'leaderboard-link',
      title: 'Leaderboard',
      text: 'See how you rank against other learners. Climb the leaderboard by completing tasks and earning points.',
    },
    {
      attachTo: {
        element: '[data-tour-id="sidebar-skill-arena"]',
        on: 'right',
      },
      buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
      id: 'skill-arena-link',
      title: 'Skill Arena',
      text: 'Test your abilities in real-time challenges. Compete, practice, and sharpen your skills in a fun environment.',
    },
    {
      attachTo: {
        element: '[data-tour-id="sidebar-groups"]',
        on: 'right',
      },
      buttons: [
        STEPS_BUTTONS.cancel,
        {
          text: 'Finish Tour',
          action: () => {
            store.dispatch(updateTourStatus({ tourStatus: TourGuide.COMPLETED }));
            service.complete();
          },
          classes: 'shepherd-button-primary',
        },
      ],
      id: 'skill-arena-link',
      title: 'Community',
      text: 'Join or create groups to learn together. Collaborate, share progress, and support each other on your skill journey.',
    },
  ];
}
