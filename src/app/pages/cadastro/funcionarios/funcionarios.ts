
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CpfValidator } from '@/shared/validators/cpf.validator';
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
import { FuncionarioService } from '@/service/funcionario.service';
import { FuncionarioModel } from '@/model/garcom.model';
import { TokenService } from '@/service/token.service';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { ParamsRequest } from '@/shared/utils/pageable.utils';
import { LoadingService } from '@/shared/services/loading.service';

import { debounceTime } from 'rxjs';
import { FuncionariosDeleteDialog } from './dialog/funcionarios-delete-dialog';
import { RoleModel, RoleService } from '@/service/role.service';


@Component({
    selector: 'app-funcionario',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    Paginator,
    FuncionariosDeleteDialog
],
    providers: [MessageService, ProductService, ConfirmationService],
    templateUrl: './funcionarios.html',
    styleUrl: './funcionarios.scss'
})
export class Funcionarios implements OnInit {
    loadingService = inject(LoadingService);
    tokenService = inject(TokenService);
    roleService = inject(RoleService);
    roles = signal<RoleModel[]>([]);

    garcomDialog: boolean = false;
    funcionariosDeleteDelete: boolean = false;
    funcionariosEdit: boolean = false;
    funcionariosDeleteId: number = 0;

    products = signal<Product[]>([]);
    funcionarios = signal<FuncionarioModel[]>([]);

    funcionario!: FuncionarioModel;

    form!: FormGroup;
    formSearch!: FormGroup;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;


    first: number = 0;
    rows: number = 10;
    totalRecords: number = 0;
    page: number = 0;
    pageSize: number = 10;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private funcionarioService: FuncionarioService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.roleService.findAll().subscribe({
            next: (data) => {
                this.roles.set(data);
            }
        });
        this.createSearchForm();
        this.createForm();
        this.formSearch
            .get('search')
            ?.valueChanges.pipe(debounceTime(1000))
            .subscribe((valor) => {
                this.loadData({ search: valor });
            });

        this.loadData();
    }

    createForm() {
        this.form = this.formBuilder.group({
            id: [null],
            nome: [null, [Validators.required]],
            cpf: [null, [Validators.required, CpfValidator.validate]],
            status: [true],
            telefone: [null, [Validators.required]],
            role: [null, [Validators.required]]
        });
    }
     createSearchForm() {
        this.formSearch = this.formBuilder.group({
            search: [null]
        });
    }
    clearSearch() {
        this.formSearch.get('search')?.setValue(null);
       
    }

    loadData(param?: ParamsRequest) {
        
        this.loadingService.show();
        const claim = this.tokenService.getClaim();
        this.funcionarioService.findAllPageable(param, claim.quiosque_id).subscribe({
            next: (data) => {
                this.funcionarios.set(data.content);
                this.totalRecords = data.totalElements;
                this.loadingService.hide();
            },
            error: () => {
                this.loadingService.hide();
            }
        });
    }


    onPageChange(event: PaginatorState) {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? 10;
        this.page = event.page ?? 0;
        
        this.loadData({ page: this.page });

    }

    openNew() {
        this.funcionario = {};
        this.submitted = false;
        this.garcomDialog = true;
    }

    editFuncionarios(funcionario: FuncionarioModel) {
        this.form.patchValue(funcionario);
        this.funcionariosEdit = true;
    }


    deleteSelectedFuncionarios(funcionarioId: number) {
        this.funcionariosDeleteId = funcionarioId;
        this.funcionariosDeleteDelete = true;
    }

    hideDialog() {
        this.garcomDialog = false;
        this.submitted = false;
    }

    hideEditDialog() {
        this.funcionariosEdit = false;  
        this.submitted = false;
    }

    deleteFuncionarios(funcionario: any) {
        
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir o funcionário? <br>Todas as mesas serão desassociadas e adicionadas ao funcionário selecionado!',
            header: 'Confirmar Exclusão',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loadingService.show();
                this.funcionariosDeleteDelete = false
                this.funcionarioService.delete(funcionario, this.funcionariosDeleteId).subscribe({
                    next: () => {
                        this.loadingService.hide();
                        
                        this.loadData();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Garcom excluído com sucesso',
                            life: 3000
                        });
                    },
                    error: (error) => {
                        this.loadingService.hide();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error.message,
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    activateFuncionarios(garcom: FuncionarioModel) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja ativar o funcionário?',
            header: 'Confirmar Ativação',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loadingService.show();
                this.funcionarioService.activate(garcom.id).subscribe({
                    next: () => {
                        this.loadingService.hide();
                        
                        this.loadData();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Funcionário ativado com sucesso',
                            life: 3000
                        });
                    },
                    error: (error) => {
                        this.loadingService.hide();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error.message,
                            life: 3000
                        });
                    }
                });
            }
        });
    }




    saveGarcom() {
        
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.funcionario = {
            ...this.form.value,
            role: this.form.value.role.id
        };
        debugger
        const claim = this.tokenService.getClaim();
        this.loadingService.show();
        this.funcionarioService.create(this.funcionario, claim.quiosque_id).subscribe({
            next: () => {
                this.loadingService.hide();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Funcionário salvo com sucesso',
                    life: 3000
                });
                
                this.loadData();
                this.hideDialog();
                this.form.reset();
            },
            error: (error) => {
                this.loadingService.hide();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message,
                    life: 3000
                });
            }
        });

        
    }

    editarFuncionarios(garcom: FuncionarioModel) {
        this.funcionariosEdit = false;
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.funcionario = {
            ...this.form.value,
            ...garcom
        };

        this.loadingService.show();
        this.funcionarioService.update(this.funcionario).subscribe({
            next: () => {
                this.loadingService.hide();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Funcionário editado com sucesso',
                    life: 3000
                });
                
                this.loadData();
                this.hideDialog();
            },
            error: (error) => {
                this.loadingService.hide();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message,
                    life: 3000
                });
            }
        });
    }


    getSeverity(status: boolean) {
        return status ? 'success' : 'danger';
    }

    getStatusName(status: boolean) {
        return status ? 'Ativo' : 'Inativo';
    }
}