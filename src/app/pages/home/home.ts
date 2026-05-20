import { Component } from '@angular/core';

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
export class Home {

  usuario:any = null;

  constructor(
    private auth:AuthService
  ){

    this.obtenerUsuario();

  }

  async obtenerUsuario(){

    const perfil =
      await this.auth.obtenerPerfil();

    if(perfil.error){
      const respuesta = await this.auth.usuarioActual();
      this.usuario = respuesta.data?.user ?? null;
      return;
    }

    if(perfil.data){
      this.usuario = perfil.data;
      return;
    }

    const respuesta = await this.auth.usuarioActual();
    this.usuario = respuesta.data?.user ?? null;

  }

  async logout(){

    await this.auth.logout();

    this.usuario = null;

  }

}