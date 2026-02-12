import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSystemModel } from '@/service/system.service';
import { TableModule } from "primeng/table";
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import { PedidoModel } from '@/model/pedido.model';
import { StatusUtils } from '@/shared/utils/status.utils';
import { Tag } from "primeng/tag";


@Component({
    standalone: true,
    selector: 'app-pedidos-garcom',
    imports: [CommonModule, TableModule, Button, Card, Tag],
    template: `

    @for (pedido of pedidoModel; track pedido.id) {
        
       <div class="col-span-1">
            <p-card [style]="{ width: '100%', overflow: 'hidden' }">
                <ng-template #title>
                <p>Pedido: #{{ pedido.codigo }}</p> 
                <p>Cliente: #{{ pedido.cliente }}</p>          
            </ng-template>
                <ng-template #subtitle>Status: <p-tag [value]="getSeverity(pedido.status)" [severity]="getSeverity(pedido.status)" /> </ng-template>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                    quas!
                </p>
                <ng-template #footer>
                    <div class="flex gap-4 mt-1">
                        <p-button label="Cancel" severity="secondary" class="w-full" [outlined]="true" styleClass="w-full" />
                        <p-button label="Save" class="w-full" styleClass="w-full" />
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
        return StatusUtils.getSeverity(status || '');
    }
    
}
 

