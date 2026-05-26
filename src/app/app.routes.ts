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

import { Preguntados } from './pages/preguntados/preguntados';
import { JuegoPropio } from './pages/juego-propio/juego-propio';
import { Resultados } from './pages/resultados/resultados';

import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

import { Encuesta } from './pages/encuesta/encuesta';
import { ResultadosEncuesta } from './pages/resultados-encuesta/resultados-encuesta';

import { adminGuard } from './guards/admin-guard';

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
    path: 'preguntados',
    component: Preguntados,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: 'juego-propio',
    component: JuegoPropio,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: 'resultados',
    component: Resultados,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
  path: 'encuesta',
  component: Encuesta,
  pathMatch: 'full',
  canActivate: [AuthGuard]
},

{
  path: 'resultados-encuesta',
  component: ResultadosEncuesta,
  pathMatch: 'full',
  canActivate: [AuthGuard]
},

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }

];