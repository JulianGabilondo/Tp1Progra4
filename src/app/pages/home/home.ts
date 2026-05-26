import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  usuario:any = null;
  cargando = true;

  constructor(
    private auth:AuthService
  ){}

  ngOnInit() {
    this.obtenerUsuario();
  }

  async obtenerUsuario(){

    this.usuario = this.auth.authState.value ?? null;

    if (this.usuario) {
      this.cargando = false;
      return;
    }

    const perfil = await this.auth.obtenerPerfil();

    if (perfil.data) {
      this.usuario = perfil.data;
      this.cargando = false;
      return;
    }

    const respuesta = await this.auth.usuarioActual();
    this.usuario = respuesta.data?.user ?? null;
    this.cargando = false;

  }

  async logout(){

    await this.auth.logout();

    this.usuario = null;

  }

}