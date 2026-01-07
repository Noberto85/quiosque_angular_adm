
import {  HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../service/token.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';



export const authInterceptor : HttpInterceptorFn = (req,next) =>{
    
    const tokenService = inject(TokenService);
    const router = inject(Router);
    const  token= tokenService.getToken();
    const authRequest = token
        ? req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        })
        : req;

    return next(authRequest).pipe(
        catchError((error) => {
            debugger
            if (error.status === 401) {
                router.navigate(['/auth/login']); // Redireciona para a página de login
            }  
            if (error.status === 403) {
               
                router.navigate(['/']); // Redireciona para outra página
            }
            return throwError(() => error); // Propaga o erro
        })
    );
};