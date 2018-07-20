import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { tokenName } from '@angular/compiler';


@Injectable()
export class DataService {
    constructor(private http: HttpClient, private router: Router) { }

    loginService(data) {
        return this.http.post('/api/login/', data)
        .map(response => {
            const user: any = response;
            if (user && user.hasOwnProperty('email') && user.hasOwnProperty('token')) {
                // store user details and token in Cookies to keep user logged in between page refreshes
                console.log('Credentials: ', user);
                this.setCredentials(user.email, user.token, user.first_name);
            }
            return response;
        });
    }


    logout() {
        // remove user from cookies to log user out
        return this.http.post('/api/logout/', '')
        .map((response) => {
        this.removeCredentials('userData');
        this.router.navigate(['login']);
        });
    }


    signupService(data) {
        return this.http.post('/api/signup/', data)
        .map(response => {
            return response;
        });
    }


    contentService(method, data?: any) {
        switch (method) {
            case 'GET': {
                return this.http.get('/api/content/', {headers: this.setTokenHeader()})
                .map(response => {
                    return response;
                });
            }
            case 'POST': {
                return this.http.post('/api/content/', data, {headers: this.setTokenHeader()})
                .map(response => {
                    return response;
                });
            }
            case 'PATCH': {
                const id = data['id'];
                delete data['id'];
                return this.http.patch('/api/content/' + id + '/', data, {headers: this.setTokenHeader()})
                .map(response => {
                    return response;
                });
            }
            case 'OPTIONS': {
                return this.http.options('/api/content/', {headers: this.setTokenHeader()})
                .map(response => {
                    return response;
                });
            }
            case 'DELETE': {
                return this.http.delete('/api/content/' + data + '/', {headers: this.setTokenHeader()})
                .map(response => {
                    return response;
                });

            }
        }
    }


    setCredentials(email, token, firstName, path: string = '/') {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        const name = 'userData';
        const expires = `expires=${expirationDate.toUTCString()}`;
        const cpath: string = path ? `; path=${path}` : '/';
        const userData = {
            email: email,
            token: token,
            name: firstName
        };
        const cookieData = encodeURIComponent(JSON.stringify(userData));
        document.cookie = `${name}=${cookieData}; ${expires}${cpath}`;
    }


    removeCredentials(name: string = 'userData') {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }


    getCredentials(name: string = 'userData') {
        const ca: Array<string> = document.cookie.split(';');
        const caLen: number = ca.length;
        const cookieName = `${name}=`;
        let c: string;

        for (let i = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) === 0) {
                return decodeURIComponent(c.substring(cookieName.length, c.length));
            }
        }
        return '';
    }


    setTokenHeader() {
        const tokenNumber = JSON.parse(this.getCredentials());
        if (tokenNumber !== '') {
            return new HttpHeaders().set('Authorization', 'Token ' + tokenNumber['token']);
        } else {
            return new HttpHeaders();
        }
    }

}
