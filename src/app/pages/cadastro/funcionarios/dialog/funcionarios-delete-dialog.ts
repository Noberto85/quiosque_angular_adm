import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Dialog } from "primeng/dialog";
import { Button } from "primeng/button";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FuncionarioService } from "@/service/funcionario.service";
import { TokenService } from "@/service/token.service";
import { SelectModule } from "primeng/select";

@Component({
    selector: 'app-funcionarios-delete-dialog',
    standalone: true,
    imports: [Dialog, Button, ReactiveFormsModule, CommonModule, SelectModule],
    providers: [FuncionarioService],
    template: `
<p-dialog [visible]="funcionarioDelete" (visibleChange)="onVisibilityChange($event)" [style]="{ width: '450px' }" header="Deletar Funcionário" [modal]="true">
    <ng-template #content>
        <form [formGroup]="form">
             <div class="flex flex-col gap-6">
                    <div>
                        <label for="state" class="block font-bold mb-3">Selecione um novo funcionário para vincular a mesa!</label>
                        <p-select id="state" formControlName="funcionarioDestino" [options]="dropdownItems" optionLabel="nome" placeholder="Selecione um funcionário" styleClass="w-full" appendTo="body" />
                    </div>
            </div>
        </form>
    </ng-template>

    <ng-template #footer>
        <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
        <p-button label="Delete" icon="pi pi-trash"  [disabled]="form.invalid" />
    </ng-template>
</p-dialog>
    `
})
export class FuncionariosDeleteDialog implements OnChanges {
    dropdownItems = [];
    tokenService = inject(TokenService);
    form!: FormGroup;
    @Input() funcionarioDelete: boolean = false;
    @Input() funcionarioDeleteId!: string;
    @Output() funcionarioDeleteChange = new EventEmitter<any>();
    @Output() funcionarioDeleteEvent = new EventEmitter<any>();

    garcons: any[] = [];

    constructor(
        private funcionarioService: FuncionarioService,
        private formBuilder: FormBuilder
    ) {
        this.createForm();
    }

    createForm() {
        this.form = this.formBuilder.group({
            funcionarioDestino: [null, [Validators.required]]
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
            debugger
        if (changes['funcionarioDelete'] && changes['funcionarioDelete'].currentValue === true) {
            const quiosqueId = this.tokenService.getClaim();
            this.funcionarioService.findAllNOtEqualsId(this.funcionarioDeleteId, quiosqueId.quiosque_id).subscribe({
                next: (response) => {

                    this.dropdownItems = response;
                    this.funcionarioDelete = true;
                },
                error: (error) => {
                    console.error('Erro ao buscar funcionários:', error);
                }
            });
        }
    }

    onVisibilityChange(value: boolean) {
        this.funcionarioDelete = value;
        this.funcionarioDeleteChange.emit(value);
    }

    hideDialog() {
        this.funcionarioDelete = false;
        this.funcionarioDeleteChange.emit(this.funcionarioDelete);
    }

    funcionariosDelete() {
        if (this.form.valid) {
            this.funcionarioDeleteEvent.emit(this.form.value.garcomDestino.code);
        }
    }
}