import { Routes } from '@angular/router';
import { BillUploadComponent } from '../components/bill-upload.component/bill-upload.component';
import { BillDashboardComponent } from '../components/bill-dashboard.component/bill-dashboard.component';
import { LoginComponent } from '../components/login-component/login-component';
import { authGuard } from './auth.guard';
import { AskAnythingComponent } from '../components/ask-anything-component/ask-anything-component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'upload', component: BillUploadComponent, canActivate: [authGuard] },
    { path: 'dashboard', component: BillDashboardComponent, canActivate: [authGuard] },
    { path: 'ask', component: AskAnythingComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];