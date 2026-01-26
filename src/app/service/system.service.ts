import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface DashboardSystemModel {
    qtdTotQuiosque?: number;
    qtdClientesCad?: number;

}

export interface MaisVendidoModel {
    totalVendido: number;
    descricao: string;
}

@Injectable({
    providedIn: 'root'
})
export class SystemService {
    urlBase = '/api/v1/system';

    constructor(private http: HttpClient) { }

    load(): Observable<DashboardSystemModel> {
        return this.http.get<DashboardSystemModel>(`${environment.apiUrl}${this.urlBase}/load-dash`);
    }
}