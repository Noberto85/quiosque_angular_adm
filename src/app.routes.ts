import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { adminGuard } from '@/guards/admin.guard';
import { systemGuard } from '@/guards/system.guard';
import { DashboardAdm } from '@/pages/system/dasboard-system/dashboard';


export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            
            { path: '', component: Dashboard, canActivate: [adminGuard] },
            { path: 'cadastro',loadChildren: () => import('./app/pages/cadastro/cadastro.routes') },
            { path: 'pedidos', loadChildren: () => import('./app/pages/pedidos/pedidos.routes') },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            
        ]
    },
     { path: 'system', component: AppLayout , children: [
        { path: '', component: DashboardAdm, canActivate: [systemGuard] },
     ]},
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
