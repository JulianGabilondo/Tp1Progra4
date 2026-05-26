import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-juego-propio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './juego-propio.html',
  styleUrls: ['./juego-propio.css']
})
export class JuegoPropio implements OnInit, OnDestroy {

  usuario: any = null;
  puntuacion = 0;
  tiempoInicio = 0;
  tiempoFin = 0;
  terminado = false;
  a = 0; b = 0; correcta = 0; opciones: number[] = [];
  // Temporizador por ronda
  timeLeft = 0; // segundos
  private timerId: any = null;
  private baseTime = 6; // segundos por ronda (se reducirá)
 
  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
 
  ngOnInit() {
    this.usuario = this.auth.authState.value ?? null;
    this.tiempoInicio = Date.now();
    this.iniciarRonda();
  }
 
  iniciarRonda() {
    // limpiar timer anterior
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    // reducir tiempo inicial a medida que aumenta el puntaje
    const reduccion = Math.floor(this.puntuacion / 20); // cada 20 puntos reduce 1s
    const inicial = Math.max(2, this.baseTime - reduccion);
    this.timeLeft = inicial;

    // iniciar countdown
    this.timerId = setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeLeft <= 0) {
        if (!this.terminado) {
          this.terminado = true;
          this.tiempoFin = Date.now();
          if (this.timerId) { clearInterval(this.timerId); this.timerId = null; }
          this.guardarResultado();
        }
      }
      this.cdr.detectChanges();
    }, 1000);

    this.a = Math.floor(Math.random() * 10) + 1;
    this.b = Math.floor(Math.random() * 10) + 1;
    this.correcta = this.a + this.b;
    this.opciones = [this.correcta, this.correcta + 1, this.correcta - 1, this.correcta + 2].sort(() => Math.random() - 0.5);
  }
 
  public responder(valor: number): void {
    if (this.terminado) return;
    if (valor === this.correcta) this.puntuacion += 10;
    else this.puntuacion = Math.max(0, this.puntuacion - 5);
    // Limite simple: 10 preguntas
    if (this.puntuacion >= 100 || this.puntuacion < 0) {
      this.terminado = true;
      this.tiempoFin = Date.now();
      if (this.timerId) { clearInterval(this.timerId); this.timerId = null; }
      this.guardarResultado();
      return;
    }
    // iniciar siguiente ronda (reiniciará timer)
    this.iniciarRonda();
  }
 
  async guardarResultado() {
    const datos = {
      usuario_id: this.usuario?.id ?? null,
      email: this.usuario?.email ?? this.usuario?.user?.email ?? null,
      nombre: this.usuario?.nombre ?? null,
      puntaje: this.puntuacion,
      tiempo: (this.tiempoFin - this.tiempoInicio) / 1000
    };
    try {
      await this.auth.guardarResultadoJuegoPropio(datos);
    } catch (e) {
      console.warn('No se pudo guardar resultado juego propio', e);
    }
  }

  get progressWidth(): number {
    const maxTime = this.baseTime > 1 ? this.baseTime : 1;
    return (this.timeLeft / maxTime) * 100;
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
 
 }
