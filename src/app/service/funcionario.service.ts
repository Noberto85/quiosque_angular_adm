import { FuncionarioModel } from "@/model/garcom.model";
import { ApiPageableResponse, ParamsRequest } from "@/shared/utils/pageable.utils";
import { HttpClient, HttpParams } from "@angular/common/http";
import {  Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";



@Injectable({
    providedIn: 'root'
})
export class FuncionarioService {
   
    urlGarcomBase = '/api/v1/admin/funcionario';
    constructor(private _http: HttpClient) { }

    create(garcom: FuncionarioModel, quiosqueId: string): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}${this.urlGarcomBase}/${quiosqueId}`, garcom);
    }

    findAllPageable(params?: ParamsRequest, quiosqueId?: string, userAdmId?: string): Observable<ApiPageableResponse<FuncionarioModel>> {
        const { page = 0, size = 10, orderBy = 'nome', direction = 'ASC', search = undefined } = params || {};

        let queryParams = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('orderBy', orderBy)
            .set('direction', direction);

        if (search) {
            queryParams = queryParams.set('search', search);
        }

        return this._http.get<ApiPageableResponse<FuncionarioModel>>(`${environment.apiUrl}${this.urlGarcomBase}/${userAdmId}/${quiosqueId}/pageable`, { params: queryParams });
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