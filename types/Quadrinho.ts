export interface Quadrinho {
  id: number;
  titulo: string;
  autor: string;
  editora: string;
  anoPublicacao: number;
  descricao: string;
  dataCriacao: string;
}

export interface CreateQuadrinhoInput {
  titulo: string;
  autor: string;
  editora: string;
  anoPublicacao: number;
  descricao: string;
}

export interface UpdateQuadrinhoInput {
  titulo?: string;
  autor?: string;
  editora?: string;
  anoPublicacao?: number;
  descricao?: string;
}
