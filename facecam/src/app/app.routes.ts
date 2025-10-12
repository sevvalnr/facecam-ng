import { Routes } from '@angular/router';
import { WebcamComponent } from './features/webcam/webcam.component';

export const routes: Routes = [
  { path: '', component: WebcamComponent },
  { path: '**', redirectTo: '' }
];
