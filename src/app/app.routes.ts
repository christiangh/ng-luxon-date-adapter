import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/default-demo',
    pathMatch: 'full',
  },
  {
    path: 'default-demo',
    loadComponent: () =>
      import('./components/default-demo/default-demo.component').then(
        (m) => m.DefaultDemoComponent,
      ),
  },
];
