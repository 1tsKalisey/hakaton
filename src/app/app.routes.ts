import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./components/favorites/favorites.component').then(
        (m) => m.FavoritesComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
