import { Component } from '@angular/core';

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
export class Login {

  email = '';
  password = '';

  modalMensaje = '';

  constructor(
    private auth:AuthService,
    private router:Router
  ) {}

  async ingresar() {

    const respuesta = await this.auth.login(
      this.email,
      this.password
    );

    if(respuesta.error){
      this.modalMensaje = respuesta.error.message;
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