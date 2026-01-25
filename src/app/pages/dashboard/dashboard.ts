import { Component, inject, OnInit } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { DashboardModel, DashboardService, MaisVendidoModel } from '@/service/dashboard.service';
import { TokenService } from '@/service/token.service';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget, Toast],
    providers: [DashboardService],
    template: `
    <p-toast></p-toast>
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget [dashboardModel]="dashboardModel" class="contents" />
        </div>
         <div class="grid grid-cols-12 gap-8 mt-8">
            <div class="col-span-12  xl:col-span-6">
                <app-recent-sales-widget [maisVendido]="dashboardModel.maisVendidos  ?? []" /> 
            <!--     <app-best-selling-widget /> -->
            </div>
            <!-- <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div> -->
        </div>
    `
})
export class Dashboard implements OnInit {
    dashboardModel: DashboardModel = {
        maisVendidos: [] as MaisVendidoModel[]
    }
    dashboardService = inject(DashboardService);
    tokenService = inject(TokenService);
    messageService = inject(MessageService);


    ngOnInit() {

        this.dashboardService.load(this.tokenService.getClaim().quiosque_id).subscribe({
            next: (model) => {
                this.dashboardModel = model;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar dashboard' });
            }
        });
    }
}
