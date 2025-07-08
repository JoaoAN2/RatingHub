# 🎬 Rating HUB

Projeto desenvolvido para a disciplina de Banco de Dados: uma REST API para avaliação de filmes e séries.

## 🎓 Alunos

- João Augusto Do Nascimento
- Allan Custódio Diniz Marques

## 💡 Sobre o Projeto

O Rating HUB é uma API RESTful construída para gerenciar e servir dados sobre obras audiovisuais como filmes e séries. Usuários podem se cadastrar, avaliar obras, comentar e interagir com avaliações de outros usuários. O sistema foi projetado com uma estrutura de banco de dados relacional e utiliza as tecnologias mais modernas no ecossistema Node.js.

### 🛠️ Principais Ferramentas e Tecnologias

- **Node.js:** Ambiente de execução JavaScript no servidor.
- **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
- **Express:** Framework para construção de APIs em Node.js.
- **Prisma:** ORM (Object-Relational Mapper) de última geração para Node.js e TypeScript.
- **PostgreSQL:** Banco de dados relacional utilizado para persistência dos dados.
- **JWT (JSON Web Tokens):** Para autenticação e autorização baseada em tokens.
- **JOI:** Biblioteca para validação de esquemas e dados.

## 🚀 Como Iniciar o Projeto

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento localmente.

### ✅ Pré-requisitos

- **Node.js:** Versão `22.x` ou superior.
- **PostgreSQL:** É necessário ter uma instância do PostgreSQL rodando em sua máquina.

### 📋 Passo a Passo

1.  **Clone o Repositório** 📂

    ```bash
    git clone https://github.com/JoaoAN2/RatingHub.git
    cd RatingHub
    ```

2.  **Instale as Dependências** 📦
    Execute o comando abaixo para instalar todos os pacotes necessários do projeto.

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente** 📝
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.

    ```bash
    cp .env.example .env
    ```

    Depois, abra o arquivo `.env` e atualize a variável `DATABASE_URL` com as suas credenciais do PostgreSQL.

    _Exemplo:_

    ```env
    # Altere "username", "password" e, se necessário, a porta e o nome do banco.
    DATABASE_URL="postgresql://username:password@localhost:5432/ratinghub"
    ```

4.  **Sincronize o Banco de Dados com o Prisma** 🗄️
    Este comando irá criar e aplicar as migrações do Prisma no seu banco de dados, garantindo que ele esteja com a estrutura mais recente definida no `schema.prisma`. Ele também gera o Prisma Client automaticamente.

    ```bash
    npx prisma migrate dev
    ```

5.  **Inicie o Servidor** ▶️
    Com tudo configurado, rode o projeto em modo de desenvolvimento.
    ```bash
    npm run dev
    ```

## 💾 Schema do Banco de Dados (Prisma)

O esquema abaixo define a estrutura do banco de dados, incluindo todas as tabelas, colunas e relacionamentos.

### Modelos Principais

#### 🎭 `Obra`

O modelo central que representa uma obra audiovisual (filme ou episódio de série).

```prisma
model Obra {
  id_obra    Int           @id @default(autoincrement())
  titulo     String        @db.VarChar(255)
  sinopse    String
  lancamento DateTime      @db.Date
  tipo_obra  TiposObraEnum // FILME, SERIE, EPISODIO
  avaliacao  Avaliacao[]
  episodio   Episodio[]
  filme      Filme?
  serie      Serie[]
}
```

#### 👤 `Usuario`

Representa um usuário do sistema, que pode ter diferentes papéis.

```prisma
model Usuario {
  id_usuario        Int                @id @default(autoincrement())
  nome_usuario      String             @db.VarChar(100)
  email             String             @unique @db.VarChar(150)
  senha             String             @db.VarChar(512)
  tipo_usuario      PapelUsuarioEnum?  @default(NORMAL) // GESTOR, CRITICO, NORMAL
  avaliacao         Avaliacao[]
  curtida_avaliacao CurtidaAvaliacao[]
}
```

#### 🌟 `Avaliacao`

Armazena a avaliação (nota e comentário) de um usuário para uma determinada obra.

```prisma
model Avaliacao {
  id_obra             Int
  id_usuario          Int
  nota                Int
  comentario          String             @db.VarChar(512)
  data_hora_avaliacao DateTime?          @default(now())
  obra                Obra               @relation(fields: [id_obra], references: [id_obra])
  usuario             Usuario            @relation(fields: [id_usuario], references: [id_usuario])
  curtida_avaliacao   CurtidaAvaliacao[]

  @@id([id_obra, id_usuario])
}
```

### Modelos de Relacionamento e Específicos

#### 🎥 `Filme`

Especialização do modelo `Obra` para filmes, com relação a uma franquia.

```prisma
model Filme {
  id_franquia Int
  edicao      Int
  id_obra     Int      @unique
  franquia    Franquia @relation(fields: [id_franquia], references: [id_franquia])
  obra        Obra     @relation(fields: [id_obra], references: [id_obra])

  @@id([id_franquia, edicao])
}
```

#### 📺 `Serie` e `Episodio`

Modelos para representar séries e seus respectivos episódios.

```prisma
model Serie {
  id_serie Int  @id @default(autoincrement())
  id_obra  Int
  obra     Obra @relation(fields: [id_obra], references: [id_obra])
}

model Episodio {
  id_serie        Int
  temporada       Int
  numero_episodio Int
  id_obra         Int
  obra            Obra @relation(fields: [id_obra], references: [id_obra])

  @@id([id_serie, temporada, numero_episodio])
}
```

#### 🔗 `Franquia`

Agrupa filmes que pertencem à mesma franquia.

```prisma
model Franquia {
  id_franquia Int     @id @default(autoincrement())
  nome        String  @db.VarChar(255)
  filme       Filme[]
}
```

#### 👍 `CurtidaAvaliacao`

Permite que usuários curtam as avaliações de outros usuários.

```prisma
model CurtidaAvaliacao {
  id_obra_avaliada     Int
  id_usuario_avaliador Int
  id_usuario_curtidor  Int
  avaliacao            Avaliacao @relation(fields: [id_obra_avaliada, id_usuario_avaliador], references: [id_obra, id_usuario])
  usuario              Usuario   @relation(fields: [id_usuario_curtidor], references: [id_usuario])

  @@id([id_obra_avaliada, id_usuario_avaliador, id_usuario_curtidor])
}
```

### 🏷️ Enums

Tipos enumerados para papéis de usuário e tipos de obra.

```typescript
enum PapelUsuarioEnum {
  GESTOR
  CRITICO
  NORMAL
}

enum TiposObraEnum {
  SERIE
  EPISODIO
  FILME
}
```

## 🔗 Rotas da API (Endpoints)

A seguir estão as principais rotas disponíveis na API, com detalhes sobre os métodos HTTP e as permissões de acesso necessárias. A URL base para todas as rotas é `/v1`.

### 🔑 Rotas de Autenticação (`/auth`)

- `POST /register`: Registra um novo usuário no sistema.
- `POST /login`: Autentica um usuário e retorna um token JWT.

### 👥 Rotas de Usuário (`/usuarios`)

- **Permissões:** A maioria das rotas de usuário requer autenticação. A modificação e exclusão são restritas aos gestores.
- `GET /`: Lista todos os usuários.
- `POST /`: Cria um novo usuário (Requer autenticação: `GESTOR`).
- `GET /:userId`: Retorna um usuário específico.
- `PATCH /:userId`: Atualiza os dados de um usuário (Requer permissão: `GESTOR`).
- `DELETE /:userId`: Remove um usuário (Requer permissão: `GESTOR`).

### 📚 Rotas de Obras (`/obras`)

- **Permissões:** Apenas `GESTOR` pode criar, atualizar ou deletar obras. A listagem é pública.
- `GET /`: Lista todas as obras com filtros (`titulo`, `tipo_obra`) e paginação (`limit`, `page`, `sortBy`, `sortType`).
- `POST /`: Cadastra uma nova obra (Requer permissão: `GESTOR`).
- `GET /:idObra`: Retorna uma obra específica pelo seu ID.
- `PATCH /:idObra`: Atualiza os dados de uma obra (Requer permissão: `GESTOR`).
- `DELETE /:idObra`: Remove uma obra (Requer permissão: `GESTOR`).

### 🎥 Rotas de Franquia (`/franquias`)

- **Permissões:** Apenas `GESTOR` pode gerenciar franquias.
- `GET /`: Lista todas as franquias.
- `POST /`: Cria uma nova franquia (Requer permissão: `GESTOR`).
- `GET /:idFranquia`: Retorna uma franquia específica.
- `PATCH /:idFranquia`: Atualiza os dados de uma franquia (Requer permissão: `GESTOR`).
- `DELETE /:idFranquia`: Remove uma franquia (Requer permissão: `GESTOR`).

### 🎞️ Rotas de Filme (`/filmes`)

- **Permissões:** Apenas `GESTOR` pode gerenciar filmes.
- `GET /`: Lista todos os filmes.
- `POST /`: Cria um novo filme (Requer permissão: `GESTOR`).
- `GET /:idFranquia/:edicao`: Retorna um filme específico pela chave composta de franquia e edição.
- `PATCH /:idFranquia/:edicao`: Atualiza os dados de um filme (Requer permissão: `GESTOR`).
- `DELETE /:idFranquia/:edicao`: Remove um filme (Requer permissão: `GESTOR`).

### 🍿 Rotas de Série (`/series`)

- **Permissões:** Apenas `GESTOR` pode gerenciar séries.
- `GET /`: Lista todas as séries.
- `POST /`: Cria uma nova série (Requer permissão: `GESTOR`).
- `GET /:idSerie`: Retorna uma série específica.
- `PATCH /:idSerie`: Atualiza os dados de uma série (Requer permissão: `GESTOR`).
- `DELETE /:idSerie`: Remove uma série (Requer permissão: `GESTOR`).

### 🎬 Rotas de Episódio (`/episodios`)

- **Permissões:** Apenas `GESTOR` pode gerenciar episódios.
- `GET /`: Lista todos os episódios.
- `POST /`: Cria um novo episódio (Requer permissão: `GESTOR`).
- `GET /:id_serie/:temporada/:numero_episodio`: Retorna um episódio específico.
- `PATCH /:id_serie/:temporada/:numero_episodio`: Atualiza os dados de um episódio (Requer permissão: `GESTOR`).
- `DELETE /:id_serie/:temporada/:numero_episodio`: Remove um episódio (Requer permissão: `GESTOR`).

### ⭐ Rotas de Avaliação (`/avaliacoes`)

- **Permissões:** Usuários com papel `NORMAL` ou `CRITICO` podem criar, atualizar, deletar e interagir com avaliações. A listagem de avaliações de uma obra é pública.
- `POST /`: Cria uma nova avaliação para uma obra (Requer autenticação: `NORMAL`, `CRITICO`).
- `GET /obra/:idObra`: Lista todas as avaliações de uma obra específica.
- `PATCH /obra/:idObra`: Atualiza a avaliação do usuário logado para uma obra específica (Requer autenticação: `NORMAL`, `CRITICO`).
- `DELETE /obra/:idObra`: Deleta a avaliação do usuário logado para uma obra específica (Requer autenticação: `NORMAL`, `CRITICO`).
- `POST /curtir`: Adiciona uma curtida a uma avaliação (Requer autenticação: `NORMAL`, `CRITICO`).
- `DELETE /curtir`: Remove a curtida de uma avaliação (Requer autenticação: `NORMAL`, `CRITICO`).
