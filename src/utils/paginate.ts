import { FindManyArgs, IOptions, PrismaDelegate } from '../types/paginate';

export async function paginate<Model, WhereOptions>(
  modelDelegate: PrismaDelegate<Model, WhereOptions>,
  options: IOptions,
  filter: WhereOptions,
  keys?: (keyof Model)[]
) {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const totalResults = await modelDelegate.count({ where: filter });
  const findManyOptions: FindManyArgs<WhereOptions> = {
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  };
  if (keys) findManyOptions.select = keys.reduce((obj, k) => ({ ...obj, [k]: true }), {});
  const result = await modelDelegate.findMany(findManyOptions);

  return {
    page,
    limit,
    totalPages: Math.ceil(totalResults / limit),
    totalResults,
    results: result
  };
}
