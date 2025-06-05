export interface IPaginated {
  paginated: {
    actual_page?: number;
    total_pages: number;
    total_count: number;
  };
}
