import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

interface Carta {
  valor: number;
  texto: string;
  palo: string;
  display: string;
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mayor-menor.html',
  styleUrls: ['./mayor-menor.css']
})
export class MayorMenor implements OnInit {

  usuario: any = null;
  cargando = true;
  cartas: Carta[] = [];
  cartaActual: Carta | null = null;
  indiceActual = 0;
  aciertos = 0;
  cartasJugadas = 0;
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
    this.cartas = this.generarBaraja();
    this.cartas = this.cartas.sort(() => Math.random() - 0.5);
    this.indiceActual = 0;
    this.cartaActual = this.cartas[0] ?? null;
    this.aciertos = 0;
    this.cartasJugadas = 0;
    this.juegoTerminado = false;
    this.modalVisible = false;
    this.modalMensaje = '';
  }

  generarBaraja(): Carta[] {
    const palos = ['♠', '♥', '♦', '♣'];
    const cartas: Carta[] = [];

    for (const palo of palos) {
      for (let valor = 1; valor <= 13; valor++) {
        cartas.push({
          valor,
          texto: this.textoValor(valor),
          palo,
          display: `${this.textoValor(valor)} ${palo}`
        });
      }
    }

    return cartas;
  }

  textoValor(valor: number) {
    if (valor === 1) {
      return 'A';
    }
    if (valor === 11) {
      return 'J';
    }
    if (valor === 12) {
      return 'Q';
    }
    if (valor === 13) {
      return 'K';
    }
    return String(valor);
  }

  seleccionarOpcion(tipo: 'mayor' | 'menor') {
    if (this.juegoTerminado || !this.cartaActual) {
      return;
    }

    const siguienteIndice = this.indiceActual + 1;
    if (siguienteIndice >= this.cartas.length) {
      this.terminarJuego(true);
      return;
    }

    const siguienteCarta = this.cartas[siguienteIndice];
    const valorActual = this.cartaActual.valor;
    const valorSiguiente = siguienteCarta.valor;
    const acierto = tipo === 'mayor'
      ? valorSiguiente > valorActual
      : valorSiguiente < valorActual;

    this.cartasJugadas++;

    if (acierto) {
      this.aciertos++;
      this.indiceActual = siguienteIndice;
      this.cartaActual = siguienteCarta;
      if (this.indiceActual >= this.cartas.length - 1) {
        this.terminarJuego(true);
      }
      return;
    }

    this.terminarJuego(false, siguienteCarta);
  }

  async terminarJuego(gano: boolean, cartaSiguiente?: Carta) {
    this.juegoTerminado = true;
    this.modalVisible = true;

    if (gano) {
      this.modalMensaje = `¡Terminaste con ${this.aciertos} aciertos!`;
    } else {
      this.modalMensaje = `Fallaste después de ${this.aciertos} aciertos. Carta siguiente: ${cartaSiguiente?.display}`;
    }

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
      .from('mayor_menor')
      .insert({
        usuario_id: usuarioId,
        email,
        nombre,
        aciertos: this.aciertos,
        cartas_jugadas: this.cartasJugadas,
        terminado: new Date().toISOString(),
        resultado: gano ? 'victoria' : 'derrota'
      });
  }

  cerrarModal() {
    this.modalVisible = false;
  }

}
