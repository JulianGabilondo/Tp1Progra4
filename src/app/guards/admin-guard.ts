import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);

  const esAdmin =
    localStorage.getItem('admin');

  if(esAdmin === 'true'){
    return true;
  }

  router.navigate(['/home']);

  return false;
};