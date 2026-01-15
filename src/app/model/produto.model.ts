import { CategoriaModel } from "./categoria.model";

export interface ProdutoModel {
    id?: string;
    nome?: string;
    descricao?: string;
    preco?: number;
    imagem?: any;
    urlImagem?: string;
    avaliacao?: number;
    categoriaDto?: CategoriaModel;
}
