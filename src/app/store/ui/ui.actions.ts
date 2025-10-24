import { createAction, props } from '@ngrx/store';
import { ToastConfig } from '@app/core';

export const showToast = createAction('[UI] Show Toast', props<{ config: ToastConfig }>());

export const startToastExit = createAction('[UI] Start Toast Exit');

export const hideToast = createAction('[UI] Hide Toast');

export const toggleSidebar = createAction('[UI] Toggle Sidebar');

export const setLoading = createAction('[UI] Set Loading', props<{ loading: boolean }>());
