import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { PedidoModel } from '@/model/pedido.model';
import { PedidoService } from '@/service/pedido.service';
import { TokenService } from '@/service/token.service';
import { LoadingService } from '@/shared/services/loading.service';
import { ParamsRequest } from '@/shared/utils/pageable.utils';
import { PhonePipe } from '@/shared/pipes/phone.pipe';
import { Paginator } from "primeng/paginator";

@Component({
    selector: 'app-pedidos',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ToastModule,
    PanelModule,
    IconFieldModule,
    InputIconModule,
    RippleModule,
    PhonePipe,
    Paginator
],
    providers: [MessageService, PedidoService],
    templateUrl: './pedidos.html'
})
export class Pedidos implements OnInit {
    loadingService = inject(LoadingService);
    tokenService = inject(TokenService);
    pedidoService = inject(PedidoService);
    messageService = inject(MessageService);

    pedidos = signal<PedidoModel[]>([]);
    totalRecords: number = 0;
    loading = signal<boolean>(false);

    @ViewChild('dt') dt!: Table;

    first: number = 0;
    rows: number = 10;
    page: number = 0;
    pageSize: number = 10;

    ngOnInit() {
        this.loadData();
    }

    loadData(params?: ParamsRequest) {
        this.loading.set(true);
        const claim = this.tokenService.getClaim();
        debugger
        this.pedidoService.findAllPageable(params, claim.quiosque_id).subscribe({
            
            next: (data) => {
                
                this.pedidos.set(data.content);
                this.totalRecords = data.totalElements;
                this.loading.set(false);
            },
            error: (err) => {
                this.loading.set(false);
                console.error(err);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pedidos' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onPageChange(event: any) {
        const params: ParamsRequest = {
            page: event.first / event.rows,
            size: event.rows,
            orderBy: event.sortField,
            direction: event.sortOrder === 1 ? 'ASC' : 'DESC'
        };
        this.loadData(params);
    }

    getSeverity(status: string) {
        debugger
        switch (status) {
            case 'completed':
                return 'success';
            case 'preparing':
                return 'info';
            case 'cancelled':
                return 'danger';
            default:
                return 'warning';
        }
    }

    updateStatus(pedido: PedidoModel, status: 'completed' | 'preparing' | 'cancelled') {
        if (!pedido.id) return;

    }

    returnStatus(status: string) {
        switch (status) {
            case 'completed':
                return 'Concluído';
            case 'preparing':
                return 'Preparando';
            case 'cancelled':
                return 'Cancelado';
            default:
                return 'Aguardando Pagamento';
        }
    }
    
}
