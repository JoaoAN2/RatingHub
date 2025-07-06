export type IPaginate<Model> = {
  results: Model;
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export type IOptions = {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortType?: 'asc' | 'desc';
};

export type OrderByArg = 'asc' | 'desc';

export type FindManyArgs<WhereOptions> = {
  where?: WhereOptions;
  select?: object;
  skip?: number;
  take?: number;
  orderBy?: { [x: string]: OrderByArg };
};

export type PrismaDelegate<Model, WhereOptions> = {
  count: (params: { where?: WhereOptions }) => Promise<number>;
  findMany: (params: FindManyArgs<WhereOptions>) => Promise<Model[]>;
};
