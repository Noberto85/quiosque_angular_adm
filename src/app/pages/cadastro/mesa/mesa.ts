
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Paginator } from 'primeng/paginator';
import { ParamsRequest } from '@/shared/utils/pageable.utils';
import { LoadingService } from '@/shared/services/loading.service';
import { MesaModel } from '@/model/mesa.model';
import { MesaService } from '@/service/mesa.service';
import { TokenService } from '@/service/token.service';
import { Select } from "primeng/select";
import { FuncionarioService } from '@/service/funcionario.service';


@Component({
    selector: 'app-mesa',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        TableModule,
        Paginator,
        Select
    ],
    providers: [MessageService, ConfirmationService, MesaService],
    templateUrl: './mesa.html',
    styleUrl: './mesa.scss'
})
export class Mesa implements OnInit {
    loadingService = inject(LoadingService);
    tokenService = inject(TokenService);
    mesaService = inject(MesaService);
    funcionarioService = inject(FuncionarioService);

    mesaDialog: boolean = false;
    dropdownItems = [];

    mesas = signal<MesaModel[]>([]);
    selectedMesas: MesaModel[]=[];
    mesa!: MesaModel;
    form!: FormGroup;
    submitted: boolean = false;
    salvar: boolean = false;

    tituloDialog: string = '';

    @ViewChild('dt') dt!: Table;

    first: number = 0;
    rows: number = 10;
    totalRecords: number = 0;
    page: number = 0;
    pageSize: number = 10;
    base64Image: string = '';

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.createForm();
        this.loadData();
        this.loadGarcom();
    }

    loadGarcom() {
        this.funcionarioService.findAllWithStatusTrue(this.tokenService.getClaim().quiosque_id).subscribe({
            next: (data) => {
                this.dropdownItems = data;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar garçons' });
            }
        });
    }

    createForm() {
        this.form = this.formBuilder.group({
            numero: [null, [Validators.required]],
            garcom: [null, [Validators.required]]
        });
    }

    loadData(params?: ParamsRequest) {
        this.loadingService.show();
        const claim = this.tokenService.getClaim();
        this.mesaService.findAllPageable(params, claim.quiosque_id).subscribe({
            next: (data) => {
                this.mesas.set(data.content);
                this.totalRecords = data.totalElements;
                this.loadingService.hide();
            },
            error: (err) => {
                this.loadingService.hide();
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar mesas' });
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
        this.salvar = true;
        this.tituloDialog = 'Cadastrar Mesa';
        this.mesa = {};
        this.submitted = false;
        this.mesaDialog = true;
        this.form.reset();

    }

    editMesa(mesa: MesaModel) {
        this.salvar = false;
        this.tituloDialog = 'Editar Mesa';
        this.mesa = { ...mesa };
        this.mesaDialog = true;
        this.form.patchValue({
            numero: mesa.numero
        });
        this.form.updateValueAndValidity();



    }

    updateMesa() {

        this.submitted = true;
        if (this.form.valid) {
            const mesaToUpdate: MesaModel = {
                id: this.mesa.id,
                numero: Number(this.form.value.numero),
                garcomId: Number(this.form.value.garcom.code)
            };

            this.mesaService.update(mesaToUpdate).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Mesa Atualizada', life: 3000 });
                    this.hideDialog();
                    this.loadData();
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, life: 3000 });
                }
            });
        }
    }

    deleteMesa(mesa: MesaModel) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar a mesa ' + mesa.numero + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.mesaService.delete(mesa.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Mesa deletada', life: 3000 });
                        this.loadData();
                    },
                    error: (error) => {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, life: 3000 });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.mesaDialog = false;
        this.submitted = false;
    }

    saveMesa() {
        this.submitted = true;

        if (this.form.valid) {
            const claim = this.tokenService.getClaim();
            const mesaToSave: MesaModel = {
                numero: Number(this.form.value.numero),
                garcomId: Number(this.form.value.garcom.code)
            };

            this.mesaService.create(mesaToSave, claim.quiosque_id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Mesa Atualizada', life: 3000 });
                    this.hideDialog();
                    this.loadData();
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, life: 3000 });
                }
            });
        }
    }

    generateQrcode() {
        
        if (this.selectedMesas?.length === 0) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Selecione uma mesa', life: 3000 });
            return;
        }
        const ids = this.selectedMesas.map(mesa => mesa.id);
        this.loadingService.show();
        this.mesaService.downloadQrcode(ids).subscribe({
            next: (data) => {
                this.loadingService.hide();
                this.exportQrcode(data.pdf)
            },
            error: (error) => {
                this.loadingService.hide(); 
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, life: 3000 });
            }
        });
       
       
    }
    exportQrcode(image:string){
        if (!image) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Nenhum QR Code gerado', life: 3000 });
            return;
        }
         const byteArray = new Uint8Array(
            atob(image).split('').map(char => char.charCodeAt(0))
        );

        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'qrcode.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
    }
}
