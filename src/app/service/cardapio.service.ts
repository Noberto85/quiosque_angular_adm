import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiPageableResponse, ParamsRequest } from '@/shared/utils/pageable.utils';
import { CardapioModel } from '@/model/cardapio.model';

@Injectable({
  providedIn: 'root'
})
export class CardapioService {

  urlBase = '/api/cardapios';

  private mockData: CardapioModel[] = [
    { 
        id: 1, 
        categoria: { id: '1', descricao: 'Bebidas' }, 
        
    },
    { 
        id: 2, 
        categoria: { id: '2', descricao: 'Lanches' }, 
    }
  ];

  constructor(private _http: HttpClient) { }

  create(cardapio: CardapioModel, quiosqueId: string): Observable<any> {
    cardapio.id = Math.floor(Math.random() * 1000);
    this.mockData.push(cardapio);
    return of(cardapio);
  }

  update(cardapio: CardapioModel): Observable<any> {
    const index = this.mockData.findIndex(c => c.id === cardapio.id);
    if (index !== -1) {
        this.mockData[index] = cardapio;
    }
    return of(cardapio);
  }

  delete(id: any): Observable<any> {
    this.mockData = this.mockData.filter(c => c.id !== id);
    return of({});
  }

  findAllPageable(params?: ParamsRequest, quiosqueId?: string): Observable<ApiPageableResponse<CardapioModel>> {
    const { page = 0, size = 10, search = '' } = params || {};
    
    let filteredData = this.mockData;
    // Basic search by category name
    if (search) {
        filteredData = filteredData.filter(c => 
            c.categoria?.descricao?.toLowerCase().includes(search.toLowerCase())
        );
    }

    const start = page * size;
    const end = start + size;
    const content = filteredData.slice(start, end);

    return of({
        content: content,
        totalElements: filteredData.length,
        totalPages: Math.ceil(filteredData.length / size),
        pageable: {
            pageNumber: page,
            pageSize: size,
            offset: start,
            paged: true,
            unpaged: false,
            sort: {
                empty: true,
                unsorted: true,
                sorted: false
            }
        }
    });
  }

  findAll(quiosqueId: string): Observable<CardapioModel[]> {
    return of(this.mockData);
  }
}
