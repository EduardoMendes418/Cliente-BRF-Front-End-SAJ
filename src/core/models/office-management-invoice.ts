import { ParamsGet } from ".";

export type TOfficeManagementInvoice = {
  id?: number;
  isActive?: boolean;
  areaId?: number;
  description: string;
  typeRequestSAP: string;
  categoryRequestSAP: string;
};

export type TOfficeManagementInvoiceFilter = ParamsGet &
  Partial<
    Pick<TOfficeManagementInvoice, "areaId" | "description" | "isActive">
  >;
