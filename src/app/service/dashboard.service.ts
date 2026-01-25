import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface DashboardModel {
    qtdUltimodPedido?: number;
    qtdUltimosClientes?: number;
    receitaDoDia?: number;
    receitaDoMes?: number;
    maisVendidos?: MaisVendidoModel[];

}

export interface MaisVendidoModel {
    totalVendido: number;
    descricao: string;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    urlBase = '/api/v1/admin/dashboard';

    constructor(private http: HttpClient) { }

    load(quiosqueId: string): Observable<DashboardModel> {
        return this.http.get<DashboardModel>(`${environment.apiUrl}${this.urlBase}/${quiosqueId}`);
    }
}