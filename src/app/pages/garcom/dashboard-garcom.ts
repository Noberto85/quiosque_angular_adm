import { Component, inject, OnInit } from '@angular/core';

import { DashboardService } from '@/service/dashboard.service';
import { TokenService } from '@/service/token.service';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { DashboardSystemModel } from '@/service/system.service';
import { PedidosGarcomComponent } from './components/pedidos-garcom';
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { Panel } from "primeng/panel";
import { Avatar } from "primeng/avatar";





@Component({
    selector: 'app-pedidos-garcom-dashboard',
    imports: [Toast, PedidosGarcomComponent, ToolbarModule, ButtonModule, Panel, Avatar],
    providers: [DashboardService],
    template: `
    <p-toast></p-toast>
    <p-panel styleClass="mb-6">
        <ng-template #header>
            <div class="flex items-center gap-2">
                <p-avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                <span class="text-2xl font-bold">Pedidos</span>
            </div>
        </ng-template>
    </p-panel>
    <p-toolbar styleClass="mb-6">
    <ng-template #start>
        <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2"  />
    </ng-template>
</p-toolbar>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
           <app-pedidos-garcom [dashboardSystemModel]="dashboardSystemModel" 
             class="contents">
        </app-pedidos-garcom>
        </div> 
    `
})
export class DashboardGarcom implements OnInit {
    tokenService = inject(TokenService);
    messageService = inject(MessageService);
    dashboardSystemModel: DashboardSystemModel = {}

    ngOnInit() { }
}
