import { Component, OnInit } from '@angular/core';

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
export class Registro implements OnInit {

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

  ngOnInit() {
    this.redireccionarSiLogueado();
  }

  async redireccionarSiLogueado() {
    const respuesta = await this.auth.usuarioActual();
    if (respuesta.data?.user) {
      this.router.navigate(['/home']);
    }
  }

  async registrarse() {

    if(!this.nombre || !this.apellido || !this.edad || this.edad <= 0 || !this.email || !this.password){
      this.modalMensaje = 'Por favor complete todos los campos.';
      return;
    }

    const respuesta = await this.auth.registrar(
      this.email,
      this.password
    );

    if(respuesta.error){
      this.modalMensaje = respuesta.error.message || 'Error al registrar el usuario.';
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
      this.modalMensaje = perfil.error.message || 'Error al guardar el perfil.';
      return;
    }

    const loginResp = await this.auth.login(this.email, this.password);

    if(loginResp.error){
      this.modalMensaje = loginResp.error.message || 'Error al iniciar sesión después del registro.';
      return;
    }

    this.router.navigate(['/home']);

  }

  cerrarModal(){
    this.modalMensaje = '';
  }

}