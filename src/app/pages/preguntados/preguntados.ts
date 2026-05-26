import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './preguntados.html',
  styleUrls: ['./preguntados.css']
})
export class Preguntados implements OnInit {

  usuario: any = null;
  preguntas: any[] = [];
  cargando = true;
  index = 0;
  correctas = 0;
  terminado = false;
  errorMessage: string | null = null;

  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.usuario = this.auth.authState.value ?? null;
    await this.cargarPreguntas();
  }

  async cargarPreguntas() {
    this.cargando = true;
    this.errorMessage = null;
    this.preguntas = [];
    this.index = 0;
    this.terminado = false;
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=7&type=multiple');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      if (!json.results || !Array.isArray(json.results) || json.results.length === 0 || json.response_code !== 0) {
        throw new Error('No se obtuvieron preguntas');
      }
      this.preguntas = json.results.map((q: any) => {
        const opciones = [...q.incorrect_answers, q.correct_answer]
          .map((s: string) => ({ text: this.decodeHtml(s) }));
        opciones.sort(() => Math.random() - 0.5);
        return { pregunta: this.decodeHtml(q.question), opciones, correcta: this.decodeHtml(q.correct_answer) };
      });
    } catch (e) {
      console.error('Error cargando preguntas', e);
      this.errorMessage = 'No se pudieron cargar preguntas desde la API. Se cargan preguntas de ejemplo.';
      this.preguntas = [
        { pregunta: '¿Cuánto es 2 + 2?', opciones: [{ text:'3' }, { text:'4' }, { text:'5' }, { text:'6' }], correcta: '4' },
        { pregunta: '¿Cuánto es 5 - 3?', opciones: [{ text:'1' }, { text:'2' }, { text:'3' }, { text:'4' }], correcta: '2' },
        { pregunta: '¿Cuánto es 3 x 3?', opciones: [{ text:'6' }, { text:'9' }, { text:'12' }, { text:'3' }], correcta: '9' }
      ];
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  decodeHtml(input: string) {
    const txt = document.createElement('textarea');
    txt.innerHTML = input;
    return txt.value;
  }

  seleccionar(opcion: any) {
    if (this.terminado) return;
    const actual = this.preguntas[this.index];
    if (!actual) return;
    if (opcion.text === actual.correcta) {
      this.correctas++;
    }
    this.index++;
    if (this.index >= this.preguntas.length) {
      this.terminado = true;
      this.guardarResultado();
    }
  }

  async guardarResultado() {
    const datos = {
      usuario_id: this.usuario?.id ?? null,
      email: this.usuario?.email ?? this.usuario?.user?.email ?? null,
      nombre: this.usuario?.nombre ?? null,
      aciertos: this.correctas,
      total: this.preguntas.length
    };

    try {
      await this.auth.guardarResultadoPreguntados(datos);
    } catch (e) {
      console.warn('No se pudo guardar resultado preguntados', e);
    }
  }

  async reiniciar() {
    this.index = 0;
    this.correctas = 0;
    this.terminado = false;
    await this.cargarPreguntas();
  }

}
