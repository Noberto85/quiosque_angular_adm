import { Component, inject, OnInit } from '@angular/core';

import { DashboardService } from '@/service/dashboard.service';
import { TokenService } from '@/service/token.service';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { DashboardSystemModel, SystemService } from '@/service/system.service';
import { EstatisticasSystemComponent } from "./components/estatisticas-system";




@Component({
    selector: 'app-dashboard-adm',
    imports: [Toast, EstatisticasSystemComponent, EstatisticasSystemComponent],
    providers: [DashboardService],
    template: `
    <p-toast></p-toast>
        <div class="grid grid-cols-12 gap-8">
           <app-estatisticas-system [dashboardSystemModel]="dashboardSystemModel" 
            class="contents">
        </app-estatisticas-system>
        </div>
         <div class="grid grid-cols-12 gap-8 mt-8">
            <div class="col-span-12  xl:col-span-4">
               <!--  <app-recent-sales-widget [maisVendido]="dashboardModel.maisVendidos  ?? []" />  -->
            </div>
        </div>
    `
})
export class DashboardAdm implements OnInit {

    systemService = inject(SystemService);
    tokenService = inject(TokenService);
    messageService = inject(MessageService);
    dashboardSystemModel: DashboardSystemModel = {}

    ngOnInit() {
        this.systemService.load().subscribe({
            next: (data) => {
                this.dashboardSystemModel = data;
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.message });
            }
        });


    }
}
