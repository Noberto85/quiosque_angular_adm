import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { CpfValidator } from '../../../../shared/validators/cpf.validator';


@Component({
  selector: 'app-func-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, PasswordModule, CheckboxModule, InputTextModule, RippleModule, CommonModule, NgxMaskDirective],
  templateUrl: './func-login.html',
  styleUrl: './func-login.scss'
})
export class FuncLogin {
  loginFuncForm: FormGroup;
  @Output() onSubmitEmit = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder) {
    this.loginFuncForm = this.fb.group({
      cpf: ['33804632807', [Validators.required, CpfValidator.validate]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }
  onSubmit() {
    debugger  
    if (this.loginFuncForm.valid) {
      this.onSubmitEmit.emit(this.loginFuncForm);
    } else {
      this.loginFuncForm.markAllAsTouched();
    }
  }
}
