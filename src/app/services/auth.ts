import { Injectable } from '@angular/core';

import { createClient } from '@supabase/supabase-js';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  supabase = createClient(

    environment.supabaseUrl,

    environment.supabaseKey

  );

  async registrar(
    email:string,
    password:string
  ){

    return await this.supabase.auth.signUp({

      email,
      password

    });

  }

  async login(
    email:string,
    password:string
  ){

    return await this.supabase.auth.signInWithPassword({

      email,
      password

    });

  }

  async logout(){

    return await this.supabase.auth.signOut();

  }

  async usuarioActual(){

    return await this.supabase.auth.getUser();

  }

  async obtenerPerfil(){

    const respuesta = await this.supabase.auth.getUser();

    if(respuesta.error || !respuesta.data.user){
      return { data: null, error: respuesta.error };
    }

    return await this.supabase
      .from('usuarios')
      .select('*')
      .eq('email', respuesta.data.user.email)
      .single();

  }

}