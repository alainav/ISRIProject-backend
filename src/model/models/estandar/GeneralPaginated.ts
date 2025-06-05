import { IPaginated } from "../../interfaces/IPaginated.js";

export class GeneralPaginated implements IPaginated {
  paginated: { actual_page?: number; total_pages: number; total_count: number };

  constructor(total_pages: number, total_count: number, actual_page?: number) {
    this.paginated = {
      actual_page:
        actual_page && actual_page !== null && !Number.isNaN(actual_page)
          ? actual_page
          : 1,
      total_count,
      total_pages,
    };
  }

  get data() {
    return { paginated: this.paginated };
  }
}
