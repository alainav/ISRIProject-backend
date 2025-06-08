import { ICountry } from "./ICountry.js";

export interface ICommissionElement extends ICountry {
  commission?: { id: number; name: string };
  votes?: number;
}
