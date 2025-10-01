export interface LoginRequest {
  cpf_ou_email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  bairro?: string;
  senha: string;
  cpf: string;
}

export interface LoginResponse {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  bairro?: string;
  cpf: string;
  ativo: boolean;
  token: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  bairro?: string;
  cpf: string;
  ativo: boolean;
}

export enum TipoOcorrencia {
  SUGESTAO = 'Sugestão',
  ELOGIO = 'Elogio', 
  DENUNCIA = 'Denúncia'
}

export interface Categoria {
  id: number;
  nome: string;
  setor: string;
}

export interface CreateOcorrenciaRequest {
  usuario_id: number;
  tipo: string;
  setor: string;
  data: string;
  assunto: string;
  detalhes: string;
  status?: string;
  satisfacao_do_usuario?: string | null;
}

export interface CreateReclamacaoRequest {
  usuario_id: number;          // ✅ OBRIGATÓRIO
  categoria_id: number;        // ✅ OBRIGATÓRIO
  descricao: string;           // ⚠️ Recomendado
  data: string;                // ⚠️ Recomendado (formato: YYYY-MM-DD)
  endereco: string;            // ❌ Opcional
  localizacao?: string;        // ❌ Opcional (coordenadas ou ponto de referência)
  imagem?: string;             // ❌ Opcional (base64 completo: data:image/jpeg;base64,...)
  status?: string;             // ❌ Opcional (padrão: "Em Aberto")
  satisfacao_do_usuario?: string | null; // ❌ Opcional
}

export interface Ocorrencia {
  id: number;
  numero_protocolo: string;
  tipo: string;
  setor: string;
  data: string;
  assunto: string;
  detalhes: string;
  status: string;
  usuario_id: number;
  satisfacao_do_usuario?: string | null;
  created_at: string;
  updated_at: string;
  usuario?: {
    id: number;
    nome: string;
  };
}

export interface Reclamacao {
  id: number;
  numero_protocolo: string;
  descricao: string;
  data: string;
  endereco: string;
  localizacao?: string;
  imagem?: string;
  status: string;
  categoria_id: number;
  usuario_id: number;
  created_at: string;
  updated_at: string;
  categoria?: Categoria;
  usuario?: {
    id: number;
    nome: string;
  };
  satisfacao_do_usuario?: string | null;
}