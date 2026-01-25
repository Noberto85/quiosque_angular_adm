import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardModel } from '@/service/dashboard.service';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `

    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
    <div class="card mb-0">
        <div class="flex justify-between mb-4">
            <div>
                <span class="block text-muted-color font-medium mb-4">Pedidos</span>
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardModel.qtdUltimodPedido
                    }} novos Pedidos.</div>
            </div>
            <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
                style="width: 2.5rem; height: 2.5rem">
                <i class="pi pi-shopping-cart text-blue-500 text-xl!"></i>
            </div>
        </div>
        <span class="text-primary font-medium">em 24 horas </span>
    
    </div>
</div>

<div class="col-span-12 lg:col-span-6 xl:col-span-3">
    <div class="card mb-0">
        <div class="flex justify-between mb-4">
            <div>
                <span class="block text-muted-color font-medium mb-4">Receita do Dia</span>
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardModel.receitaDoDia |
                    currency:'BRL' }}</div>
            </div>
            <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border"
                style="width: 2.5rem; height: 2.5rem">
                <i class="pi pi-dollar text-orange-500 text-xl!"></i>
            </div>
        </div>
    </div>
</div>
<div class="col-span-12 lg:col-span-6 xl:col-span-3">
    <div class="card mb-0">
        <div class="flex justify-between mb-4">
            <div>
                <span class="block text-muted-color font-medium mb-4">Receita do Mês</span>
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ dashboardModel.receitaDoMes |
                    currency:'BRL' }}</div>
            </div>
            <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border"
                style="width: 2.5rem; height: 2.5rem">
                <i class="pi pi-dollar text-orange-500 text-xl!"></i>
            </div>
        </div>
    </div>
</div>
<div class="col-span-12 lg:col-span-6 xl:col-span-3">
    <div class="card mb-0">
        <div class="flex justify-between mb-4">
            <div>
                <span class="block text-muted-color font-medium mb-4">Novos Clientes</span>
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{
                    dashboardModel.qtdUltimosClientes }} novos Clientes.</div>
                     <span class="text-primary font-medium">no Mês</span>
            </div>
            <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
                style="width: 2.5rem; height: 2.5rem">
                <i class="pi pi-users text-cyan-500 text-xl!"></i>
                
            </div>
        </div>
    </div>
</div>
    `
})
export class StatsWidget {
    @Input() dashboardModel: DashboardModel = {};
}
