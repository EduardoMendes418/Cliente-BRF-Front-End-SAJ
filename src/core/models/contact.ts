export type TGetByFilterParams = {
  page: number;
  pageSize: number;
  type?: number;
  identificationNumber?: string;
  name?: string;
  email?: string;
}

export type Contact = {
  id: number;
  type: number;
  identificationNumber: string;
  name: string;
  countryId: number;
  contactPf?: {
    id: number;
    contactId: number;
    employeeTypeId: number;
    employeeID: string;
    reasonforDismissal: string;
    position: string;
    admissionDate: string;
    dismissalDate: string;
    sector: string;
    salaryValue: number;
    ctps: string;
    series: string;
    pisNumber: string;
    cboId: number;
  };
  contactPj?: {
    id: number;
    contactId: number;
    businessName: string;
  };
  contactEmails: Array<{
    id: number;
    contactId: number;
    type: number;
    email: string;
    isMain: boolean;
    isDeleted: boolean;
  }>;
  contactPhones: Array<{
    id: number;
    contactId: number;
    type: number;
    number: string;
    isMain: boolean;
    isDeleted: boolean;
  }>;
  contactAddresses: Array<{
    id: number;
    contactId: number;
    type: number;
    cep: string;
    countryId: number;
    ufId: number;
    cityId: number;
    street: string;
    number: number;
    complement: string;
    neighborhood: string;
    isMain: boolean;
    isDeleted: boolean;
  }>;
};