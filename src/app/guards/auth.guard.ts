import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    if (this.auth.authState.value) {
      return true;
    }

    const respuesta = await this.auth.usuarioActual();
    const error = 'error' in respuesta ? respuesta.error : null;

    if (error || !respuesta.data?.user) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
