# 📘 MASTER HANDOFF DOCUMENT — PROJETO BOOKHUB
> **DOCUMENTO EXCLUSIVO PARA O MODELO DE IA (ANTIGRAVITY / GEMINI / LLM)**  
> **Destinatário:** A próxima instância de IA que atender o usuário Pedro Henrique neste repositório.  
> **Instrução Primária:** Leia este documento integralmente antes de emitir qualquer resposta. Ele contém todo o histórico técnico, decisões pedagógicas, estrutura do projeto, modelo relacional desenhado e o ponto cirúrgico de retomada da conversa.

---

## 1. PERFIL DO USUÁRIO & OBJETIVO DO PROJETO

* **Usuário:** Pedro Henrique.
* **Nome do Projeto:** **Bookhub**
* **Natureza do Projeto:** Acadêmico (será avaliado formalmente em uma disciplina/banca de faculdade).
* **Conceito Central:** Uma rede social literária e plataforma de resenhas e avaliação de livros, inspirada em plataformas consagradas como **Goodreads**, **Skoob** e **StoryGraph**.
* **Critérios de Rigor Acadêmico:**
  * O avaliador exigirá uma modelagem de banco de dados relacional sólida, normalizada (**1FN, 2FN e 3FN**).
  * Chaves Primárias bem estabelecidas, Chaves Estrangeiras (*Foreign Keys*) explícitas com integridade referencial (*ON DELETE / ON UPDATE*), índices de busca e *constraints* de unicidade.
  * Separação clara entre backend (API REST Node/Express) e frontend (Next.js).

---

## 2. DIRETRIZ PEDAGÓGICA MANDATÓRIA (LEIA COM ATENÇÃO!)

> 🚨 **REGRA DE OURO INEGOCIÁVEL:**  
> **NÃO escreva scripts SQL prontos para ele apenas colar, e NÃO crie as coisas por ele.**  
> 
> O usuário solicitou expressamente:  
> *"Gostaria que você fosse me ensinando passo a passo as etapas iniciais. Não quero que você faça pra mim. Tenha em mente que estou utilizando o phpMyAdmin no Easypanel."*  
> 
> **Seu papel é ser um tutor/mentor sênior:**  
> 1. Explique os conceitos e por que cada decisão importa para a nota acadêmica.  
> 2. Faça perguntas reflexivas para que ele pense e tome as decisões.  
> 3. Guie-o **campo por campo na interface gráfica do phpMyAdmin** (onde clicar, qual tipo selecionar, tamanho do campo, marcações de `A_I`, `Index`, `Null`, etc.).  
> 4. Valide o que ele fez antes de passar para a próxima tabela.

---

## 3. AMBIENTE & STACK TECNOLÓGICA

| Camada | Tecnologia | Detalhes & Configuração |
| :--- | :--- | :--- |
| **Banco de Dados** | **MySQL / MariaDB** | Gerenciado via **phpMyAdmin** hospedado em contêiner no **Easypanel**. |
| **Charset / Collation** | `utf8mb4_unicode_ci` | Essencial para suportar emojis em resenhas e títulos/autores de múltiplos alfabetos. |
| **Backend** | **Node.js + Express** | Configurado em `backend/`: drivers `mysql2` (com pool de conexões e Promises), `bcryptjs` para hash de senhas, `jsonwebtoken` para autenticação JWT, `cloudinary` para uploads. |
| **Frontend** | **Next.js 15 (Pages Router) + React 19** | Configurado em `frontend/`: CSS Modules, suporte a Dark/Light Theme (`ThemeToggle.js`), ícones `lucide-react`, `axios` com interceptors centralizados. |
| **DevOps / Infra** | **Docker & Docker Compose** | Arquivos `Dockerfile`, `Dockerfile.dev` e `docker-compose.yml` ajustados e limpos. |

---

## 4. HISTÓRICO INTEGRAL DE TODAS AS SESSÕES

### 📜 Sessão 1 — Conceituação e Planejamento Arquitetural (Conversa ID: `6450bad5-eafc-4d0a-ac0e-f68ac51a77ee`)
1. **APIs Públicas de Livros:**
   - O usuário perguntou sobre APIs gratuitas.
   - Foram analisadas a **Google Books API** (melhor para metadados, capas, títulos em português e ISBN) e a **Open Library** (boa para domínio aberto). Concluiu-se que o sistema pode tanto consumir API externa quanto manter seu próprio catálogo persistido no banco local.
2. **Benchmark de Funcionalidades (Goodreads, Skoob, StoryGraph):**
   - Foram mapeadas as funcionalidades que o Bookhub deve ter para se destacar como projeto acadêmico de rede social literária:
     - Cadastro e busca de livros e autores.
     - Estante do leitor com 4 estados clássicos: *Quero Ler*, *Lendo*, *Lido* e *Abandonado*.
     - Avaliações com notas (estrelas de 1 a 5) e resenhas críticas textuais.
     - Interação social: comentários nas resenhas de outros leitores e likes/curtidas.
     - Perfis de usuário com bio, foto/avatar e histórico de leituras.
3. **Decisão sobre a Modelagem do Banco:**
   - O usuário expressou que o banco precisa ser muito bem estruturado e com boas práticas.
   - Foi acordado que o projeto começaria do zero no banco, modelando tabela por tabela de acordo com as regras de normalização.
4. **Execução do Passo 1 (Criar a Base):**
   - Criação da base de dados no phpMyAdmin com o nome `bookhub_db` e agrupamento `utf8mb4_unicode_ci`.
5. **Início do Passo 2 (Primeira Tabela: `users`):**
   - Explicada a regra de ouro de bancos relacionais: **tabelas independentes são criadas primeiro**, tabelas que dependem de chaves estrangeiras são criadas depois.

---

### 📜 Sessão 2 — Limpeza Profunda do Boilerplate (Conversa ID: `bfa5d13c-7c2e-4a38-a582-3a2920246afa`)
O repositório atual foi iniciado copiando arquivos de um projeto anterior ("Aura8", um sistema multi-empresa de chatbot contábil). O usuário pediu para limpar 100% de tudo referente ao Aura8, mantendo a stack e dependências intactas como modelo base.

**Ações de limpeza executadas e validadas:**
1. **`frontend/Dockerfile`**: Comentário atualizado de Front-Aura8 para Bookhub.
2. **`frontend/docker-compose.yml`**: Serviços `front-aura8` e `front-aura8-dev` renomeados para `frontend` e `frontend-dev`; rede renomeada para `frontend-network`.
3. **`frontend/components/menu/Header.js`**:
   - Removida logo do Aura8 (`/img/logo-aura8-*.png`) e substituída pela tipografia Bookhub com classe `.logoText`.
   - Removida importação de `EditProfileModal` (arquivo que não existia no repositório e quebrava compilações).
   - Removidas rotas e botões específicos de atendimento/chatbot (`/chat`).
   - Removida toda a lógica multi-tenant de empresas (`companyName`, `selectedCompany`, `handleChangeCompany`).
   - `handleLogout` limpo para remover apenas `token` e `userData`.
4. **`frontend/components/menu/Header.module.css`**: Adicionada a estilização para a classe `.logoText`.
5. **`frontend/pages/index.js`**: A landing page inteira de chatbot contábil do Aura8 foi substituída por uma landing page base do **Bookhub** com hero section, cards explicativos da estante, avaliações, resenhas e comunidade literária.
6. **`frontend/pages/_app.js`**: Título alterado de Aura8 para `Bookhub` e tags antigas limpas.
7. **`frontend/utils/auth.js`**: Removidos métodos legados `changeCompany` e `updateCompanyData`.
8. **Encerramento de processos e cache**:
   - Um processo Node antigo rodando em segundo plano (`next start` na porta 3000) servindo o cache `.next` legado foi encerrado.
   - O diretório `frontend/.next` foi excluído para evitar servir versões antigas.
   - Varredura completa confirmou: **0 ocorrências de termos do Aura8 em todo o workspace**.

---

## 5. MODELAGEM COMPLETA DO BANCO DE DADOS (VISÃO DO ARQUITETO)

Para nortear o seu ensino passo a passo com o Pedro Henrique, abaixo está o esquema relacional planejado para o Bookhub:

```
+---------------------------------------------------------------------------------+
|                                 ESQUEMA RELACIONAL                              |
+---------------------------------------------------------------------------------+

 [users] (Tabela Independente)
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── full_name (VARCHAR 100)
   ├── email (VARCHAR 255, UNIQUE)
   ├── password_hash (VARCHAR 255)
   ├── avatar_url (VARCHAR 255, NULL)
   ├── bio (TEXT, NULL)
   ├── role (ENUM 'user', 'admin' - default 'user')
   └── created_at (TIMESTAMP, default CURRENT_TIMESTAMP)

 [authors] (Tabela Independente)
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── name (VARCHAR 150)
   ├── bio (TEXT, NULL)
   ├── photo_url (VARCHAR 255, NULL)
   └── created_at (TIMESTAMP)

 [genres] (Tabela Independente)
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── name (VARCHAR 50, UNIQUE) -- ex: Ficção Científica, Romance, Fantasia
   └── slug (VARCHAR 50, UNIQUE)

 [books] (Depende de authors)
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── author_id (INT, FK -> authors.id)
   ├── title (VARCHAR 255)
   ├── isbn (VARCHAR 20, NULL, UNIQUE)
   ├── description (TEXT, NULL)
   ├── cover_url (VARCHAR 255, NULL)
   ├── page_count (INT, NULL)
   ├── publish_year (SMALLINT, NULL)
   └── created_at (TIMESTAMP)

 [book_genres] (Tabela Associativa N:N - 3FN pura)
   ├── book_id (INT, FK -> books.id, ON DELETE CASCADE)
   └── genre_id (INT, FK -> genres.id, ON DELETE CASCADE)
   └── PRIMARY KEY (book_id, genre_id)

 [user_books] / [reading_shelf] (Estante do Usuário - N:N com atributos)
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── user_id (INT, FK -> users.id, ON DELETE CASCADE)
   ├── book_id (INT, FK -> books.id, ON DELETE CASCADE)
   ├── status (ENUM 'quero_ler', 'lendo', 'lido', 'abandonado')
   ├── current_page (INT, NULL)
   ├── started_at (DATE, NULL)
   ├── finished_at (DATE, NULL)
   ├── updated_at (TIMESTAMP)
   └── UNIQUE KEY (user_id, book_id) -- Usuário só pode ter um registro por livro na estante

 [reviews] (Avaliações / Resenhas)
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── user_id (INT, FK -> users.id, ON DELETE CASCADE)
   ├── book_id (INT, FK -> books.id, ON DELETE CASCADE)
   ├── rating (TINYINT - CHECK between 1 and 5)
   ├── title (VARCHAR 150, NULL)
   ├── review_text (TEXT, NULL)
   ├── contains_spoilers (BOOLEAN, default 0)
   ├── created_at (TIMESTAMP)
   └── UNIQUE KEY (user_id, book_id) -- Uma resenha oficial por usuário para cada livro

 [comments] (Comentários nas Resenhas - Social)
   ├── id (INT, PK, AUTO_INCREMENT)
   ├── review_id (INT, FK -> reviews.id, ON DELETE CASCADE)
   ├── user_id (INT, FK -> users.id, ON DELETE CASCADE)
   ├── comment_text (TEXT)
   └── created_at (TIMESTAMP)

 [review_likes] (Curtidas nas Resenhas - N:N)
   ├── user_id (INT, FK -> users.id, ON DELETE CASCADE)
   ├── review_id (INT, FK -> reviews.id, ON DELETE CASCADE)
   ├── created_at (TIMESTAMP)
   └── PRIMARY KEY (user_id, review_id)
```

---

## 6. ONDE PARAMOS EXATAMENTE & STATUS ATUAL

### Status do Banco de Dados no phpMyAdmin:
1. ✅ **Database criada:** `bookhub_db` com collation `utf8mb4_unicode_ci`.
2. ✅ **Tabela `users` criada:** `id` (PK, AI), `full_name` (VARCHAR 100), `email` (VARCHAR 255, UNIQUE), `password_hash` (VARCHAR 255), `avatar_url` (VARCHAR 255, NULL), `created_at` (TIMESTAMP).
3. ✅ **Tabela `authors` criada:** `id` (PK, AI), `name` (VARCHAR 150), `bio` (TEXT), `photo_url` (VARCHAR 255, NULL).
4. ⏳ **Em andamento:** Passo 4 — Tabela `genres` (Gêneros literários).

---

## 7. COMO A IA DEVE SE PORTAR AO INICIAR A SESSÃO EM CASA

Assim que o usuário disser algo como:
> *"Pode continuar de onde paramos?"* ou *"Leia o handoff e vamos continuar"*

**Você deve:**
1. Cumprimentá-lo de forma calorosa e confirmar que leu o `handoff.md`.
2. Confirmar que `users` e `authors` já estão criadas.
3. Retomar diretamente a tabela que estiver em andamento (Passo 4: `genres` ou Passo 5: `books`).
