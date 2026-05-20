import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrls: ['./quien-soy.css']
})
export class QuienSoy {

  usuario:any;

  constructor(private http: HttpClient) {

    this.http
      .get('https://api.github.com/users/JulianGabilondo')
      .subscribe(data => {

        this.usuario = data;

      });

  }

}