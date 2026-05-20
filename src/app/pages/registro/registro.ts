import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {

  nombre = '';
  apellido = '';
  edad = 0;

  email = '';
  password = '';

  modalMensaje = '';

  constructor(
    private auth:AuthService,
    private router:Router
  ) {}

  async registrarse() {

    if(!this.nombre || !this.apellido || !this.edad || !this.email || !this.password){
      this.modalMensaje = 'Por favor complete todos los campos.';
      return;
    }

    const respuesta = await this.auth.registrar(
      this.email,
      this.password
    );

    if(respuesta.error){
      this.modalMensaje = respuesta.error.message;
      return;
    }

    const perfil = await this.auth.supabase
      .from('usuarios')
      .insert({
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        email: this.email
      });

    if(perfil.error){
      this.modalMensaje = perfil.error.message;
      return;
    }

    const loginResp = await this.auth.login(this.email, this.password);

    if(loginResp.error){
      this.modalMensaje = loginResp.error.message;
      return;
    }

    this.router.navigate(['/home']);

  }

  cerrarModal(){
    this.modalMensaje = '';
  }

}