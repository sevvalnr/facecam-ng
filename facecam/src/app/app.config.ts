// src/app/app.config.ts
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

// NgRx
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// <-- bizim store parçaları
import { facesReducer } from './store/faces/faces.reducer';
import { FacesEffects } from './store/faces/faces.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),

    // NgRx: store + effects KAYDI
    provideStore({ faces: facesReducer }),
    provideEffects([FacesEffects]),

    // Devtools
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
