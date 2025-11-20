import { ParamsGet } from ".";

export type TOfficeManagementDocumentType = {
  id?: number;
  isActive?: boolean;
  name: string;
};

export type TOfficeManagementDocumentTypeFilter = ParamsGet &
  Partial<Pick<TOfficeManagementDocumentType, "name" | "isActive">>;
