import { ParamsGet } from ".";

export type TOfficeManagementControl = {
  id?: number;
  isActive?: boolean;
  name: string;
};

export type TOfficeManagementControlFilter = ParamsGet &
  Partial<Pick<TOfficeManagementControl, "name" | "isActive">>;
