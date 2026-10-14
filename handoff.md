* **Nome do Projeto:** **Bookhub** (ou Gamehub — Acervo de Jogos)
* **Natureza do Projeto:** Projeto avaliado do trimestre acadêmico (Trilha Intermediária).
* **Conceito Central:** Biblioteca digital para **aluguel e avaliação de JOGOS**, com busca na API externa RAWG, controle de estoque, aluguel/devolução e camada de avaliações/resenhas.

### 📋 REGRAS E DIRETRIZES OFICIAIS DO TRIMESTRE (ENUNCIADO):
1. **O Acervo & As Obras (JOGOS):**
   - O acervo escolhido no README é: **JOGOS**.
   - A ficha do item no banco se chama **`obras`**.
   - As rotas da API são padronizadas: `GET /obras` e `POST /emprestimos`.
2. **Integração com API Externa (RAWG):**
   - A página chama a nossa API local.
   - A API local consulta a **Search API da RAWG** (`https://api.rawg.io/api/games?key=...`), com a chave gratuita guardada no `.env` (fora do Git).
   - A API grava a ficha no banco local com `id_externo` (ID do jogo no RAWG) e só então mexe em estoque e aluguel.
   - **Regra de validação:** `titulo` vazio não vira cadastro. Ausência de estúdio ou ano **não impede a ficha** (podem ser nulos). A API externa jamais substitui o banco local.
3. **Categorias (Trilha Intermediária):**
   - Categoria é uma tabela no banco (**`categorias`**), e não texto solto.
   - A obra guarda a Chave Estrangeira em **`obras.categoria_id`**.
   - **Regra de Integridade:** Apagar uma categoria que ainda tenha obras ligadas a ela deve gerar erro de chave estrangeira que a API deve tratar (RESTRICT).
4. **Estoque, Aluguel e Devolução:**
   - `quantidade_disponivel` > 0 permite o aluguel.
   - Emprestar subtrai 1 unidade do estoque (`quantidade_disponivel - 1`).
   - Devolver adiciona 1 unidade (`quantidade_disponivel + 1`).
   - Se não houver exemplar disponível, a API responde **`400 Bad Request`**.
   - `valor_aluguel` é registrado no empréstimo. `valor_compra` fica apenas no cadastro da obra.
   - **Cálculo de Juros por Atraso:** Sem devolução e com a data prevista vencida, o status fica `atrasado` e a multa/juros é de **1% do valor do aluguel por dia**, com **juros simples** (sem juros sobre juros).
5. **Status do Empréstimo & Papéis (Cargos):**
   - Status fechados do empréstimo: `'emprestado'`, `'devolvido'`, `'atrasado'`.
   - Papéis no Domínio:
     - **Usuário (Leitor):** Consulta, aluga, devolve, avalia e registra progresso na estante. No ciclo avaliado (trilha intermediária): papel **`leitor`**.
     - **Gestor:** Altera estoque, disponibilidade e valor do aluguel. No ciclo: papel de referência (o `admin` absorve essas tarefas).
     - **Admin:** Gerencia categorias, usuários e estoque. No ciclo avaliado (trilha intermediária): papel **`admin`**.
   - Autenticação: Senha em hash (`senha_hash` com bcrypt) e token em sessões/JWT.

---

## 2. DIRETRIZ PEDAGÓGICA & PADRONIZAÇÃO DE IDIOMA

> 🚨 **REGRA DE OURO INEGOCIÁVEL:**  
> 1. **NÃO gere scripts SQL automáticos e NÃO faça pelo aluno.** Guie o Pedro passo a passo na interface do phpMyAdmin no Easypanel, explicando o porquê de cada campo e configuração.  
> 2. **PADRONIZAÇÃO TOTAL EM PORTUGUÊS:** Para atender à correção formal da banca e evitar mistura de idiomas (*Portinglês*), todas as tabelas e colunas foram e devem ser modeladas em **português** (`usuarios`, `obras`, `categorias`, `emprestimos`, etc.).

---

## 3. MODELAGEM RELACIONAL COMPLETA DO BANCO (EM PORTUGUÊS)

```
 [usuarios]
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── nome (VARCHAR 100, NOT NULL)
   ├── email (VARCHAR 255, NOT NULL, UNIQUE)
   ├── senha_hash (VARCHAR 255, NOT NULL)
   ├── papel (ENUM 'leitor', 'admin', DEFAULT 'leitor')
   ├── avatar_url (VARCHAR 255, NULL)
   └── criado_em (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

 [categorias] (Tabela Independente)
   ├── id (INT, PK, AUTO_INCREMENT)
   └── nome (VARCHAR 100, NOT NULL, UNIQUE)

 [obras] (Catálogo de Jogos - Ficha Oficial)
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── id_externo (VARCHAR 100, NULL) -- RAWG Game ID
   ├── titulo (VARCHAR 255, NOT NULL)
   ├── estudio (VARCHAR 150, NULL) -- Desenvolvedora / Estúdio
   ├── ano (SMALLINT, NULL)
   ├── categoria_id (INT, FK -> categorias.id, ON DELETE RESTRICT)
   ├── quantidade_disponivel (INT, NOT NULL, DEFAULT 0)
   ├── valor_aluguel (DECIMAL 10,2, NOT NULL, DEFAULT 0.00)
   ├── valor_compra (DECIMAL 10,2, NULL)
   ├── sinopse (TEXT, NULL)
   ├── capa_url (VARCHAR 255, NULL)
   └── criado_em (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

 [emprestimos] (Controle de Aluguéis)
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── usuario_id (INT, FK -> usuarios.id, ON DELETE RESTRICT)
   ├── obra_id (INT, FK -> obras.id, ON DELETE RESTRICT)
   ├── data_emprestimo (DATETIME, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
   ├── data_prevista (DATETIME, NOT NULL)
   ├── data_devolucao (DATETIME, NULL)
   ├── valor_aluguel (DECIMAL 10,2, NOT NULL)
   ├── valor_multa (DECIMAL 10,2, NOT NULL, DEFAULT 0.00)
   └── status (ENUM 'emprestado', 'devolvido', 'atrasado', DEFAULT 'emprestado')

 [avaliacoes] (Resenhas e Notas do Leitor - Camada Social)
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── usuario_id (INT, FK -> usuarios.id, ON DELETE CASCADE)
   ├── obra_id (INT, FK -> obras.id, ON DELETE CASCADE)
   ├── nota (TINYINT, NOT NULL) -- 1 a 5 estrelas
   ├── resenha (TEXT, NULL)
   ├── criado_em (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
   └── UNIQUE KEY (usuario_id, obra_id)

 [estante_usuario] (Progresso e Status de Leitura do Leitor)
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── usuario_id (INT, FK -> usuarios.id, ON DELETE CASCADE)
   ├── obra_id (INT, FK -> obras.id, ON DELETE CASCADE)
   ├── status_leitura (ENUM 'quero_ler', 'lendo', 'lido', 'abandonado')
   ├── pagina_atual (INT, NULL)
   ├── atualizado_em (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
   └── UNIQUE KEY (usuario_id, obra_id)
```

---

## 4. STATUS ATUAL & PONTO EXATO DE CONTINUAÇÃO

### Status do Banco no phpMyAdmin:
1. ✅ **Database ativa:** `bookhub_db` (`utf8mb4_unicode_ci`).
2. ✅ **Tabela `usuarios` criada:** `id` (PK, AI), `nome`, `email` (UNIQUE), `senha_hash`, `papel` (ENUM 'leitor','admin'), `avatar_url`, `criado_em`.
3. ✅ **Tabela `categorias` criada:** `id` (PK, AI), `nome` (UNIQUE).
4. ✅ **Tabela `obras` criada:** `id` (PK, AI), `id_externo`, `titulo`, `estudio`, `ano`, `categoria_id` (FK -> categorias.id), `quantidade_disponivel`, `valor_aluguel`, `valor_compra`, `sinopse`, `capa_url`.
5. ✅ **Tabela `emprestimos` criada:** `id` (PK, AI), `usuario_id`, `obra_id`, `data_emprestimo`, `data_prevista`, `data_devolucao`, `valor_aluguel`, `valor_multa`, `status`.
6. ⏳ **Em andamento:** Configuração das Foreign Keys de `emprestimos` e criação das tabelas sociais (`avaliacoes`).
