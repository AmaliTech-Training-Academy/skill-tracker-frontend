import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { globalHttpErrorInterceptor } from './core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { LucideAngularModule } from 'lucide-angular';
import { appIcons } from '@app/core';

import { appState } from './store';
import { appEffects } from './store/app.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([globalHttpErrorInterceptor])),
    provideStore(appState),
    provideEffects(appEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideRouterStore(),
    provideMonacoEditor(),
    importProvidersFrom(LucideAngularModule.pick(appIcons)),
    provideAnimations(),
  ],
};
