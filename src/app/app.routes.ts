import { Routes } from '@angular/router';

import { Home }
from './pages/home/home';

import { Login }
from './pages/login/login';

import { Registro }
from './pages/registro/registro';

import { QuienSoy }
from './pages/quien-soy/quien-soy';

import { Ahorcado }
from './pages/ahorcado/ahorcado';

import { MayorMenor }
from './pages/mayor-menor/mayor-menor';

import { Chat }
from './pages/chat/chat';

import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: Home,
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login,
    pathMatch: 'full',
    canActivate: [GuestGuard]
  },

  {
    path: 'registro',
    component: Registro,
    pathMatch: 'full',
    canActivate: [GuestGuard]
  },

  {
    path: 'quien-soy',
    component: QuienSoy,
    pathMatch: 'full'
  },

  {
    path: 'ahorcado',
    component: Ahorcado,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: 'mayor-menor',
    component: MayorMenor,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: 'chat',
    component: Chat,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }

];