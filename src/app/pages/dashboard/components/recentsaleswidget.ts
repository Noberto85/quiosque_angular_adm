import { Component, Input } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../service/product.service';
import { MaisVendidoModel } from '@/service/dashboard.service';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card mb-8!">
        <div class="font-semibold text-xl mb-4">Top 10 Produtos Mais Vendidos</div>
        <p-table [value]="maisVendido" [rows]="10">
            <ng-template #header>
                <tr>
                    <th>Nome</th>
                    <th >Total</th>
                </tr>
            </ng-template>
            <ng-template #body let-item>
                <tr>
                    <td style="width: 35%; min-width: 7rem;">{{ item.descricao }}</td>
                    <td style="width: 35%; min-width: 8rem;">{{ item.totalVendido }}</td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: [ProductService]
})
export class RecentSalesWidget {
    products!: Product[];
    @Input() maisVendido: MaisVendidoModel[] = [];
}
