import { ParamsGet } from ".";

export type TOfficeManagementResponsible = {
  id?: number;
  isActive?: boolean;
  name: string;
  areaId: number;
};

export type TOfficeManagementResponsibleFilter = ParamsGet &
  Partial<Pick<TOfficeManagementResponsible, "name" | "isActive" | "areaId">>;
