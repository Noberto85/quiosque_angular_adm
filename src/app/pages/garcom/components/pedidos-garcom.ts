import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSystemModel } from '@/service/system.service';
import { TableModule } from "primeng/table";
import { Button } from "primeng/button";
import { Toast } from "primeng/toast";
import { Panel } from "primeng/panel";
import { Card } from "primeng/card";

export interface PedidoGarcom {
    id: number;
    nome: string;

}

@Component({
    standalone: true,
    selector: 'app-pedidos-garcom',
    imports: [CommonModule, TableModule, Button, Toast, Card],
    template: `

<p-toast />

    @for (pedido of pedidos; track pedido.id) {
        
       <div class="col-span-1">
            <p-card [style]="{ width: '100%', overflow: 'hidden' }">
                <ng-template #title> {{ pedido.nome }} </ng-template>
                <ng-template #subtitle> Card subtitle </ng-template>
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
    @Input() dashboardSystemModel: DashboardSystemModel = {};
    pedidos: PedidoGarcom[] = [
        { id: 1, nome: 'Pedido 1' },
        { id: 2, nome: 'Pedido 2' },
        { id: 3, nome: 'Pedido 3' },
        { id: 4, nome: 'Pedido 4' },
        { id: 5, nome: 'Pedido 5' },
        { id: 6, nome: 'Pedido 6' },
        { id: 7, nome: 'Pedido 7' },
        { id: 8, nome: 'Pedido 8' },
        { id: 9, nome: 'Pedido 9' },
        { id: 10, nome: 'Pedido 10' },
        { id: 11, nome: 'Pedido 11' },
        { id: 12, nome: 'Pedido 12' },
        { id: 13, nome: 'Pedido 13' },
        { id: 14, nome: 'Pedido 14' },
        { id: 15, nome: 'Pedido 15' },
        { id: 16, nome: 'Pedido 16' },
        { id: 17, nome: 'Pedido 17' },
        { id: 18, nome: 'Pedido 18' },
        { id: 19, nome: 'Pedido 19' },
        { id: 20, nome: 'Pedido 20' },
    ];
}
