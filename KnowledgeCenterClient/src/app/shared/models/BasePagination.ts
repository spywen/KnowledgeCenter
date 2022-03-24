interface BasePagination {
  page: number;
  size: number;
}

export interface BasePaginationRequest<T> extends BasePagination {
  filters: T;
}

export interface BasePaginationResponse<T> extends BasePagination  {
  data: T;
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}
