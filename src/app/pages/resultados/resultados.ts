import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html'
})
export class Resultados implements OnInit {

  ahorcado: any[] = [];
  mayorMenor: any[] = [];
  preguntados: any[] = [];
  juegoPropio: any[] = [];

  cargando = true;
  errorMessage: string | null = null;

  constructor(private auth: AuthService) {}

  async ngOnInit() {
    this.cargando = true;
    this.errorMessage = null;

    try {
      const [a, m, p, j] = await Promise.all([
        this.auth.obtenerResultadosAhorcado(),
        this.auth.obtenerResultadosMayorMenor(),
        this.auth.obtenerResultadosPreguntados(),
        this.auth.obtenerResultadosJuegoPropio()
      ]);

      this.ahorcado = a.data ?? [];
      this.mayorMenor = m.data ?? [];
      this.preguntados = p.data ?? [];
      this.juegoPropio = j.data ?? [];

      if (a.error || m.error || p.error || j.error) {
        throw new Error('Error al obtener algunos resultados.');
      }
    } catch (error) {
      console.error('Error cargando resultados:', error);
      this.errorMessage = 'No se pudieron cargar los resultados. Intenta recargar la página.';
      this.ahorcado = this.ahorcado ?? [];
      this.mayorMenor = this.mayorMenor ?? [];
      this.preguntados = this.preguntados ?? [];
      this.juegoPropio = this.juegoPropio ?? [];
    } finally {
      this.cargando = false;
    }
  }

}
