import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

interface Mensaje {
  id: number;
  usuario: string;
  mensaje: string;
  fecha: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat implements OnInit {

  usuario: any = null;
  cargando = true;
  mensajes: Mensaje[] = [];
  nuevoMensaje = '';
  modalVisible = false;
  modalMensaje = '';

  constructor(
    private auth: AuthService
  ) {
    this.cargarMensajes();
    this.suscribirseMensajes();
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

  async cargarMensajes() {
    const respuesta = await this.auth.obtenerMensajes();

    if (!respuesta.error) {
      this.mensajes = (respuesta.data as any) ?? [];
    }
  }

  async enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.usuario) {
      return;
    }

    const texto = this.nuevoMensaje.trim();
    const respuesta = await this.auth.enviarMensaje(texto, this.usuario);

    if (respuesta.error) {
      this.modalMensaje = respuesta.error.message;
      this.modalVisible = true;
      return;
    }

    // Si la inserción devolvió la fila insertada, añádela localmente
    const fila: Mensaje | null = (respuesta.data as any)?.[0] ?? null;
    if (fila) {
      const existe = this.mensajes.some((item: Mensaje) => item.id === fila.id);
      if (!existe) {
        this.mensajes = [...this.mensajes, fila];
      }
    }

    this.nuevoMensaje = '';
  }

  suscribirseMensajes() {
    console.log('[Chat] Inicializando suscripción a mensajes realtime');
    this.auth.suscribirseMensajes((nuevoMensaje: Mensaje) => {
      console.log('[Chat] Realtime callback recibido:', nuevoMensaje);
      if (!nuevoMensaje) {
        return;
      }
      const existe = this.mensajes.some((item: Mensaje) => item.id === nuevoMensaje.id);
      if (!existe) {
        this.mensajes = [...this.mensajes, nuevoMensaje];
      }
    });
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  esPropio(mensaje: any) {
    const usuarioActual = this.usuario?.nombre ?? this.usuario?.email ?? this.usuario?.user?.email ?? '';
    return mensaje.usuario === usuarioActual;
  }

  formatoHora(fecha: string) {
    return new Date(fecha).toLocaleString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

}
