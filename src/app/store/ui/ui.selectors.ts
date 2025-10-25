import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UIState } from './ui.state';

export const selectUIState = createFeatureSelector<UIState>('ui');

export const selectToastState = createSelector(selectUIState, (state) => state.toast);

export const selectIsToastVisible = createSelector(selectToastState, (toast) => toast.isVisible);

export const selectIsToastExiting = createSelector(selectToastState, (toast) => toast.isExiting);

export const selectToastConfig = createSelector(selectToastState, (toast) => toast.config);

export const selectSidebarOpen = createSelector(selectUIState, (state) => state.sidebarOpen);

export const selectLoading = createSelector(selectUIState, (state) => state.loading);
