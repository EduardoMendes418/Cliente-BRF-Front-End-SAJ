import { ParamsGet } from ".";

export type TOfficeManagementStatus = {
  id?: number;
  isActive?: boolean;
  name: string;
};

export type TOfficeManagementStatusFilters = ParamsGet &
  Partial<Pick<TOfficeManagementStatus, "name" | "isActive">>;
