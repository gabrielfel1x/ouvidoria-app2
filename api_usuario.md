## Ouvidoria API — Documentação de Endpoints do Usuário (cidadão)

Esta documentação cobre as rotas destinadas ao usuário final (não administrador). Inclui autenticação, cadastro, gerenciamento de reclamações e ocorrências, listagem de respostas, avaliação de satisfação e utilidades.

### Base URL
- Desenvolvimento: `http://localhost:3000`

### Autenticação e Autorização
- A API usa JWT assinado com HS256.
- Para endpoints protegidos, envie o token no header `token` (exatamente esse nome, sem `Bearer`).
  - Exemplo: `token: <jwt_gerado_no_login>`
- Endpoints públicos (não exigem `token`):
  - `POST /login`
  - `POST /esqueci_a_senha` (requer header especial, ver abaixo)
  - `POST /usuarios` (cadastro)
  - `GET /versao`

### Regras de autorização por recurso
- A maioria dos endpoints valida que o usuário autenticado só acesse seus próprios dados.
- Essa verificação acontece comparando o `usuario_id` presente no recurso/rota com o `usuario_id` codificado no token.

---

## Autenticação e Conta

### POST /login
Autentica o usuário por `cpf` ou `email` e `senha`.

- Corpo (JSON):
```json
{
  "cpf_ou_email": "12345678901",
  "senha": "minha_senha"
}
```

- Respostas:
  - 200 OK (sucesso e conta ativa):
  ```json
  {
    "id": 1,
    "nome": "Fulano",
    "email": "fulano@email.com",
    "telefone": "",
    "endereco": "",
    "bairro": "",
    "cpf": "12345678901",
    "ativo": true,
    "token": "<jwt>"
  }
  ```
  - 200 OK (usuário desativado):
  ```json
  { "erro": "Usuário está desativado. Para maiores informações entre contato pelo email contatoouvidoriamovel@gmail.com" }
  ```
  - 200 OK (credenciais inválidas):
  ```json
  { "erro": "Usuário não encontrado" }
  ```

Notas:
- Campos sensíveis (`senha`, `token_cel`, `token_api`, timestamps) não são retornados no objeto do usuário.
- Use o valor de `token` retornado em headers `token` para chamadas subsequentes protegidas.

### POST /usuarios (Cadastro)
Cria um usuário.

- Corpo permitido (JSON):
```json
{
  "nome": "Fulano",
  "email": "fulano@email.com",
  "telefone": "11999999999",
  "endereco": "Rua X, 123",
  "bairro": "Centro",
  "senha": "minha_senha",
  "token_cel": "<opcional>",
  "cpf": "12345678901",
  "ativo": true,
  "token_api": "<opcional>"
}
```

- Respostas:
  - 200 OK (sucesso): retorna o usuário sem campos sensíveis (mesma estrutura do login, sem `token`).
  - 422 Unprocessable Entity (erros de validação):
  ```json
  { "cpf": ["Já existe uma conta para esse CPF"] }
  ```

### GET /usuarios/:id
Obtém os dados do usuário autenticado. Requer header `token` e o `:id` deve ser o próprio usuário.

- Resposta 200 OK:
```json
{
  "id": 1,
  "nome": "Fulano",
  "email": "fulano@email.com",
  "telefone": "11999999999",
  "endereco": "Rua X, 123",
  "bairro": "Centro",
  "cpf": "12345678901",
  "ativo": true
}
```

### PUT/PATCH /usuarios/:id
Atualiza os dados do próprio usuário. Requer header `token` e `:id` do próprio usuário.

- Corpo permitido: mesmos campos do cadastro (qualquer subconjunto).
- Resposta 200 OK: retorna o usuário atualizado (sem campos sensíveis).
- 422 em caso de validação.

### DELETE /usuarios/:id
Remove a conta do próprio usuário. Requer header `token`.
- Resposta: sem corpo (204/200, conforme ambiente).

### POST /desativar_conta
Desativa a conta do usuário (mantém registro com `ativo=false`). Requer header `token`.

- Corpo (JSON):
```json
{ "usuario_id": 1 }
```
- Respostas:
  - 200 OK: `{ "retorno": "ok" }`
  - 200 OK (falha): `{ "retorno": "Não foi possível desativar a conta" }`

### POST /atualizar_token
Atualiza o `token_cel` do usuário (usado para push). Requer header `token`.

- Corpo (JSON):
```json
{ "usuario_id": 1, "token_cel": "<novo_token_notificacao>" }
```
- Resposta 200 OK:
```json
{ "retorno": "Token Atualizado" }
```

### POST /esqueci_a_senha
Dispara e-mail de recuperação de senha. Não usa JWT, mas exige header especial `token: esqueci_a_senha`.

- Headers:
  - `token: esqueci_a_senha`
- Corpo (JSON):
```json
{ "email": "fulano@email.com" }
```
- Respostas 200 OK:
  - Sucesso: `{ "retorno": "Email enviado" }`
  - Email não encontrado: `{ "erro": "Email não encontrado" }`

---

## Reclamações

Recursos principais: `reclamacoes`. O `numero_protocolo` é gerado automaticamente na criação.

Campos (schema):
- `numero_protocolo`, `descricao`, `data` (date), `endereco`, `localizacao`, `imagem` (string/base64), `status` (default: "Em Aberto"), `categoria_id`, `usuario_id`, `satisfacao_do_usuario`.

Representação JSON padrão (em várias respostas) inclui:
- `imagem`: URL derivada do upload (campo calculado)
- `usuario`: `{ id, nome }`
- `categoria`: `{ id, nome }`

### GET /usuarios/:usuario_id/reclamacoes
Lista as reclamações do usuário autenticado.
- Requer header `token` e `:usuario_id` deve ser do usuário do token.
- Resposta 200 OK (exemplo de item):
```json
{
  "id": 10,
  "numero_protocolo": "1717000123",
  "descricao": "Buraco na rua",
  "data": "2025-09-24",
  "endereco": "Rua X, 123",
  "localizacao": "-23.5,-46.6",
  "imagem": "https://res.cloudinary.com/.../image.jpg",
  "status": "Em Aberto",
  "categoria_id": 3,
  "usuario_id": 1,
  "created_at": "2025-09-24T02:30:00Z",
  "updated_at": "2025-09-24T02:30:00Z",
  "categoria": { "id": 3, "nome": "Vias Públicas" }
}
```

### GET /reclamacoes/:id
Exibe uma reclamação específica do próprio usuário. Requer header `token`.
- Resposta 200 OK: representação JSON completa da reclamação (inclui `usuario` e `categoria`).

### POST /reclamacoes
Cria uma reclamação.
- Requer header `token`.
- Corpo permitido (JSON):
```json
{
  "descricao": "Texto",
  "data": "2025-09-24",
  "endereco": "Rua X, 123",
  "localizacao": "-23.5,-46.6",
  "status": "Em Aberto",
  "categoria_id": 3,
  "usuario_id": 1,
  "imagem": "<base64 opcional>",
  "satisfacao_do_usuario": null
}
```
- Respostas:
  - 201 Created: objeto da reclamação (com `numero_protocolo` gerado e `imagem` como URL quando aplicável).
  - 422 em caso de validação.

### PUT/PATCH /reclamacoes/:id
Atualiza uma reclamação do próprio usuário. Requer header `token`.
- Corpo: mesmos campos permitidos do `POST`.
- Resposta 200 OK: objeto atualizado.

### DELETE /reclamacoes/:id
Exclui uma reclamação do próprio usuário.
- Resposta: sem corpo.

### GET /reclamacoes/search?protocolo=XXXX
Busca reclamações por número de protocolo. Requer header `token`.
- Resposta 200 OK: array de reclamações que batem com o padrão.

### GET /reclamacoes/all[?status=Em%20Aberto]
Lista todas as reclamações (público amplo; requer `token`). Útil para listagens gerais.
- Resposta 200 OK: array de reclamações.

### GET /reclamacoes/nolocation[?status=...]  
Retorna contagem de reclamações sem `localizacao` (pode ser útil para métricas no app).
- Resposta 200 OK: número.

### GET /reclamacoes/last
Últimas 5 reclamações criadas.
- Resposta 200 OK: array com até 5 itens.

### POST /reclamacoes/salvar_satisfacao_do_usuario
Salva a satisfação do usuário para uma reclamação. Requer header `token` e ser dono da reclamação.
- Corpo (JSON):
```json
{ "reclamacao_id": 10, "satisfacao_do_usuario": "Satisfeito" }
```
- Respostas 200 OK:
  - `{ "retorno": "ok" }`
  - `{ "retorno": "erro" }`

### GET /reclamacoes/:reclamacao_id/respostas
Lista respostas da administração para uma reclamação do usuário. Requer header `token`.
- Resposta 200 OK (exemplo de item):
```json
{
  "id": 99,
  "data": "2025-09-25",
  "descricao": "Sua demanda está em andamento",
  "reclamacao_id": 10,
  "administrador_id": 2,
  "created_at": "2025-09-25T12:00:00Z",
  "updated_at": "2025-09-25T12:00:00Z"
}
```

---

## Ocorrências

Recursos principais: `ocorrencias`. O `numero_protocolo` é gerado automaticamente.

Campos (schema):
- `numero_protocolo`, `tipo`, `setor`, `data` (date), `assunto`, `detalhes`, `status` (default: "Em Aberto"), `usuario_id`, `satisfacao_do_usuario`.

### GET /usuarios/:usuario_id/ocorrencias[?tipo=...] 
Lista as ocorrências do usuário autenticado. Requer header `token`.
- Quando presente `tipo`, filtra pelo tipo e inclui `usuario` básico (`{ id, nome }`) na resposta.
- Resposta 200 OK: array de ocorrências.

### GET /ocorrencias/:id
Exibe uma ocorrência específica do próprio usuário. Requer header `token`.
- Resposta 200 OK: objeto da ocorrência.

### POST /ocorrencias
Cria uma ocorrência.
- Requer header `token`.
- Corpo permitido (JSON):
```json
{
  "tipo": "Iluminação",
  "setor": "Serviços",
  "data": "2025-09-24",
  "assunto": "Poste apagado",
  "detalhes": "Poste da Rua Y sem luz",
  "status": "Em Aberto",
  "usuario_id": 1,
  "satisfacao_do_usuario": null
}
```
- Respostas:
  - 201 Created: objeto da ocorrência (com `numero_protocolo` gerado).
  - 422 em caso de validação.

### PUT/PATCH /ocorrencias/:id
Atualiza uma ocorrência do próprio usuário. Requer header `token`.
- Corpo: mesmos campos do `POST` (qualquer subconjunto).
- Resposta 200 OK: objeto atualizado.

### DELETE /ocorrencias/:id
Exclui uma ocorrência do próprio usuário.
- Resposta: sem corpo.

### GET /ocorrencias/search?protocolo=XXXX
Busca ocorrências por número de protocolo. Requer header `token`.
- Resposta 200 OK: array de ocorrências.

### GET /ocorrencias/all[?status=Em%20Aberto][&tipo=...]
Lista todas as ocorrências (pode ser usado em visões gerais do app). Requer header `token`.
- Resposta 200 OK: array; quando usado no backend, os itens vêm com `{ usuario: { id, nome } }` incluído.

### POST /ocorrencias/salvar_satisfacao_do_usuario
Salva a satisfação do usuário para uma ocorrência. Requer header `token` e ser dono da ocorrência.
- Corpo (JSON):
```json
{ "ocorrencia_id": 20, "satisfacao_do_usuario": "Muito satisfeito" }
```
- Respostas 200 OK: `{ "retorno": "ok" }` ou `{ "retorno": "erro" }`.

### GET /ocorrencias/:ocorrencia_id/respostas_ocorrencia
Lista respostas da administração para uma ocorrência do usuário. Requer header `token`.
- Resposta 200 OK (exemplo de item):
```json
{
  "id": 77,
  "data": "2025-09-25",
  "descricao": "Equipe a caminho",
  "ocorrencia_id": 20,
  "administrador_id": 2,
  "created_at": "2025-09-25T12:00:00Z",
  "updated_at": "2025-09-25T12:00:00Z"
}
```

---

## Utilidades

### GET /versao
Sem autenticação. Retorna versão e status de manutenção.

- Resposta 200 OK:
```json
{ "versao": "1", "manutencao": false }
```

---

## Erros e Status Codes
- 200 OK: sucesso geral.
- 201 Created: criação de recurso.
- 204 No Content: deleção sem corpo (pode variar para 200 conforme ambiente).
- 401/403: quando o header `token` está ausente/ inválido ou o usuário tenta acessar recurso de outro usuário (o backend pode retornar erro genérico com exceção; trate como não autorizado).
- 422 Unprocessable Entity: erros de validação.

## Cabeçalhos Importantes
- `token`: JWT para autenticação (exigido na maioria dos endpoints).
- `Content-Type: application/json`
- Para `POST /esqueci_a_senha`: `token: esqueci_a_senha` (especial, sem JWT).

## Observações de Implementação no Front
- Após `POST /login`, persista o `token` e o `id` do usuário. Inclua `token` em todas as chamadas protegidas.
- Em rotas aninhadas com `:usuario_id`, sempre use o ID do usuário autenticado (do token). O backend rejeita se houver divergência.
- Upload de imagem em `POST /reclamacoes` aceita base64 no campo `imagem`; a resposta retorna a URL pública processada.
- Campos `numero_protocolo` são gerados automaticamente pelo backend.


