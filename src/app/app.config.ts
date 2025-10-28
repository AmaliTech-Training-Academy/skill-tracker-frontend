import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { globalHttpErrorInterceptor } from './core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { uiReducer } from './store/ui/ui.reducer';
import { UIEffects } from './store/ui/ui.effects';
import { LucideAngularModule } from 'lucide-angular';
import { appIcons } from '@app/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([globalHttpErrorInterceptor])),
    provideStore({ ui: uiReducer }),
    provideEffects([UIEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideRouterStore(),
    importProvidersFrom(LucideAngularModule.pick(appIcons)),
  ],
};
