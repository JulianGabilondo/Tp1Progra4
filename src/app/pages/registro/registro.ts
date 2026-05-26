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
    const email = this.email.trim().toLowerCase();
    const password = this.password;

    if (!this.nombre || !this.apellido || !this.edad || this.edad <= 0 || !email || !password) {
      this.modalMensaje = 'Por favor complete todos los campos.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.modalMensaje = 'El correo electrónico no es válido.';
      return;
    }

    if (password.length < 6) {
      this.modalMensaje = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    console.log(email);

    const respuesta = await this.auth.registrar(
      email,
      password
    );

    if (respuesta.error) {
      this.modalMensaje = respuesta.error.message || 'Error al registrar el usuario.';
      return;
    }

    const usuario = respuesta.data?.user ?? null;
    if (!usuario?.id) {
      this.modalMensaje = 'No se pudo obtener el ID del usuario registrado.';
      return;
    }

    const perfil = await this.auth.supabase
      .from('usuarios')
      .insert({
        id: usuario.id,
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        email
      });

    if(perfil.error){
      this.modalMensaje = perfil.error.message || 'Error al guardar el perfil.';
      return;
    }

    const loginResp = await this.auth.login(email, password);

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