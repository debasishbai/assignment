import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_services/auth.guard';

export const router: Routes = [

    { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent},
    { path: '**', redirectTo: '/login' },

];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
