import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// serviço de notificações
@Injectable({ providedIn: 'root' })
export class NotificationService {
    private pedidosSubject = new BehaviorSubject<number>(0);
    pedidos$ = this.pedidosSubject.asObservable();

    constructor() {
        const saved = localStorage.getItem('pedidosRecentes');
        if (saved) {
            this.pedidosSubject.next(Number(saved));
        }
    }

    loadPedidos() {
        debugger
        const saved = localStorage.getItem('pedidosRecentes');
        if (saved) {
            this.pedidosSubject.next(Number(saved));
        }
        return this.pedidos$;
    }

    atualizarPedidos(qtd: number) {
        this.pedidosSubject.next(qtd);
        localStorage.setItem('pedidosRecentes', String(qtd));
    }

    limparPedidos() {
        this.pedidosSubject.next(0);
        localStorage.removeItem('pedidosRecentes');
    }
}