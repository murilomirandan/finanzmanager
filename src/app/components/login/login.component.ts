import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import * as OktaSignIn from '@okta/okta-signin-widget';

import AppConfig from '../../config/app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  oktaSignin: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuthService: OktaAuth) {
    this.oktaSignin = new OktaSignIn({
      features:{
        registration: true
      },
      baseUrl: AppConfig.oidc.issuer.split('/oauth2')[0],
        clientId: AppConfig.oidc.clientId,
        redirectUri: AppConfig.oidc.redirectUri,
        authParams: {
          pkce: true,
          issuer: AppConfig.oidc.issuer,
          scopes: AppConfig.oidc.scopes
        }
    });
   }

  ngOnInit(): void {
    this.oktaSignin.remove();

    this.oktaSignin.renderEl({
      // this name should be same as div tag id in login.component.html
      el: '#okta-sign-in-widget'},
      (response: {status: string; }) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuthService.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }

}
