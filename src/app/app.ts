import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  usuario:any = null;

  constructor(
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.authState.subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  async logout() {
    await this.auth.logout();
  }
}
