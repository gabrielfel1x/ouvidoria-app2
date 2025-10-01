export const LOGIN_ROUTE = () => '/login';
export const REGISTER_ROUTE = () => '/usuarios';
export const RECLAMACOES_ROUTE = () => '/reclamacoes';
export const RECLAMACOES_BY_USER_ROUTE = (usuarioId: number) => `/usuarios/${usuarioId}/reclamacoes`;
export const RECLAMACAO_ROUTE = (id: number) => `/reclamacoes/${id}`;