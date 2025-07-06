import { Serie, Obra, Prisma, TiposObraEnum } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../../client";
import ApiError from "../../utils/ApiError";
import { obraService } from "../obra";

const createSerie = async (
  addSerie: Omit<Serie & Obra, "id_obra" | "tipo_obra" | "id_serie">
): Promise<Serie & Obra> => {
  const { titulo, sinopse, lancamento } = addSerie;

  const obra = await obraService.createObra({
    titulo,
    sinopse,
    lancamento,
    tipo_obra: TiposObraEnum.SERIE,
  });

  const serie = await prisma.serie.create({
    data: {
      id_obra: obra.id_obra,
    },
  });

  const flattenedSerie = {
    ...serie,
    ...obra,
  };

  return flattenedSerie;
};

const querySeries = async <Key extends keyof (Serie & Obra)>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  },
  keys: Key[] = ["id_franquia", "id_obra", "edicao", "titulo", "sinopse", "lancamento"] as Key[]
): Promise<Pick<Serie & Obra, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? "desc";

  const series = await prisma.serie.findMany({
    where: filter,
    include: {
      obra: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined,
  });

  const flattenedSeries = series.map(serie => ({
    ...serie,
    ...serie.obra,
  }));

  return flattenedSeries.map(serie => 
    keys.reduce((obj, k) => ({ ...obj, [k]: serie[k] }), {}) as Pick<Serie & Obra, Key>
  );
};

const getSerieById = async <Key extends keyof (Serie & Obra)>(
  idSerie: number,
  keys: Key[] = ["id_serie", "id_obra", "titulo", "sinopse", "lancamento"] as Key[]
): Promise<Pick<Serie & Obra, Key> | null> => {
  const serie = await prisma.serie.findUnique({
    where: { id_serie: idSerie },
    include: {
      obra: true,
    },
  });

  if (!serie) {
    throw new ApiError(httpStatus.NOT_FOUND, "Serie não encontrada");
  }

  const flattenedSerie = {
    ...serie,
    ...serie.obra,
  };

  return keys.reduce((obj, k) => ({ ...obj, [k]: flattenedSerie[k] }), {}) as Pick<Serie & Obra, Key>;
};

const updateSerieById = async <Key extends keyof (Serie & Obra)>(
  idSerie: number,
  updateBody: Omit<Serie & Obra, "id_obra" | "tipo_obra">,
  keys: Key[] = ["id_serie", "id_obra", "titulo", "sinopse", "lancamento"] as Key[]
): Promise<Pick<Serie & Obra, Key> | null> => {
  const serie = await getSerieById(idSerie, ["id_serie", "id_obra"]);
  if (!serie) {
    throw new ApiError(httpStatus.NOT_FOUND, "Serie não encontrado");
  }

  const { titulo, sinopse, lancamento } = updateBody;

  const obra = await obraService.updateObraById(serie.id_obra, {
    titulo,
    sinopse,
    lancamento,
  });

  const flattenedSerie = {
    ...serie,
    ...obra,
  };

  return keys.reduce((obj, k) => ({ ...obj, [k]: flattenedSerie[k] }), {}) as Pick<Serie & Obra, Key>;
};

const deleteSerieById = async (idSerie: number): Promise<Serie & Obra> => {
  const serie = await getSerieById(idSerie);
  if (!serie) {
    throw new ApiError(httpStatus.NOT_FOUND, "Serie not found");
  }
  
  const deletedSerie = await prisma.serie.delete({ 
    where: { id_serie: idSerie },
    include: {
      obra: true,
    },
  });

  await obraService.deleteObraById(serie.id_obra);

  return {
    ...deletedSerie,
    ...deletedSerie.obra,
  };
};

export default {
  createSerie,
  querySeries,
  getSerieById,
  updateSerieById,
  deleteSerieById,
};
