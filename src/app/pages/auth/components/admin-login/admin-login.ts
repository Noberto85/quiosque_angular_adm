import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule,ReactiveFormsModule, PasswordModule, ButtonModule, CheckboxModule, InputTextModule, RippleModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLogin {
  loginForm: FormGroup;
  @Output() onSubmitEmit = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['nobertorafael9@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }
  onSubmit() {
    debugger  
    if (this.loginForm.valid) {
      this.onSubmitEmit.emit(this.loginForm);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
