import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { SvgIconService } from './services/svg-icon.service';
import { AppConfigService } from './services/app-config.service';
import { SocketService } from './services/socket.service';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideToastr(),
    provideHttpClient(),
    provideAppInitializer(async () => {
      const appConfigService = inject(AppConfigService);
      const socketService = inject(SocketService);
      const svgService = inject(SvgIconService);

      await appConfigService.load();
      socketService.connect(appConfigService.apiUrl);
      svgService.registerIcons();
    })
  ]
};
