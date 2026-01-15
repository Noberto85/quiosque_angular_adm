import { Routes } from '@angular/router';
import { Garcom } from './garcom/garcom';
import { Mesa } from './mesa/mesa';
import { Produto } from './produto/produto';
import { Cardapio } from './cardapio/cardapio';
import { Categoria } from './categoria/categoria';

export default [
    { path: 'garcom', data: { breadcrumb: 'Garcom' }, component: Garcom },
    { path: 'mesa', data: { breadcrumb: 'Mesa' }, component: Mesa },
    { path: 'produto', data: { breadcrumb: 'Produto' }, component: Produto },
    { path: 'cardapio', data: { breadcrumb: 'Cardapio' }, component: Cardapio },
    { path: 'categoria', data: { breadcrumb: 'Categoria' }, component: Categoria },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
