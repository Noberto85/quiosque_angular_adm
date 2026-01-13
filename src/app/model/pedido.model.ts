export interface PedidoItemModel {
    id?: string;
    descricao?: string;
    categoria?: string;
    quantidade?: number;
    preco?: number;
    total?: number;
}

export interface PedidoModel {
    id?: string;
    codigo?: string;
    nomePedido?: string;
    mesa?: string;
    dataInit?: string;
    dataFim?: string ;
    status?: string;
    itens?: PedidoItemModel[];
    total?: number;
    cliente?: string;
    observacoes?: string;
}
/*  private Long id;
    private Integer quantidade;
    private BigDecimal valorSoma;
    private String descricao;
    private BigDecimal preco;
    private String categoria;
    private byte[] imagem;
    private Integer avaliacao; */