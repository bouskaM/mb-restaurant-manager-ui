import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/auth.guard';
import { NavbarComponent } from './shared/navbar/navbar.component';

/**
 * Configuration of routes for the application.
 *
 * @remarks
 * All routes requiring authentication are lazy loaded.
 */
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: NavbarComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'restaurants',
        loadComponent: () =>
          import('./features/restaurants/restaurants.component').then(
            (m) => m.RestaurantsComponent
          ),
      },
    ],
  },

  // fallback redirect
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
