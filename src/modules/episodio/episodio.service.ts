import { Episodio, Obra, Prisma, TiposObraEnum } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../../client";
import ApiError from "../../utils/ApiError";
import { obraService } from "../obra";

type EpisodioPKType = {
  id_serie: number;
  temporada: number;
  numero_episodio: number;
};

const createEpisodio = async (
  addEpisodio: Omit<Episodio & Obra, "id_obra" | "tipo_obra">
): Promise<Episodio> => {
  const { titulo, sinopse, lancamento, id_serie, temporada, numero_episodio } = addEpisodio;

  const obra = await obraService.createObra({
    titulo,
    sinopse,
    lancamento,
    tipo_obra: TiposObraEnum.EPISODIO,
  });

  return prisma.episodio.create({
    data: {
      id_obra: obra.id_obra,
      id_serie,
      temporada,
      numero_episodio,
    },
  });
};

const queryEpisodios = async <Key extends keyof (Episodio & Obra)>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  },
  keys: Key[] = ["id_serie", "temporada", "numero_episodio", "id_obra", "titulo", "sinopse", "lancamento"] as Key[]
): Promise<Pick<Episodio & Obra, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? "desc";

  const episodios = await prisma.episodio.findMany({
    where: filter,
    include: {
      obra: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined,
  });

  const flattenedEpisodios = episodios.map(episodio => ({
    ...episodio,
    ...episodio.obra,
  }));

  return flattenedEpisodios.map(episodio => 
    keys.reduce((obj, k) => ({ ...obj, [k]: episodio[k] }), {}) as Pick<Episodio & Obra, Key>
  );
};

const getEpisodioById = async <Key extends keyof (Episodio & Obra)>(
  episodioPK: EpisodioPKType,
  keys: Key[] = ["id_serie", "temporada", "numero_episodio", "id_obra", "titulo", "sinopse", "lancamento"] as Key[]
): Promise<Pick<Episodio & Obra, Key> | null> => {

  console.log("EpisodioPK:", episodioPK);

  const episodio = await prisma.episodio.findUnique({
    where: { id_serie_temporada_numero_episodio: episodioPK },
    include: {
      obra: true,
    },
  });

  if (!episodio) {
    throw new ApiError(httpStatus.NOT_FOUND, "Episodio não encontrado");
  }

  const flattenedEpisodio = {
    ...episodio,
    ...episodio.obra,
  };

  return keys.reduce((obj, k) => ({ ...obj, [k]: flattenedEpisodio[k] }), {}) as Pick<Episodio & Obra, Key>;
};

const updateEpisodioById = async <Key extends keyof (Episodio & Obra)>(
  episodioPK: EpisodioPKType,
  updateBody: Omit<Episodio & Obra, "id_obra" | "tipo_obra">,
  keys: Key[] = ["id_serie", "temporada", "numero_episodio", "id_obra", "titulo", "sinopse", "lancamento"] as Key[]
): Promise<Pick<Episodio & Obra, Key> | null> => {
  const episodio = await getEpisodioById(episodioPK, ["id_serie", "id_obra"]);
  if (!episodio) {
    throw new ApiError(httpStatus.NOT_FOUND, "Episodio não encontrado");
  }

  const { titulo, sinopse, lancamento, id_serie, numero_episodio, temporada } = updateBody;

  await obraService.updateObraById(episodio.id_obra, {
    titulo,
    sinopse,
    lancamento,
  });

  const updatedEpisodio = await prisma.episodio.update({
    where: { id_serie_temporada_numero_episodio: episodioPK },
    data: {
      id_serie,
      numero_episodio,
      temporada
    },
    include: {
      obra: true,
    },
  });

  const flattenedEpisodio = {
    ...updatedEpisodio,
    ...updatedEpisodio.obra,
  };

  return keys.reduce((obj, k) => ({ ...obj, [k]: flattenedEpisodio[k] }), {}) as Pick<Episodio & Obra, Key>;
};

const deleteEpisodioById = async (episodioPK: EpisodioPKType,): Promise<Episodio & Obra> => {
  const episodio = await getEpisodioById(episodioPK);
  if (!episodio) {
    throw new ApiError(httpStatus.NOT_FOUND, "Episodio not found");
  }
  
  const deletedEpisodio = await prisma.episodio.delete({ 
    where: { id_serie_temporada_numero_episodio: episodioPK },
    include: {
      obra: true,
    },
  });

  await obraService.deleteObraById(episodio.id_obra);

  return {
    ...deletedEpisodio,
    ...deletedEpisodio.obra,
  };
};

export default {
  createEpisodio,
  queryEpisodios,
  getEpisodioById,
  updateEpisodioById,
  deleteEpisodioById,
};
