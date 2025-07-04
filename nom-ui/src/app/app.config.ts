import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { ApiInteractionInterceptor } from './utilities/interceptors/api-interaction.interceptor';
import { routes } from './app.routes';
import { NomConfigService } from './utilities/services/nom-config.service';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './utilities/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserAnimationsModule, CommonModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: NomConfigService,
      useClass: NomConfigService,
    },
    {
      provide: AuthInterceptor,
      useClass: AuthInterceptor,
    },
    {
      provide: ApiInteractionInterceptor,
      useClass: ApiInteractionInterceptor,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: ApiInteractionInterceptor,
      multi: true,
    },
  ],
};
