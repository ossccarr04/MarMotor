import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), 
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right', 
      preventDuplicates: true,
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay())
  ],
};


