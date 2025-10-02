export const LOGIN_ROUTE = () => '/login';
export const REGISTER_ROUTE = () => '/usuarios';
export const USUARIO_ROUTE = (id: number) => `/usuarios/${id}`;
export const DESATIVAR_CONTA_ROUTE = () => '/desativar_conta';
export const ATUALIZAR_TOKEN_ROUTE = () => '/atualizar_token';
export const ESQUECI_SENHA_ROUTE = () => '/esqueci_a_senha';
export const RECLAMACOES_ROUTE = () => '/reclamacoes';
export const RECLAMACOES_BY_USER_ROUTE = (usuarioId: number) => `/usuarios/${usuarioId}/reclamacoes`;
export const RECLAMACAO_ROUTE = (id: number) => `/reclamacoes/${id}`;