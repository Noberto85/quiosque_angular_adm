import { GarcomModel } from "@/model/garcom.model";
import { Garcom } from "@/pages/cadastro/garcom/garcom";
import { ApiPageableResponse, ParamsRequest } from "@/shared/utils/pageable.utils";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})
export class GarcomService {
    constructor(private _http: HttpClient) { }

    create(garcom: Garcom): Observable<Garcom> {
        return this._http.post<Garcom>('/api/garcom', garcom);
    }

    findAllPageable(params?: ParamsRequest, quiosqueId?: string): Observable<ApiPageableResponse<GarcomModel>> {
        const { page = 0, size = 10, orderBy = 'nome', direction = 'ASC', search = '' } = params || {};

        let queryParams = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('orderBy', orderBy)
            .set('direction', direction);

        if (search) {
            queryParams = queryParams.set('search', search);
        }

        return this._http.get<ApiPageableResponse<GarcomModel>>(`${environment.apiUrl}/api/v1/admin/garcom/${quiosqueId}/pageable`, { params: queryParams });
    }
}