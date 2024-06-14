'use strict';
import { Op } from 'sequelize';
import { Filters } from '../../../types/parsed-params';
import { Request, Response, NextFunction } from 'express';

interface Configurations {
  defaultSort: string;
  filters?: string[];
  search?: string[];
}

interface Params {
  [key: string]: any;
  sort?: string;
  skip?: number;
  limit?: number;
  search?: string;
  count?: boolean;
}

type SortTuple = [string, 'asc' | 'desc'];

function parseSort(configurations: Configurations, params: Params): SortTuple[] {
  let sortBy: string = configurations.defaultSort;
  if (params.sort) {
    sortBy = params.sort;
  }

  if (sortBy.slice(0, 1) === '-') {
    return [[sortBy.slice(1), 'desc']];
  }
  return [[sortBy, 'asc']];
}

function parseSkip(params: Params): number {
  if (params.skip && Number(params.skip) > 0) {
    return Number(params.skip);
  }
  return 0;
}

function parseLimit(params: Params): number {
  if (params.limit && Number(params.limit) > 0 && Number(params.limit) <= 20) {
    return Number(params.limit);
  }
  return 20;
}

function parseFilters(configurations: Configurations, params: Params) {
  const filterFields = configurations.filters || [];
  const searchFields = configurations.search || [];
  const result: Filters  = {};

  filterFields.forEach((field) => {
    if (params[field as keyof Params]) {
      result[field] = params[field as keyof Params];
    }
  });

  if (searchFields.length > 0 && params.search) {
    result[Op.or as any] = searchFields.map((field: string) => {
      return {
        [field]: {
          [Op.substring]: params.search
        }
      };
    });
  }

  return result;
}

function parseGetParams(configurations: Configurations) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.parsedParams = {
      sort: parseSort(configurations, req.query),
      skip: parseSkip(req.query),
      limit: parseLimit(req.query),
      filters: parseFilters(configurations, req.query),
      count: Boolean(req.query.count)
    };
    return next();
  };
}

export = parseGetParams;
