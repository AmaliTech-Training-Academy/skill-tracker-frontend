import { createReducer, on } from '@ngrx/store';
import { initialUIState } from './ui.state';
import * as UIActions from './ui.actions';

export const uiReducer = createReducer(
  initialUIState,

  on(UIActions.showToast, (state, { config }) => ({
    ...state,
    toast: {
      ...state.toast,
      isVisible: true,
      isExiting: false,
      config,
    },
  })),

  on(UIActions.startToastExit, (state) => ({
    ...state,
    toast: {
      ...state.toast,
      isExiting: true,
    },
  })),

  on(UIActions.hideToast, (state) => ({
    ...state,
    toast: {
      ...state.toast,
      isVisible: false,
      isExiting: false,
    },
  })),

  on(UIActions.toggleSidebar, (state) => ({
    ...state,
    sidebarOpen: !state.sidebarOpen,
  })),

  on(UIActions.setLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),
);
