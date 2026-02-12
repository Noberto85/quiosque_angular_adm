import { FuncionarioModel } from "@/model/garcom.model";
import { PedidoModel } from "@/model/pedido.model";
import { ApiPageableResponse, ParamsRequest } from "@/shared/utils/pageable.utils";
import { HttpClient, HttpParams } from "@angular/common/http";
import {  Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";



@Injectable({
    providedIn: 'root'
})
export class GarcomService {
   
    urlGarcomBase = '/api/v1/func/garcom';
    constructor(private _http: HttpClient) { }

  

    findAll(params?: any, quiosqueId?: string): Observable<PedidoModel[]> {
        const { mesas = undefined, codigo = undefined, status = [] } = params || {};

        let queryParams = new HttpParams()
            .set('status', status)
            .set('mesas', mesas)
            .set('codigo', codigo);

        if (status) {
            queryParams = queryParams.set('status', status);
        }

        return this._http.get<PedidoModel[]>(`${environment.apiUrl}${this.urlGarcomBase}/findAllByStatus/${quiosqueId}`/* , { params: queryParams } */);
    }

     findAllNOtEqualsId(garcomId: any, quiosqueId: string): Observable<any> {
        return this._http.get<any>(`${environment.apiUrl}${this.urlGarcomBase}/findAllNotEquals/${quiosqueId}/${garcomId}`);
    }

     findAllWithStatusTrue(quiosqueId: string): Observable<any> {
        return this._http.get<any>(`${environment.apiUrl}${this.urlGarcomBase}/findAllWithStatusTrue/${quiosqueId}`);
    }

     delete(novoGarcomId: any, garcomId: any): Observable<any> {
        return this._http.delete<any>(`${environment.apiUrl}${this.urlGarcomBase}/${novoGarcomId}/${garcomId}`);
    }

    deleteFunc(garcomId: any): Observable<any> {
        return this._http.delete<any>(`${environment.apiUrl}${this.urlGarcomBase}/${garcomId}`);
    }
        
    activate(garcomId: any): Observable<any> {
        return this._http.put<any>(`${environment.apiUrl}${this.urlGarcomBase}/activate`, {id: garcomId});
    }
        
    update(garcom: FuncionarioModel): Observable<any> {
        return this._http.put<any>(`${environment.apiUrl}${this.urlGarcomBase}/update`, garcom);
    }
}