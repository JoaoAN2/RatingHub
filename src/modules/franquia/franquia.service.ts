import { Franquia, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../../client";
import ApiError from "../../utils/ApiError";

const createFranquia = async (addFranquia: Omit<Franquia, "id_franquia">): Promise<Franquia> => {
  return prisma.franquia.create({
    data: addFranquia,
  });
};

const queryFranquias = async <Key extends keyof Franquia>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  },
  keys: Key[] = [
    "id_franquia",
    "nome"
  ] as Key[]
): Promise<Pick<Franquia, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? "desc";

  const franquias = await prisma.franquia.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined,
  });

  return franquias as Pick<Franquia, Key>[];
};

const getFranquiaById = async <Key extends keyof Franquia>(
  id: number,
  keys: Key[] = [
    "id_franquia",
    "nome"
  ] as Key[]
): Promise<Pick<Franquia, Key> | null> => {
  return prisma.franquia.findUnique({
    where: { id_franquia: id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<Franquia, Key> | null>;
};

const updateFranquiaById = async <Key extends keyof Franquia>(
  franquiaId: number,
  updateBody: Prisma.FranquiaUpdateInput,
  keys: Key[] = [
    "id_franquia",
    "nome"
  ] as Key[]
): Promise<Pick<Franquia, Key> | null> => {
  const franquia = await getFranquiaById(franquiaId, ["id_franquia", "nome"]);
  if (!franquia) {
    throw new ApiError(httpStatus.NOT_FOUND, "Franquia not found");
  }
  const updatedFranquia = await prisma.franquia.update({
    where: { id_franquia: franquia.id_franquia },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  });
  return updatedFranquia as Pick<Franquia, Key> | null;
};

const deleteFranquiaById = async (franquiaId: number): Promise<Franquia> => {
  const franquia = await getFranquiaById(franquiaId);
  if (!franquia) {
    throw new ApiError(httpStatus.NOT_FOUND, "Franquia not found");
  }
  await prisma.franquia.delete({ where: { id_franquia: franquia.id_franquia } });
  return franquia;
};

export default {
  createFranquia,
  queryFranquias,
  getFranquiaById,
  updateFranquiaById,
  deleteFranquiaById,
};
