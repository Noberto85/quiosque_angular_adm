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
import { DialogModule } from 'primeng/dialog';
import { Select } from "primeng/select";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { GarcomService } from '@/service/garcom.service';
import { PedidoModel } from '@/model/pedido.model';



@Component({
    selector: 'app-pedidos-garcom-dashboard',
    imports: [CommonModule, DialogModule, Toast, PedidosGarcomComponent, ToolbarModule, ButtonModule, Panel, Avatar, Select, ReactiveFormsModule, InputTextModule],
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
        <ng-template #start></ng-template>
        <ng-template #end>
            <p-button label="Pesquisar" icon="pi pi-search" severity="secondary" class="mr-2" (click)="btnSearch()" />
        </ng-template>
    </p-toolbar>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
           <app-pedidos-garcom [pedidoModel]="pedidoModel" 
             class="contents">
        </app-pedidos-garcom>
    </div> 

    <p-dialog maskStyleClass="backdrop-blur-sm" [(visible)]="visible" [style]="{ width: '450px' }" header="Novo Funcionario" [modal]="true">
    <ng-template #content>
        <form [formGroup]="form">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Codigo</label>
                    <input maxlength="255" type="text" pInputText id="name" formControlName="codigo" required autofocus
                        fluid placeholder="Digite o codigo" />
                   
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Mesa</label>
                    <input type="number" pInputText id="description" formControlName="mesa"  autofocus fluid
                        placeholder="Digite o mesa" />
                    
                </div>
              
                <div class="flex flex-col gap-6">
                    <div>
                         <label for="description" class="block font-bold mb-3">Status</label>
                        <p-select id="state" formControlName="status"  [options]="statusOptions" optionValue="code"
                            placeholder="Selecione um status" styleClass="w-full" appendTo="body" />
                    </div>
                </div>
            </div>
        </form>
    </ng-template>

    <ng-template #footer>
        <p-button (click)="closeDialog()" label="Limpar" icon="pi pi-times" text  />
        <p-button (click)="pesquisar()" label="Pesquisar" icon="pi pi-search" />
    </ng-template>
</p-dialog>
       
    `
})
export class DashboardGarcom implements OnInit {
    pedidoModel: PedidoModel[] = []
    garcomService = inject(GarcomService);
    tokenService = inject(TokenService);
    messageService = inject(MessageService);
    dashboardSystemModel: DashboardSystemModel = {}
    form!: FormGroup;
    visible: boolean = false;
    statusOptions = [
        { code: 'EM_PREPARACAO', label: 'Em preparação' },
        { code: 'PRONTO', label: 'Pronto' },
        { code: 'ENTREGUE', label: 'Entregue' }
    ];

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.createForm();
        this.loadPEdidos();
    }
    loadPEdidos() {
        let params = {}
        this.garcomService.findAll(params, this.tokenService.getClaim().quiosque_id).subscribe({
            next: (pedidos) => {
                this.pedidoModel = pedidos;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.message });
            }
        });
    }

    createForm() {
        this.form = this.formBuilder.group({
            codigo: [null],
            status: [null],
            mesa: [null]
        });
    }

    btnSearch() {
        this.visible = true;
    }

    showDialog() {
        this.visible = true;
    }

    closeDialog() {
        this.form.reset();
    }

    pesquisar() {
        
        let params = this.form.value;
         this.garcomService.findAll(params, this.tokenService.getClaim().quiosque_id).subscribe({
            next: (pedidos) => {
                this.pedidoModel = pedidos;
                  this.visible = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.message });
            }
        });
    }
}
