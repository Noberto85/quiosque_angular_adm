
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '@/pages/service/product.service';
import { NgxMaskDirective } from 'ngx-mask';
import { Panel } from "primeng/panel";
import { Avatar } from "primeng/avatar";
import { GarcomService } from '@/service/garcom.service';
import { GarcomModel } from '@/model/garcom.model';
import { TokenService } from '@/service/token.service';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { ParamsRequest } from '@/shared/utils/pageable.utils';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-garcom',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    TableModule,
    NgxMaskDirective,
    Panel,
    Avatar,
    Paginator
],
    providers: [MessageService, ProductService, ConfirmationService],
    templateUrl: './garcom.html',
    styleUrl: './garcom.scss'
})
export class Garcom implements OnInit {

    tokenService = inject(TokenService);
    garcomDialog: boolean = false;

    products = signal<Product[]>([]);
    garcons = signal<GarcomModel[]>([]);

    garcom!: GarcomModel;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];
    first: number = 0;
    rows: number = 10;
    totalRecords: number = 0;
    page: number = 0;
    pageSize: number = 10;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private garcomService: GarcomService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData(param?: ParamsRequest) {
        const claim = this.tokenService.getClaim();
        this.garcomService.findAllPageable(param, claim.quiosque_id).subscribe((data) => {
            this.garcons.set(data.content);
            this.totalRecords = data.totalElements;
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onPageChange(event: PaginatorState) {

        this.first = event.first ?? 0;
        this.rows = event.rows ?? 10;
        this.page = event.page ?? 0;
        this.loadData({ page: this.page });

    }

    openNew() {
        this.garcom = {};
        this.submitted = false;
        this.garcomDialog = true;
    }

    editGarcom(garcom: GarcomModel) {
        this.garcom = { ...garcom };
        this.garcomDialog = true;
    }

    deleteSelectedGarcons() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Garcons Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.garcomDialog = false;
        this.submitted = false;
    }

    deleteGarcom(garcom: GarcomModel) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + garcom.nome + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';

        return id;
    }

    getSeverity(status: boolean) {
        return status ? 'success' : 'danger';
    }

    getStatusName(status: boolean) {
        return status ? 'Ativo' : 'Inativo';
    }

    saveProduct() {
        this.submitted = true;


    }
}