import {
  Component,
  OnInit,
  inject
}
from '@angular/core';

import { CommonModule }
from '@angular/common';

import { EncuestasService }
from '../../services/encuestas';

@Component({

  selector:
  'app-resultados-encuesta',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
  './resultados-encuesta.html',

  styleUrl:
  './resultados-encuesta.css'
})

export class ResultadosEncuesta
implements OnInit {

  encuestas:any[] = [];

  private encuestasService =
    inject(EncuestasService);

  async ngOnInit(){

    const {
      data,
      error
    } = await this
    .encuestasService
    .obtenerEncuestas();

    console.log(data);

    console.log(error);

    if(data){

      this.encuestas = data;
    }
  }
}