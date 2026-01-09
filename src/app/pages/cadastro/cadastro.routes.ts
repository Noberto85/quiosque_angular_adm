import { Routes } from '@angular/router';
import { Garcom } from './garcom/garcom';


export default [
    { path: 'garcom', data: { breadcrumb: 'Garcom' }, component: Garcom },   
    { path: '**', redirectTo: '/notfound' }
] as Routes;
