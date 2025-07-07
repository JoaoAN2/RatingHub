-- CreateEnum
CREATE TYPE "papel_usuario_enum" AS ENUM ('GESTOR', 'CRITICO', 'NORMAL');

-- CreateEnum
CREATE TYPE "tipos_obra_enum" AS ENUM ('SERIE', 'EPISODIO', 'FILME');

-- CreateTable
CREATE TABLE "avaliacao" (
    "id_obra" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" VARCHAR(512) NOT NULL,
    "data_hora_avaliacao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacao_pkey" PRIMARY KEY ("id_obra","id_usuario")
);

-- CreateTable
CREATE TABLE "curtida_avaliacao" (
    "id_obra_avaliada" INTEGER NOT NULL,
    "id_usuario_avaliador" INTEGER NOT NULL,
    "id_usuario_curtidor" INTEGER NOT NULL,

    CONSTRAINT "curtida_avaliacao_pkey" PRIMARY KEY ("id_obra_avaliada","id_usuario_avaliador","id_usuario_curtidor")
);

-- CreateTable
CREATE TABLE "episodio" (
    "id_serie" INTEGER NOT NULL,
    "temporada" INTEGER NOT NULL,
    "numero_episodio" INTEGER NOT NULL,
    "id_obra" INTEGER NOT NULL,

    CONSTRAINT "episodio_pkey" PRIMARY KEY ("id_serie","temporada","numero_episodio")
);

-- CreateTable
CREATE TABLE "filme" (
    "id_franquia" INTEGER NOT NULL,
    "edicao" INTEGER NOT NULL,
    "id_obra" INTEGER NOT NULL,

    CONSTRAINT "filme_pkey" PRIMARY KEY ("id_franquia","edicao")
);

-- CreateTable
CREATE TABLE "franquia" (
    "id_franquia" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,

    CONSTRAINT "franquia_pkey" PRIMARY KEY ("id_franquia")
);

-- CreateTable
CREATE TABLE "obra" (
    "id_obra" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "sinopse" TEXT NOT NULL,
    "lancamento" DATE NOT NULL,
    "tipo_obra" "tipos_obra_enum" NOT NULL,

    CONSTRAINT "obra_pkey" PRIMARY KEY ("id_obra")
);

-- CreateTable
CREATE TABLE "serie" (
    "id_serie" SERIAL NOT NULL,
    "id_obra" INTEGER NOT NULL,

    CONSTRAINT "serie_pkey" PRIMARY KEY ("id_serie")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nome_usuario" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha" VARCHAR(512) NOT NULL,
    "tipo_usuario" "papel_usuario_enum" DEFAULT 'NORMAL',

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "episodio_id_obra_key" ON "episodio"("id_obra");

-- CreateIndex
CREATE UNIQUE INDEX "filme_id_obra_key" ON "filme"("id_obra");

-- CreateIndex
CREATE UNIQUE INDEX "serie_id_obra_key" ON "serie"("id_obra");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_obra_fkey" FOREIGN KEY ("id_obra") REFERENCES "obra"("id_obra") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "curtida_avaliacao" ADD CONSTRAINT "curtida_avaliacao_id_obra_avaliada_id_usuario_avaliador_fkey" FOREIGN KEY ("id_obra_avaliada", "id_usuario_avaliador") REFERENCES "avaliacao"("id_obra", "id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "curtida_avaliacao" ADD CONSTRAINT "curtida_avaliacao_id_usuario_curtidor_fkey" FOREIGN KEY ("id_usuario_curtidor") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "episodio" ADD CONSTRAINT "episodio_id_obra_fkey" FOREIGN KEY ("id_obra") REFERENCES "obra"("id_obra") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "filme" ADD CONSTRAINT "filme_id_franquia_fkey" FOREIGN KEY ("id_franquia") REFERENCES "franquia"("id_franquia") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "filme" ADD CONSTRAINT "filme_id_obra_fkey" FOREIGN KEY ("id_obra") REFERENCES "obra"("id_obra") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "serie" ADD CONSTRAINT "serie_id_obra_fkey" FOREIGN KEY ("id_obra") REFERENCES "obra"("id_obra") ON DELETE NO ACTION ON UPDATE NO ACTION;
