import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ahorcado.html',
  styleUrls: ['./ahorcado.css']
})
export class Ahorcado implements OnInit {

  usuario: any = null;
  cargando = true;

  palabras = [
    'PROGRAMACION',
    'JUEGOS',
    'AHORCADO',
    'MAYOR',
    'MENOR',
    'CARTAS',
    'CHAT',
    'ANGULAR',
    'SUPABASE',
    'USUARIO'
  ];

  palabra = '';
  palabraOculta: string[] = [];
  letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  seleccionadas: string[] = [];
  errores = 0;
  maxErrores = 7;
  letrasSeleccionadas = 0;
  juegoTerminado = false;
  modalVisible = false;
  modalMensaje = '';

  constructor(
    private auth: AuthService
  ) {
    this.iniciarJuego();
  }

  ngOnInit() {
    this.obtenerUsuario();
  }

  async obtenerUsuario() {
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

  iniciarJuego() {
    this.errores = 0;
    this.seleccionadas = [];
    this.letrasSeleccionadas = 0;
    this.juegoTerminado = false;
    this.modalVisible = false;
    this.modalMensaje = '';
    this.palabra = this.palabras[
      Math.floor(Math.random() * this.palabras.length)
    ];
    this.palabraOculta = this.palabra.split('').map(letra => letra === ' ' ? ' ' : '_');
  }

  seleccionarLetra(letra: string) {
    if (this.juegoTerminado || this.seleccionadas.includes(letra)) {
      return;
    }

    this.seleccionadas.push(letra);
    this.letrasSeleccionadas++;

    if (this.palabra.includes(letra)) {
      this.palabraOculta = this.palabraOculta.map((item, index) => {
        return this.palabra[index] === letra ? letra : item;
      });
    } else {
      this.errores++;
    }

    if (!this.palabraOculta.includes('_')) {
      this.terminarJuego(true);
      return;
    }

    if (this.errores >= this.maxErrores) {
      this.terminarJuego(false);
    }
  }

  get estadoPalabra() {
    return this.palabraOculta.join(' ');
  }

  async terminarJuego(gano: boolean) {
    this.juegoTerminado = true;
    this.modalVisible = true;
    this.modalMensaje = gano
      ? `¡Ganaste! La palabra era "${this.palabra}".`
      : `Perdiste. La palabra era "${this.palabra}".`;

    await this.guardarResultado(gano);
  }

  async guardarResultado(gano: boolean) {
    if (!this.usuario) {
      return;
    }

    const usuarioId = this.usuario?.id ?? this.usuario?.user?.id ?? null;
    const email = this.usuario?.email ?? this.usuario?.user?.email ?? null;
    const nombre = this.usuario?.nombre ?? this.usuario?.user?.email ?? email;

    await this.auth.supabase
      .from('ahorcado')
      .insert({
        usuario_id: usuarioId,
        email,
        nombre,
        resultado: gano ? 'ganado' : 'perdido',
        tiempo_fin: new Date().toISOString(),
        letras_seleccionadas: this.letrasSeleccionadas,
        errores: this.errores,
        palabra: this.palabra
      });
  }

  cerrarModal() {
    this.modalVisible = false;
  }

}
