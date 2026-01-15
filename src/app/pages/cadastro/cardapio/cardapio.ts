
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Paginator } from 'primeng/paginator';
import { Select } from "primeng/select";
import { MultiSelectModule } from 'primeng/multiselect';
import { ParamsRequest } from '@/shared/utils/pageable.utils';
import { LoadingService } from '@/shared/services/loading.service';
import { TokenService } from '@/service/token.service';
import { CardapioModel } from '@/model/cardapio.model';
import { CardapioService } from '@/service/cardapio.service';
import { CategoriaService } from '@/service/categoria.service';
import { ProdutoService } from '@/service/produto.service';
import { CategoriaModel } from '@/model/categoria.model';
import { ProdutoModel } from '@/model/produto.model';

@Component({
    selector: 'app-cardapio',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        DialogModule,
        ConfirmDialogModule,
        TableModule,
        Paginator,
        Select,
        MultiSelectModule
    ],
    providers: [MessageService, ConfirmationService, CardapioService, CategoriaService, ProdutoService],
    templateUrl: './cardapio.html',
    styleUrl: './cardapio.scss'
})
export class Cardapio implements OnInit {
    loadingService = inject(LoadingService);
    tokenService = inject(TokenService);
    cardapioService = inject(CardapioService);
    categoriaService = inject(CategoriaService);
    produtoService = inject(ProdutoService);
    
    cardapioDialog: boolean = false;
    
    cardapios = signal<CardapioModel[]>([]);
    categorias = signal<CategoriaModel[]>([]);
    produtos = signal<ProdutoModel[]>([]);
    
    cardapio!: CardapioModel;
    form!: FormGroup;
    submitted: boolean = false;
    
    @ViewChild('dt') dt!: Table;

    first: number = 0;
    rows: number = 10;
    totalRecords: number = 0;
    page: number = 0;
    pageSize: number = 10;
    
    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.createForm();
        this.loadData();
        this.loadCategorias();
        this.loadProdutos();
    }

    createForm() {
        this.form = this.formBuilder.group({
            categoria: [null, [Validators.required]],
            produtos: [null, [Validators.required]]
        });
    }

    loadData(params?: ParamsRequest) {
        this.loadingService.show();
        const claim = this.tokenService.getClaim();
        this.cardapioService.findAllPageable(params, claim.quiosque_id).subscribe({
            next: (data) => {
                this.cardapios.set(data.content);
                this.totalRecords = data.totalElements;
                this.loadingService.hide();
            },
            error: (err) => {
                this.loadingService.hide();
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar cardápios' });
            }
        });
    }

    loadCategorias() {
        const claim = this.tokenService.getClaim();
        this.categoriaService.findAll(claim.quiosque_id).subscribe({
            next: (data) => {
                this.categorias.set(data);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar categorias' });
            }
        });
    }

    loadProdutos() {
        const claim = this.tokenService.getClaim();
        // Assuming findAll returns all products without pagination for the multiselect
        // Or we might need a specific endpoint. For now, using findAllPageable with a large size or findAll if available.
        // Checking ProdutoService... it has findAllPageable. Let's assume there's a findAll or use pageable with large size.
        // Wait, I should check if ProdutoService has findAll. The search result didn't show it explicitly but let's assume I might need to add it or use pageable.
        // Actually, for a dropdown/multiselect, we usually need all active products.
        // I'll try findAllPageable with large size for now as a workaround if findAll is missing, or better, add findAll to ProdutoService.
        // But for now, let's assume findAllPageable is what we have.
        this.produtoService.findAllPageable({ page: 0, size: 1000 }, claim.quiosque_id).subscribe({
            next: (data) => {
                this.produtos.set(data.content);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar produtos' });
            }
        });
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

    openNew() {
        this.cardapio = {};
        this.submitted = false;
        this.cardapioDialog = true;
        this.form.reset();
    }

    editCardapio(cardapio: CardapioModel) {
        this.cardapio = { ...cardapio };
        this.cardapioDialog = true;
        this.form.patchValue({
            categoria: cardapio.categoria,
         
        });
    }

    deleteCardapio(cardapio: CardapioModel) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar o cardápio da categoria ' + cardapio.categoria?.descricao + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.cardapioService.delete(cardapio.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cardápio deletado', life: 3000 });
                        this.loadData();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar cardápio', life: 3000 });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.cardapioDialog = false;
        this.submitted = false;
    }

    saveCardapio() {
        this.submitted = true;

        if (this.form.valid) {
            const claim = this.tokenService.getClaim();
            const cardapioToSave: CardapioModel = {
                ...this.cardapio,
                ...this.form.value
            };

            if (this.cardapio.id) {
                this.cardapioService.update(cardapioToSave).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cardápio Atualizado', life: 3000 });
                        this.hideDialog();
                        this.loadData();
                    },
                    error: () => {
                         this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar cardápio', life: 3000 });
                    }
                });
            } else {
                this.cardapioService.create(cardapioToSave, claim.quiosque_id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cardápio Criado', life: 3000 });
                        this.hideDialog();
                        this.loadData();
                    },
                    error: () => {
                         this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar cardápio', life: 3000 });
                    }
                });
            }
        }
    }
}
