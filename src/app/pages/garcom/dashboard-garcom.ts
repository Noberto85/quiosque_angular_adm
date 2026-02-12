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
            <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (click)="btnSearch()" />
        </ng-template>
    </p-toolbar>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
           <app-pedidos-garcom [pedidoModel]="pedidoModel" 
             class="contents">
        </app-pedidos-garcom>
    </div> 

  
            <p-dialog maskStyleClass="backdrop-blur-sm" [(visible)]="visible" [modal]="true" [draggable]="false" [resizable]="false">
                <ng-template #headless>
                    <div class="flex flex-col px-8 py-8 gap-6 rounded-2xl" style="border-radius: 12px;">
        <form [formGroup]="form">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Nome</label>
                    <input maxlength="255" type="text" pInputText id="name" formControlName="nome" required autofocus
                        fluid placeholder="Digite o nome" />
                    <small class="text-red-500"
                        *ngIf="form.get('nome')?.invalid && (form.get('nome')?.dirty || form.get('nome')?.touched)">Nome
                        é requerido.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Cpf</label>
                    <input type="text" pInputText id="description" formControlName="cpf" required autofocus fluid
                        mask="000.000.000-00" placeholder="Digite o cpf" />
                    <small class="text-red-500"
                        *ngIf="form.get('cpf')?.hasError('required') && (form.get('cpf')?.dirty || form.get('cpf')?.touched)">Cpf
                        é requerido.</small>
                    <small class="text-red-500"
                        *ngIf="form.get('cpf')?.hasError('invalidCpf') && (form.get('cpf')?.dirty || form.get('cpf')?.touched)">Cpf
                        inválido.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Tefefone</label>
                    <input type="text" pInputText id="description" formControlName="telefone" required autofocus fluid
                        mask="(00) 00000-0000" placeholder="Digite o telefone" />
                    <small class="text-red-500"
                        *ngIf="form.get('telefone')?.hasError('required') && (form.get('telefone')?.dirty || form.get('telefone')?.touched)">telefone
                        é requerido.</small>
                    <small class="text-red-500"
                        *ngIf="form.get('telefone')?.hasError('invalidTelefone') && (form.get('telefone')?.dirty || form.get('telefone')?.touched)">telefone
                        inválido.</small>
                </div>
                <div class="flex flex-col gap-6">
                    <div>
                        <p-select id="state" formControlName="role"  optionLabel="role"
                            placeholder="Selecione um funcionário" styleClass="w-full" appendTo="body" />
                        <small class="text-red-500"
                            *ngIf="form.get('role')?.invalid && (form.get('role')?.dirty || form.get('role')?.touched)">Funcionário
                            é requerido.</small>
                    </div>
                </div>
            </div>
        </form>
                        
                    </div>
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

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.createForm();
        this.loadPEdidos();
    }
    loadPEdidos(){
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
            id: [null],
            nome: [null],
            cpf: [null],
            status: [true],
            telefone: [null],
            role: [null]
        });
    }

    btnSearch() {
        this.visible = true;
    }

    showDialog() {
        this.visible = true;
    }

    closeDialog() {
        this.visible = false;
    }
}
