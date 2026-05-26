import { Component, inject }
from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
}
from '@angular/forms';

import { CommonModule }
from '@angular/common';

import { EncuestasService }
from '../../services/encuestas';

@Component({

  selector: 'app-encuesta',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './encuesta.html',

  styleUrl: './encuesta.css'
})

export class Encuesta {

  encuestaForm!: FormGroup;

  juegosSeleccionados:
  string[] = [];

  private fb =
    inject(FormBuilder);

  private encuestasService =
    inject(EncuestasService);

  usuarioActual:any;

  constructor(){

    const usuarioStorage =
    localStorage.getItem(
      'usuario'
    );

    if(usuarioStorage){

      this.usuarioActual =
      JSON.parse(
        usuarioStorage
      );
    }

    this.encuestaForm =
    this.fb.group({

      nombreApellido: [

        '',

        [
          Validators.required,

          Validators.minLength(3)
        ]
      ],

      edad: [

        '',

        [
          Validators.required,

          Validators.min(18),

          Validators.max(99)
        ]
      ],

      telefono: [

        '',

        [
          Validators.required,

          Validators.pattern(
            '^[0-9]+$'
          ),

          Validators.maxLength(10)
        ]
      ],

      experiencia: [

        '',

        Validators.required
      ],

      juegosFavoritos: [

        [],

        Validators.required
      ],

      puntuacionApp: [

        '',

        Validators.required
      ]
    });
  }

  checkboxChange(event:any){

    const juego =
      event.target.value;

    if(event.target.checked){

      this.juegosSeleccionados
      .push(juego);
    }
    else{

      this.juegosSeleccionados =
      this.juegosSeleccionados
      .filter(
        j => j !== juego
      );
    }

    this.encuestaForm.patchValue({

      juegosFavoritos:
      this.juegosSeleccionados

    });
  }

  async enviarEncuesta(){

    if(
      this.juegosSeleccionados
      .length === 0
    ){

      alert(
        'Debe seleccionar al menos un juego'
      );

      return;
    }

    if(this.encuestaForm.invalid){

      this.encuestaForm
      .markAllAsTouched();

      return;
    }

    const email =
    this.usuarioActual?.email;

    const encuestaExistente =
    await this
    .encuestasService
    .verificarEncuestaExistente(
      email
    );

    if(
      encuestaExistente.data
      &&
      encuestaExistente
      .data.length > 0
    ){

      alert(
        'Ya realizaste la encuesta'
      );

      return;
    }

    const encuesta = {

      nombre_apellido:
      this.encuestaForm.value
      .nombreApellido,

      edad:
      this.encuestaForm.value
      .edad,

      telefono:
      this.encuestaForm.value
      .telefono,

      experiencia:
      this.encuestaForm.value
      .experiencia,

      juegos_favoritos:
      this.encuestaForm.value
      .juegosFavoritos,

      puntuacion_app:
      this.encuestaForm.value
      .puntuacionApp,

      usuario_email:
      email
    };

    const response =
    await this
    .encuestasService
    .guardarEncuesta(
      encuesta
    );

    if(response.error){

      alert(
        'Error al guardar encuesta'
      );

      return;
    }

    alert(
      'Encuesta enviada correctamente'
    );

    this.encuestaForm.reset();

    this.juegosSeleccionados =
    [];
  }
}