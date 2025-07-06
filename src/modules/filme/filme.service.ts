import { Filme, Obra, Prisma, TiposObraEnum } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../../client";
import ApiError from "../../utils/ApiError";
import { obraService } from "../obra";

type IdFranquiaEdicaoType = {
  id_franquia: number;
  edicao: number;
};

const createFilme = async (
  addFilme: Omit<Filme & Obra, "id_obra" | "tipo_obra">
): Promise<Filme> => {
  const { titulo, sinopse, lancamento, id_franquia, edicao } = addFilme;

  const obra = await obraService.createObra({
    titulo,
    sinopse,
    lancamento,
    tipo_obra: TiposObraEnum.FILME,
  });

  return prisma.filme.create({
    data: {
      id_obra: obra.id_obra,
      id_franquia,
      edicao,
    },
  });
};

const queryFilmes = async <Key extends keyof (Filme & Obra)>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  },
  keys: Key[] = ["id_franquia", "id_obra", "edicao", "titulo", "sinopse", "lancamento"] as Key[]
): Promise<Pick<Filme & Obra, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? "desc";

  const filmes = await prisma.filme.findMany({
    where: filter,
    include: {
      obra: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined,
  });

  const flattenedFilmes = filmes.map(filme => ({
    ...filme,
    ...filme.obra,
  }));

  return flattenedFilmes.map(filme => 
    keys.reduce((obj, k) => ({ ...obj, [k]: filme[k] }), {}) as Pick<Filme & Obra, Key>
  );
};

const getFilmeById = async <Key extends keyof (Filme & Obra)>(
  filmePK: IdFranquiaEdicaoType,
  keys: Key[] = ["id_franquia", "id_obra", "edicao", "titulo", "sinopse", "lancamento"] as Key[]
): Promise<Pick<Filme & Obra, Key> | null> => {
  const filme = await prisma.filme.findUnique({
    where: { id_franquia_edicao: filmePK },
    include: {
      obra: true,
    },
  });

  if (!filme) {
    throw new ApiError(httpStatus.NOT_FOUND, "Filme não encontrado");
  }

  const flattenedFilme = {
    ...filme,
    ...filme.obra,
  };

  return keys.reduce((obj, k) => ({ ...obj, [k]: flattenedFilme[k] }), {}) as Pick<Filme & Obra, Key>;
};

const updateFilmeById = async <Key extends keyof (Filme & Obra)>(
  filmePK: IdFranquiaEdicaoType,
  updateBody: Omit<Filme & Obra, "id_obra" | "tipo_obra">,
  keys: Key[] = ["id_franquia", "id_obra", "edicao", "titulo", "sinopse", "lancamento"] as Key[]
): Promise<Pick<Filme & Obra, Key> | null> => {
  const filme = await getFilmeById(filmePK, ["id_franquia", "id_obra"]);
  if (!filme) {
    throw new ApiError(httpStatus.NOT_FOUND, "Filme não encontrado");
  }

  const { titulo, sinopse, lancamento, id_franquia, edicao } = updateBody;

  await obraService.updateObraById(filme.id_obra, {
    titulo,
    sinopse,
    lancamento,
  });

  const updatedFilme = await prisma.filme.update({
    where: { id_franquia_edicao: filmePK },
    data: {
      id_franquia,
      edicao,
    },
    include: {
      obra: true,
    },
  });

  const flattenedFilme = {
    ...updatedFilme,
    ...updatedFilme.obra,
  };

  return keys.reduce((obj, k) => ({ ...obj, [k]: flattenedFilme[k] }), {}) as Pick<Filme & Obra, Key>;
};

const deleteFilmeById = async (filmePK: IdFranquiaEdicaoType,): Promise<Filme & Obra> => {
  const filme = await getFilmeById(filmePK);
  if (!filme) {
    throw new ApiError(httpStatus.NOT_FOUND, "Filme not found");
  }
  
  const deletedFilme = await prisma.filme.delete({ 
    where: { id_franquia_edicao: filmePK },
    include: {
      obra: true,
    },
  });

  await obraService.deleteObraById(filme.id_obra);

  return {
    ...deletedFilme,
    ...deletedFilme.obra,
  };
};

export default {
  createFilme,
  queryFilmes,
  getFilmeById,
  updateFilmeById,
  deleteFilmeById,
};
