import { CategoriaModel } from "@/model/categoria.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";

export interface RoleModel {
    id: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    urlBase = '/api/v1/role';


    constructor(private _http: HttpClient) { }

    findAll(): Observable<RoleModel[]> {
        return this._http.get<RoleModel[]>(`${environment.apiUrl}${this.urlBase}`);
    }
}
