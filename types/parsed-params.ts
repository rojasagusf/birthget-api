export interface ParsedParams {
  sort: [string, string][] | undefined;
  skip: number;
  limit: number;
  count: boolean;
  filters: Filters;
}

export interface Filters {
  [key: string]: any;
}
