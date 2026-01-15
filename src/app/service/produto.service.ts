import { ProdutoModel } from "@/model/produto.model";
import { ApiPageableResponse, ParamsRequest } from "@/shared/utils/pageable.utils";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ProdutoService {
   
    urlBase = '/api/v1/admin/item_cardapio';
    
    private mockData: ProdutoModel[] = [
        { id: '1', nome: 'Coca Cola', descricao: 'Lata 350ml', preco: 5.00, categoriaDto: { id: '1', descricao: 'Bebidas' }, avaliacao: 5 },
        { id: '2', nome: 'X-Bacon', descricao: 'Pão, carne, queijo e bacon', preco: 25.00, categoriaDto: { id: '2', descricao: 'Lanches' }, avaliacao: 4 },         
        { id: '3', nome: 'Pudim', descricao: 'Pudim de leite condensado', preco: 12.00, categoriaDto: { id: '3', descricao: 'Sobremesas' }, avaliacao: 5 },
        { id: '4', nome: 'Batata Frita', descricao: 'Porção grande', preco: 30.00, categoriaDto: { id: '4', descricao: 'Porções' }, avaliacao: 4 },
        { id: '5', nome: 'Suco de Laranja', descricao: 'Natural 500ml', preco: 10.00, categoriaDto: { id: '1', descricao: 'Bebidas' }, avaliacao: 5 },
        { id: '6', nome: 'X-Salada', descricao: 'Pão, carne, queijo e salada', preco: 20.00, categoriaDto: { id: '2', descricao: 'Lanches' }, avaliacao: 3 }
    ];

    constructor(private _http: HttpClient) { }

    create(produto: ProdutoModel, quiosqueId: string): Observable<any> {
        produto.id = Math.random().toString(36).substr(2, 9);
        this.mockData.push(produto);
        return of(produto);
    }

    findAllPageable(params?: ParamsRequest, quiosqueId?: string): Observable<ApiPageableResponse<ProdutoModel>> {
        const { page = 0, size = 10, orderBy = 'id', direction = 'DESC', search = undefined } = params || {};
       
               let queryParams = new HttpParams()
                   .set('page', page)
                   .set('size', size)
                   .set('orderBy', orderBy)
                   .set('direction', direction);
       
               if (search) {
                   queryParams = queryParams.set('search', search);
               }
       
               return this._http.get<ApiPageableResponse<ProdutoModel>>(`${environment.apiUrl}${this.urlBase}/${quiosqueId}/pageable`, { params: queryParams });
    }

    delete(id: any): Observable<any> {
        this.mockData = this.mockData.filter(p => p.id !== id);
        return of({});
    }
        
    update(produto: ProdutoModel): Observable<any> {
        const index = this.mockData.findIndex(p => p.id === produto.id);
        if (index !== -1) {
            this.mockData[index] = produto;
        }
        return of(produto);
    }
}
