import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  email = '';
  password = '';

  modalMensaje = '';

  constructor(
    private auth:AuthService,
    private router:Router
  ) {}

  ngOnInit() {
    this.redireccionarSiLogueado();
  }

  async redireccionarSiLogueado() {
    const respuesta = await this.auth.usuarioActual();
    if (respuesta.data?.user) {
      this.router.navigate(['/home']);
    }
  }

  async ingresar() {

    const respuesta = await this.auth.login(
      this.email,
      this.password
    );

    if(respuesta.error){
      this.modalMensaje = respuesta.error.message || 'Error al iniciar sesión.';
      return;
    }

    this.router.navigate(['/home']);

  }

  async accesoRapido(
    email:string,
    password:string
  ){

    this.email = email;
    this.password = password;
    await this.ingresar();

  }

  cerrarModal(){
    this.modalMensaje = '';
  }

}