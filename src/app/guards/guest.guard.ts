import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    if (this.auth.authState.value) {
      this.router.navigate(['/home']);
      return false;
    }

    const respuesta = await this.auth.usuarioActual();

    if (respuesta.data?.user) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
