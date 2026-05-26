import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef  // Inyectar ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarResultados();
  }

  async cargarResultados() {
    this.cargando = true;
    this.errorMessage = null;

    try {
      console.log('🚀 Iniciando carga...');
      
      const [a, m, p, j] = await Promise.all([
        this.auth.obtenerResultadosAhorcado(),
        this.auth.obtenerResultadosMayorMenor(),
        this.auth.obtenerResultadosPreguntados(),
        this.auth.obtenerResultadosJuegoPropio()
      ]);

      console.log('📦 Respuesta Ahorcado:', a);
      console.log('📦 Respuesta MayorMenor:', m);
      console.log('📦 Respuesta Preguntados:', p);
      console.log('📦 Respuesta JuegoPropio:', j);

      // Asignar datos
      this.ahorcado = a?.data || [];
      this.mayorMenor = m?.data || [];
      this.preguntados = p?.data || [];
      this.juegoPropio = j?.data || [];

      console.log('✅ Datos asignados:');
      console.log('  Ahorcado:', this.ahorcado);
      console.log('  MayorMenor:', this.mayorMenor);
      console.log('  Preguntados:', this.preguntados);
      console.log('  JuegoPropio:', this.juegoPropio);
      console.log('  Longitudes:', {
        a: this.ahorcado.length,
        m: this.mayorMenor.length,
        p: this.preguntados.length,
        j: this.juegoPropio.length
      });

      // Forzar detección de cambios
      this.cdr.detectChanges();

    } catch (error) {
      console.error('❌ Error:', error);
      this.errorMessage = 'Error al cargar resultados.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges(); // Forzar otra vez después de cambiar cargando
    }
  }
}