import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { createClient } from '@supabase/supabase-js';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState = new BehaviorSubject<any>(null);
  // Subject interno para emitir mensajes realtime a los componentes
  private mensajes$ = new Subject<any>();
  private mensajesChannel: any = null;

  supabase = createClient(

    environment.supabaseUrl,

    environment.supabaseKey,

    {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    }

  );

  constructor() {
    this.initAuthState();
  }

  private async initAuthState() {
    const sessionRespuesta = await this.supabase.auth.getSession();
    const usuario = sessionRespuesta.data?.session?.user ?? null;

    if (usuario) {
      this.authState.next(usuario);
    } else {
      const respuesta = await this.supabase.auth.getUser();
      this.authState.next(respuesta.data?.user ?? null);
    }

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.authState.next(session?.user ?? null);
    });
  }

  async registrar(
    email:string,
    password:string
  ){

    const respuesta = await this.supabase.auth.signUp({
      email,
      password
    });

    if (respuesta.data?.user) {
      this.authState.next(respuesta.data.user);
    }

    return respuesta;
  }

  async login(
    email:string,
    password:string
  ){

    const respuesta = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (respuesta.data?.user) {
      this.authState.next(respuesta.data.user);
    }

    return respuesta;
  }

  async logout(){
    const respuesta = await this.supabase.auth.signOut();
    this.authState.next(null);
    return respuesta;
  }

  async usuarioActual(){
    const sessionRespuesta = await this.supabase.auth.getSession();

    if (sessionRespuesta.error) {
      return await this.supabase.auth.getUser();
    }

    if (sessionRespuesta.data?.session?.user) {
      return {
        data: {
          user: sessionRespuesta.data.session.user
        }
      };
    }

    return await this.supabase.auth.getUser();
  }

  async obtenerPerfil(){
    const respuesta = await this.usuarioActual();
    const usuario = respuesta.data?.user ?? null;
    const error = 'error' in respuesta ? respuesta.error : null;

    if (!usuario) {
      return { data: null, error };
    }

    return await this.supabase
      .from('usuarios')
      .select('*')
      .eq('email', usuario.email)
      .single();

  }

  async guardarResultadoAhorcado(datos: any) {
    return await this.supabase
      .from('ahorcado')
      .insert(datos);
  }

  async guardarResultadoMayorMenor(datos: any) {
    return await this.supabase
      .from('mayor_menor')
      .insert(datos);
  }

  async obtenerMensajes() {
    return await this.supabase
      .from('mensajes')
      .select('*')
      .order('fecha', { ascending: true });
  }

  async enviarMensaje(texto: string, usuario: any) {
    if (!usuario) {
      return { error: { message: 'Usuario no autenticado.' } };
    }

    const usuarioNombre = usuario?.nombre ?? usuario?.email ?? usuario?.user?.email ?? 'Anónimo';

    return await this.supabase
      .from('mensajes')
      .insert({
        usuario: usuarioNombre,
        mensaje: texto
      })
      .then(async (res) => {
        // Si la inserción fue exitosa, intentar enviar un broadcast para asegurar
        // que otros clientes vean el mensaje en tiempo real aunque Realtime DB no esté replicando.
        try {
          const fila = (res.data as any)?.[0] ?? null;
          if (fila) {
            const ch = this.supabase.channel('public:mensajes');
            // enviar broadcast 'new-message' con la fila
            await ch.send({ type: 'broadcast', event: 'new-message', payload: fila });
          }
        } catch (e) {
          console.warn('No se pudo enviar broadcast del mensaje:', e);
        }
        return res;
      });
  }

  suscribirseMensajes(callback: any) {
    try {
      // Si no existe canal, crearlo y suscribir handlers (solo una vez)
      if (!this.mensajesChannel) {
        this.mensajesChannel = this.supabase
          .channel('public:mensajes')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, payload => {
            console.log('[Supabase] Realtime payload mensajes (postgres_changes):', payload);
            if (payload?.new) {
              this.mensajes$.next(payload.new);
            }
          })
          .on('broadcast', { event: 'new-message' }, payload => {
            console.log('[Supabase] Realtime payload mensajes (broadcast):', payload);
            const data = (payload as any)?.payload ?? payload;
            if (data) {
              this.mensajes$.next(data);
            }
          });

        // Suscribirse al canal (solo una vez)
        this.mensajesChannel.subscribe()
          .then((sub: any) => console.log('[Supabase] suscrito a mensajes:', sub))
          .catch((err: any) => console.error('Error suscribiendo canal mensajes:', err));
      }

      // Devolvemos una suscripción al Subject para que el componente se desuscriba cuando quiera
      const subscription = this.mensajes$.subscribe(callback);
      return subscription;
    } catch (error) {
      console.error('Error al suscribirse a mensajes:', error);
      return null;
    }
  }

}