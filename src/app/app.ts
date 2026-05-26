import {

  Component,
  OnInit

}
from '@angular/core';

import {
  CommonModule
}
from '@angular/common';

import {

  RouterOutlet,
  RouterLink

}
from '@angular/router';

import {
  AuthService
}
from './services/auth';

import {

  trigger,
  transition,
  style,
  animate,
  query,
  group

}
from '@angular/animations';

@Component({

  selector: 'app-root',

  standalone: true,

  imports: [

    CommonModule,

    RouterOutlet,

    RouterLink

  ],

  templateUrl: './app.html',

  styleUrls: ['./app.css'],

  animations: [

    trigger(

      'routeAnimations',

      [

        transition(

          '* <=> *',

          [

            style({

              position: 'relative'

            }),

            query(

              ':enter, :leave',

              [

                style({

                  position: 'absolute',

                  width: '100%'

                })

              ],

              {
                optional: true
              }

            ),

            query(

              ':enter',

              [

                style({

                  opacity: 0,

                  transform:
                  'translateY(20px)'

                })

              ],

              {
                optional: true
              }

            ),

            group([

              query(

                ':leave',

                [

                  animate(

                    '300ms ease',

                    style({

                      opacity: 0,

                      transform:
                      'translateY(-20px)'

                    })

                  )

                ],

                {
                  optional: true
                }

              ),

              query(

                ':enter',

                [

                  animate(

                    '300ms ease',

                    style({

                      opacity: 1,

                      transform:
                      'translateY(0)'

                    })

                  )

                ],

                {
                  optional: true
                }

              )

            ])

          ]

        )

      ]

    )

  ]

})

export class App
implements OnInit {

  usuario:any = null;

  constructor(

    private auth:
    AuthService

  ) {}

  ngOnInit(){

    this.auth.authState
    .subscribe(usuario => {

      this.usuario =
      usuario;

    });
  }

  async logout(){

    await this.auth.logout();
  }

  prepareRoute(outlet:any){

    return outlet
    ?.activatedRouteData;
  }
}