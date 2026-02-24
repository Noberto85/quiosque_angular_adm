import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSystemModel } from '@/service/system.service';
import { TableModule } from "primeng/table";
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import { PedidoModel } from '@/model/pedido.model';
import { Tag } from "primeng/tag";
import { Divider } from "primeng/divider";


@Component({
    standalone: true,
    selector: 'app-pedidos-garcom',
    imports: [CommonModule, TableModule, Button, Card, Tag, Divider],
    template: `

    @for (pedido of pedidoModel; track pedido.id) {
        
       <div class="col-span-1">
            <p-card [style]="{ width: '100%', overflow: 'hidden' }">
                <ng-template #title>
                   <div class="flex justify-between items-center">
                        <div>
                            <span class="font-bold text-lg">Ped: #{{ pedido.codigo }}</span>
                        </div>
                        <div>
                            <span class="font-bold text-lg"> <p-tag [value]="getSeverity(pedido.status)" [severity]="getSeverity(pedido.status)" /></span>
                        </div>
                   </div>
            </ng-template>
                <ng-template #subtitle>Cl: #{{ pedido.cliente }} </ng-template>
                  <p-divider></p-divider>
             @for(item of pedido.itens; track item.id){
                <div class="flex flex-column gap-2">
                    <span class="font-bold text-lg">{{item.descricao}} - {{item.quantidade}} x {{item.preco | currency:'BRL'}}</span>
                </div>
                  <p-divider></p-divider>
             }
                
                <ng-template #footer>
                    <div class="flex gap-4 mt-1">
                       <!--  <p-button label="Cancel" severity="secondary" class="w-full" [outlined]="true" styleClass="w-full" /> -->
                        <p-button label="Finalizar" class="w-full" styleClass="w-full" />
                    </div>
                </ng-template>
            </p-card>
        </div>
    }

    `
})
export class PedidosGarcomComponent {
    @Input() pedidoModel: PedidoModel[] = []
    @Input() dashboardSystemModel: DashboardSystemModel = {};

    getSeverity(status?: string) {
       switch (status) {
            case 'completed':
            case 'ready':
            case 'delivering':
                return 'success';
            case 'preparing':
            case 'awaiting_preparation':
                return 'info';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'danger';
            default:
                return 'warning';
        }
    }

}


