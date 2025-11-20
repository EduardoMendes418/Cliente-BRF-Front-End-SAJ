import { ParamsGet, TLogs } from ".";

export type TItem = {
  id?: number;
  itemContract?: string;
  amount?: number;
  costExpense?: number;
  paymentId?: number;
};

export type Log = {
  action: string;
  createdDate: string;
  id: number;
  paymentId: number;
  type: number;
  user: string;
};

export const OfficeManagementPaymentStatus = {
  0: "Solicitado",
  1: "Reprovado",
  2: "Devolvido",
  3: "Reenvio",
  4: "Anexo",
  5: "Aprovado Advogado Interno",
  6: "Fatura Lancada",
  7: "Avaliado Area Juridica",
  8: "Avaliado Controle Juridico",
  9: "Item Adicionado",
  10: "Item Removido",
  11: "Item Modificado",
  12: "Solicitado SAP",
};

export const OfficeManagementPaymentReportStatus = {
  "-1": "Sem status",
  "0": "Recusado",
  "1": "Aprovado",
  "2": "Reprovado",
};

export type TOfficeManagementPaymentItem = {
  tempId: number;
  id?: string | number;
  itemContract: string;
  amount: string | number;
  costExpense: string | number;
  paymentId?: string | number;
};

export type TOfficeManagementPaymentReport = {
  reportFilterId?: string | number;
  folderNumber?: string;
  legalDepartmentAreaId?: string[] | number[];
  originAreaId?: string[] | number[];
  empresa?: string | number;
  oldNumber?: string;
  otherNumber?: string;
  opposingLawyer?: string | number[];
  contingency?: string[];
  sphere?: string[];
  statusId?: string | number;
  result?: string | number;
  oppositePart?: string | number;
  distributionDateInitial?: string | Date;
  distributionDateFinal?: string | Date;
  creationDateInitial?: string | Date;
  creationDateFinal?: string | Date;
  dataComplementoCadastroInitial?: string | Date;
  dataComplementoCadastroFinal?: string | Date;
  terminationDateInitial?: string | Date;
  terminationDateFinal?: string | Date;
  closingDateInitial?: string | Date;
  closingDateFinal?: string | Date;
  comarca?: string;
  city?: string | number;
  internalLawyer?: string | number[];
  agent?: string | number;
  mainResponsible?: string | number;
  responsibleAreaId?: string | number;
  officeResponsible?: string | number;
  actionType?: string[] | number[];
  provisionClass?: string[] | number[];
  costCenter?: string;
  originCostCenter?: string;
  closure?: string | number;
  businessArea?: string | number;
  categoria?: string[] | number[];
  identifierNumber?: string;
  dataSolicitacaoInitial?: string | Date | null;
  dataSolicitacaoFinal?: string | Date | null;
  ctgFolder?: string;
  dejurAreaId?: string[];
  requestBy?: string[];
  status?: string[];
  internalLayer?: string | number;
  oposityPart?: string;
  preInvoiceNumber?: string;
  invoiceNumber?: string;
  invoiceIssuanceDateInitial?: string | Date | null;
  invoiceIssuanceDateFinal?: string | Date | null;
  documentTypeId?: string[] | number[];
  legalResponsibleId?: string | number;
  natureInvoice?: string | number;
  contractSAP?: string | number;
  approverIdSAP?: string | number;
  legalResponsibleControlId?: string | number;
  paymentDateInitial?: string | Date | null;
  paymentDateFinal?: string | Date | null;
  internalLayerAvaliationDateInitial?: string | Date | null;
  internalLayerAvaliationDateFinal?: string | Date | null;
  thirdResponsibleId?: string | number;
  legalControlAvaliationDateInitial?: string | Date | null;
  legalControlAvaliationDateFinal?: string | Date | null;
  legalControlAvaliator?: string | number;
  responsavelAreaJuridicaId?: string | number[];
  docTemp?: string;
  statusTemp?: string;
  avaliatorId?: string | number;
};

type TLegalResponsible = {
	id?: number;
	name?:string;
	isActive?: boolean;
	areaId?: number;
}

export type TOfficeManagementPayment = {
  legalResponsible?: TLegalResponsible;
  InvoiceIssuanceDateStart?: string | null;
  CompanyName?: string;
  CompanyId?: number | null;
  AreaDejurId?: string | string[];
  InvoiceTotalAmount?: string | number;
  SapCreationDateStart?: string | null;
  PaymentDateStart?: string | null;
  id?: string;
  companyId?: string | number;
  internalLawyerId?: string | number;
  preInvoiceNumber?: string | number;
  preInvoiceTotalAmount?: string | number;
  observation?: string;
  requestDate?: string | Date | null;
  stage?: number;
  aprovalStatus?: number | string;
  filesSolicitation?: FileList;
  files?: FileList;
  analysisDate?: string | Date;
  internalLawyerObservation?: string;
  InternalLawyer?: number | null;
  externalOfficeId?: number | string;
  registerDate?: string | Date;
  invoiceNumber?: number | string;
  invoiceTotalAmount?: string | number;
  invoiceIssuanceDate?: string | Date;
  externalOfficeObservation?: string;
  documentTypeId?: number | string;
  requester: { id: number };
  externalOffice: {
    name: string;
  };
  company: {
    name: string;
  };
  internalLawyer?: {
    name: string;
  };
  legalResponsibleId?: number | string;
  filesExternalOffice?: FileList;
  cliforSAP?: string;
  contractSAP?: string;
  centroSAP?: number | string;
  contaRazao?: string;
  approverIdSAP?: number | string;
  legalResponsibleObservation?: string;
  areaDejurId?: number | string | any[];
  natureInvoiceId?: number | string;
  costCenterId?: number | string;
  legalResponsibleControlId?: number | string;
  legalResponsibleControl?: LegalResponsibleControl;
  request?: string;
  solicitation?: string;
  serviceSheet?: string;
  paymentDate?: string | Date;
  companyName?: string;
  exercicio?: string;
  docNumberSAP?: string;
  filesResponsibleControl?: FileList;
  logs?: Log[];
  treatedLogs?: TLogs[];
  itens?: TItem[];
  itensToDelete: TOfficeManagementPaymentItem[];
  paymentItems: TOfficeManagementPaymentItem[];
  itemContract: string;
  amount: string;
  costExpense: string;
  userFilter: string;
  status?: string;
};

export type LegalResponsibleControl = {
	id: number;
	name: string;
	isActive: boolean;
}

export type TLegalResponsibleGiveBack = {
	id: number | string | undefined;
	justification: string;
}

export type TOfficeManagementPaymentFilter = ParamsGet &
  Partial<
    Pick<
      TOfficeManagementPayment,
      "requestDate" | "id" | "stage" | "userFilter" | "InvoiceIssuanceDateStart" | "SapCreationDateStart" | "CompanyName" | "PaymentDateStart" | "InvoiceTotalAmount" | "AreaDejurId" | "preInvoiceNumber" | "status" | "CompanyId" | "InternalLawyer"
    >
  >;

export type TRefunds = {
	id?: number,
	refundSolicitationId?: null,
	folderNumber?: string,
	externalOfficeId?: number,
	registrationDate?: string,
	pantryValue?: number,
	description?: string,
	areaDejurId?: number,
	requesterId?: number,
	processPartiesOtherId?: number,
	filesSolicitation?: unknown[],
	requester?: {name?: string} | string,
	areaDejur?: {name?: string} | string,
	isDeleted?: boolean
}