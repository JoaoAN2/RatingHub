import { Obra, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../../client";
import ApiError from "../../utils/ApiError";

const createObra = async (addObra: Omit<Obra, "id_obra">): Promise<Obra> => {
  return prisma.obra.create({
    data: addObra,
  });
};

const queryObras = async <Key extends keyof Obra>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  },
  keys: Key[] = [
    "id_obra",
    "titulo",
    "lancamento",
    "sinopse",
    "tipo_obra",
  ] as Key[]
): Promise<Pick<Obra, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? "desc";

  const obras = await prisma.obra.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined,
  });

  return obras as Pick<Obra, Key>[];
};

const getObraById = async <Key extends keyof Obra>(
  id: number,
  keys: Key[] = [
    "id_obra",
    "titulo",
    "lancamento",
    "sinopse",
    "tipo_obra",
  ] as Key[]
): Promise<Pick<Obra, Key> | null> => {
  return prisma.obra.findUnique({
    where: { id_obra: id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<Obra, Key> | null>;
};

const updateObraById = async <Key extends keyof Obra>(
  obraId: number,
  updateBody: Prisma.ObraUpdateInput,
  keys: Key[] = [
    "id_obra",
    "titulo",
    "lancamento",
    "sinopse",
    "tipo_obra",
  ] as Key[]
): Promise<Pick<Obra, Key> | null> => {
  const obra = await getObraById(obraId, ["id_obra", "titulo"]);
  if (!obra) {
    throw new ApiError(httpStatus.NOT_FOUND, "Obra not found");
  }
  const updatedObra = await prisma.obra.update({
    where: { id_obra: obra.id_obra },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  });
  return updatedObra as Pick<Obra, Key> | null;
};

const deleteObraById = async (obraId: number): Promise<Obra> => {
  const obra = await getObraById(obraId);
  if (!obra) {
    throw new ApiError(httpStatus.NOT_FOUND, "Obra not found");
  }
  await prisma.obra.delete({ where: { id_obra: obra.id_obra } });
  return obra;
};

export default {
  createObra,
  queryObras,
  getObraById,
  updateObraById,
  deleteObraById,
};
