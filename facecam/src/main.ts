import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { WebcamComponent } from './app/features/webcam/webcam.component';

bootstrapApplication(WebcamComponent, {
  providers: [provideHttpClient(), ...appConfig.providers]
}).catch(err => console.error(err));
