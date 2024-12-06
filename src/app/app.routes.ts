import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { DetailsComponent } from './Components/details/details.component';
import { PaymentsComponent } from './Components/payments/payments.component';
import { ErrorComponent } from './Components/error/error.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'details', component: DetailsComponent },
    { path: 'payment', component: PaymentsComponent },
    { path: '**', component:ErrorComponent }  
];
