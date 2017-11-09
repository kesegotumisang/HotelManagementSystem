import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../auth/authService';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

import { AuthController } from '../../ducks/auth/auth.controller';
import { types } from '../../ducks/auth/auth.types';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
    private auth$: any = null;
    private returnUrl: string;
    private model: any = {
        username: '',
        password: ''
    };

    /**
     * [constructor description]
     * @method  constructor
     * @author jackfiallos
     * @version [version]
     * @date    2017-11-09
     * @param   {[type]} private [description]
     * @return  {[type]} [description]
     */
    constructor(private authenticationService: AuthService, private route: ActivatedRoute, private router: Router, private _auth: AuthController, private _store: Store<any>) {
        _store.select('auth').subscribe((response) => {
            this.auth$ = response;
        });
    }

    /**
     * [returnUrl description]
     * @type {[type]}
     */
    public ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    private login() {
        this._store.dispatch({
            type: types.LOGIN_REQUEST
        });

        this._auth.login({
            username: this.model.username,
            password: this.model.password
        }).subscribe((data: any) => {
            this.authenticationService.setToken(data.token);

            this._store.dispatch({
                type: types.LOGIN_SUCCESS,
                payload: data.token
            });

            this.router.navigate(['dashboard']);
        }, (error: any) => {
            this._store.dispatch({
                type: types.LOGIN_FAILURE,
                error: error.error
            });
        });
    }
}
