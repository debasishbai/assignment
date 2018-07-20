import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DataService } from '../_services/data.service';
import { Router } from '@angular/router';
import { MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  signupForm: FormGroup;
  loginErrorMessage: any;
  signupErrorMessage: any;
  showSignupError: boolean = false;
  showLoginError: boolean = false;
  genders: any = [
    {'value': 'male', 'viewValue': 'Male'},
    {'value': 'female', 'viewValue': 'Female'},
    {'value': 'others', 'viewValue': 'Others'}
  ];
  passwordRegex = /^(?=.*[\w]).{5,20}$/;


  constructor(
    private _form: FormBuilder,
    private dataService: DataService,
    public router:  Router,
    public snackBar: SnackBarComponent,
    public appComponent: AppComponent
  ) {

    this.loginForm = this._form.group({
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', Validators.compose([Validators.required, Validators.pattern(this.passwordRegex)])]
    });

    this.signupForm = this._form.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'gender': ['', Validators.required],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', Validators.compose([Validators.required, Validators.pattern(this.passwordRegex)])]
    });
  }


  ngOnInit() {
    if (this.dataService.getCredentials() !== '') {
      this.router.navigate(['dashboard']);
    }
  }


  login(data) {
    /**
     * Logs in a registered user
     * @param data Login credentials
     */
    this.appComponent.showBar = true;
    this.dataService.loginService(data)
    .subscribe(response => {
      this.showLoginError = false;
      this.router.navigate(['dashboard']);
      this.appComponent.showBar = false;
    }, error => {
      this.showLoginError = true;
      this.loginErrorMessage = error.error['message'];
      this.appComponent.showBar = false;
    });
  }


  signup(data) {
    /**
     * Method to register a new user
     * Log in the user after successful registration
     */
    this.appComponent.showBar = true;
    this.dataService.signupService(data)
    .subscribe(response => {
      this.snackBar.snackBarDialog('Welcome ' + data['first_name']);
      this.showSignupError = false;
      const loginData = {};
      loginData['email'] = data.email;
      loginData['password'] = data.password;
      this.login(loginData);
    }, error => {
      this.showSignupError = true;
      this.signupErrorMessage = error.error['message'];
      this.appComponent.showBar = false;
    });
  }

}
