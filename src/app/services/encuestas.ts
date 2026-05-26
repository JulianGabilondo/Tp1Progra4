import { Injectable }
from '@angular/core';

import { createClient }
from '@supabase/supabase-js';

import { environment }
from '../../environments/environment';

const supabase = createClient(

  environment.supabaseUrl,

  environment.supabaseKey

);

@Injectable({
  providedIn: 'root'
})

export class EncuestasService {

  async guardarEncuesta(data:any){

    return await supabase

    .from('encuestas')

    .insert(data);
  }

  async obtenerEncuestas(){

    return await supabase

    .from('encuestas')

    .select('*');
  }

  async verificarEncuestaExistente(
    email:string
  ){

    return await supabase

    .from('encuestas')

    .select('*')

    .eq(
      'usuario_email',
      email
    );
  }
}