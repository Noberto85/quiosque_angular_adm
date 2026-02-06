import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/service/auth.service';
import { TokenService } from '@/service/token.service';
import { LoadingService } from '../../shared/services/loading.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AdminLogin } from './components/admin-login/admin-login';
import { TabsModule } from 'primeng/tabs';
import { FuncLogin } from "./components/func-login/func-login";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [AdminLogin, TabsModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, RippleModule, AppFloatingConfigurator, CommonModule, ToastModule, FuncLogin],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <p-toast />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="flex justify-center mb-8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-crossed h-8 w-8">
                                <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"></path>
                                <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path>
                                <path d="m2.1 21.8 6.4-6.3"></path>
                                <path d="m19 5-7 7"></path>
                            </svg>
                        </div>

                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Controle Financeiro</div>
                            <span class="text-muted-color font-medium">Bem-vindo! Faça login para continuar.</span>
                        </div>
                        <p-tabs value="0" scrollable>
                            <p-tablist>
                                <p-tab value="0">Administrador</p-tab>
                                <p-tab value="1">Funcionário</p-tab>    
                            </p-tablist>
                            <p-tabpanels>
                                <p-tabpanel header="Administrador" value="0">
                                    <app-admin-login (onSubmitEmit)="onSubmit($event)"></app-admin-login>
                                </p-tabpanel>
                                 <p-tabpanel header="Funcionário" value="1">
                                    <app-func-login (onSubmitEmit)="onSubmitFunc($event)"></app-func-login>
                                </p-tabpanel>
                            </p-tabpanels>
                           
                        </p-tabs>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {

    private service = inject(MessageService);
    private tokenService = inject(TokenService);
    private router = inject(Router);
    private loadingService = inject(LoadingService);
    constructor(private fb: FormBuilder, private authService: AuthService) {

    }

    onSubmit(event: FormGroup) {

        if (event.valid) {
            this.loadingService.show();
            this.authService.logar(event.value.email, event.value.password).subscribe({
                next: (response) => {
                    this.loadingService.hide();

                    if (response) {
                        this.tokenService.setToken(response.token);
                        this.redirectForRoles();
                    }
                },
                error: (error) => {
                    this.loadingService.hide();
                    this.service.add({ severity: 'error', summary: 'Error Message', detail: error.error.message });
                }
            })

        } else {
            event.markAllAsTouched();
        }
    }

    onSubmitFunc(event: FormGroup) {

        if (event.valid) {
            this.loadingService.show();
            this.authService.logarFunc(event.value.cpf, event.value.password).subscribe({
                next: (response) => {
                    this.loadingService.hide();

                    if (response) {
                        this.tokenService.setToken(response.token);
                        this.redirectForRoles();
                    }
                },
                error: (error) => {
                    this.loadingService.hide();
                    this.service.add({ severity: 'error', summary: 'Error Message', detail: error.error.message });
                }
            })

        } else {
            event.markAllAsTouched();
        }
    }

    private redirectForRoles() {
        debugger
        const claims = this.tokenService.getClaim();
        if (claims) {
            if (claims.Roles.includes("ROLE_SYSTEM_ADMIN")) {
                this.router.navigate(['/system']);
            } else if (claims.Roles.includes("ROLE_GARCOM")) {
                this.router.navigate(['/garcom']);
            } else {
                this.router.navigate(['/']);
            }
        }
    }
}
