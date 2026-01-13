import { Routes } from '@angular/router';
import { Garcom } from './garcom/garcom';
import { Mesa } from './mesa/mesa';


export default [
    { path: 'garcom', data: { breadcrumb: 'Garcom' }, component: Garcom },
    { path: 'mesa', data: { breadcrumb: 'Mesa' }, component: Mesa },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
