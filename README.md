# 🎬 Rating HUB

Projeto desenvolvido para a disciplina de Banco de Dados: uma REST API para avaliação de filmes e séries.

## 🎓 Alunos

- João Augusto Do Nascimento
- Allan Custódio Diniz Marques
- Pedro Henrique Mansano Franzin
- Luis Felipe Gomes
- Orlando Seiti Enokida Junior

## 💡 Sobre o Projeto

O Rating HUB é uma API RESTful construída para gerenciar e servir dados sobre obras audiovisuais como filmes e séries. Usuários podem se cadastrar, avaliar obras, comentar e interagir com avaliações de outros usuários. O sistema foi projetado com uma estrutura de banco de dados relacional e utiliza as tecnologias mais modernas no ecossistema Node.js.

### 🛠️ Principais Ferramentas e Tecnologias

-   **Node.js:** Ambiente de execução JavaScript no servidor.
-   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
-   **Express:** Framework para construção de APIs em Node.js.
-   **Prisma:** ORM (Object-Relational Mapper) de última geração para Node.js e TypeScript.
-   **PostgreSQL:** Banco de dados relacional utilizado para persistência dos dados.
-   **JWT (JSON Web Tokens):** Para autenticação e autorização baseada em tokens.
-   **JOI:** Biblioteca para validação de esquemas e dados.

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

A seguir estão as principais rotas disponíveis na API.

### 📚 Rotas de Obras

-   `GET /obras`: Lista todas as obras com filtros e paginação.
-   `GET /obras/:idObra`: Retorna uma obra específica pelo seu ID.
-   `POST /obras`: Cadastra uma nova obra.
-   `PATCH /obras/:idObra`: Atualiza os dados de uma obra.
-   `DELETE /obras/:idObra`: Remove uma obra.

### 🔑 Rotas de Autenticação

-   `POST /auth/login`: Autentica um usuário e retorna um token JWT.
-   `POST /auth/register`: Registra um novo usuário no sistema.

### 👥 Rotas de Usuário

-   `GET /usuarios`: Lista todos os usuários.
-   `GET /usuarios/:idUsuario`: Retorna um usuário específico.
-   `POST /usuarios`: Cria um novo usuário (geralmente usado por gestores).
-   `PATCH /usuarios/:idUsuario`: Atualiza os dados de um usuário.
-   `DELETE /usuarios/:idUsuario`: Remove um usuário.

### 🎞️ Rotas de Filme

-   `GET /filmes`: Lista todos os filmes.
-   `GET /filmes/:idFilme`: Retorna um filme específico.
-   `POST /filmes`: Cria um novo filme.
-   `PATCH /filmes/:idFilme`: Atualiza os dados de um filme.
-   `DELETE /filmes/:idFilme`: Remove um filme.

### 🍿 Rotas de Série

-   `GET /series`: Lista todas as séries.
-   `GET /series/:idSerie`: Retorna uma série específica.
-   `POST /series`: Cria uma nova série.
-   `PATCH /series/:idSerie`: Atualiza os dados de uma série.
-   `DELETE /series/:idSerie`: Remove uma série.

### 🎬 Rotas de Episódio

-   `GET /episodios`: Lista todos os episódios.
-   `GET /episodios/:idEpisodio`: Retorna um episódio específico.
-   `POST /episodios`: Cria um novo episódio.
-   `PATCH /episodios/:idEpisodio`: Atualiza os dados de um episódio.
-   `DELETE /episodios/:idEpisodio`: Remove um episódio.

### ⭐ Rotas de Avaliação

-   `GET /avaliacoes`: Lista todas as avaliações.
-   `POST /avaliacoes`: Cria uma nova avaliação para uma obra.
-   `PATCH /avaliacoes/`: Atualiza uma avaliação existente.
-   `DELETE /avaliacoes/`: Remove uma avaliação.
-   `POST /avaliacoes/curtir`: Adiciona uma curtida a uma avaliação.
-   `DELETE /avaliacoes/curtir`: Remove uma curtida de uma avaliação.