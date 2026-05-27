import { Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home),
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login),
    pathMatch: 'full',
    canActivate: [GuestGuard]
  },

  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro').then(m => m.Registro),
    pathMatch: 'full',
    canActivate: [GuestGuard]
  },

  {
    path: 'quien-soy',
    loadComponent: () =>
      import('./pages/quien-soy/quien-soy').then(m => m.QuienSoy),
    pathMatch: 'full'
  },

  {
    path: 'ahorcado',
    loadComponent: () =>
      import('./pages/ahorcado/ahorcado').then(m => m.Ahorcado),
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: 'mayor-menor',
    loadComponent: () =>
      import('./pages/mayor-menor/mayor-menor').then(m => m.MayorMenor),
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat/chat').then(m => m.Chat),
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: 'preguntados',
    loadComponent: () =>
      import('./pages/preguntados/preguntados').then(m => m.Preguntados),
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: 'juego-propio',
    loadComponent: () =>
      import('./pages/juego-propio/juego-propio').then(m => m.JuegoPropio),
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: 'resultados',
    loadComponent: () =>
      import('./pages/resultados/resultados').then(m => m.Resultados),
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: 'encuesta',
    loadComponent: () =>
      import('./pages/encuesta/encuesta').then(m => m.Encuesta),
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: 'resultados-encuesta',
    loadComponent: () =>
      import('./pages/resultados-encuesta/resultados-encuesta')
        .then(m => m.ResultadosEncuesta),
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }

];