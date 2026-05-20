import { Routes } from '@angular/router';

import { Home }
from './pages/home/home';

import { Login }
from './pages/login/login';

import { Registro }
from './pages/registro/registro';

import { QuienSoy }
from './pages/quien-soy/quien-soy';

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
    pathMatch: 'full'
  },

  {
    path: 'registro',
    component: Registro,
    pathMatch: 'full'
  },

  {
    path: 'quien-soy',
    component: QuienSoy,
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }

];