import { FOLDER_STATUS } from "src/screen/settings/constants";
import { TPaymentESocial } from 'src/core/models/payment';
import { TLogs } from "src/core/models";

export type TProcessParties = {
  id: number;
  contactId: number;
  name: string;
  position: string;
  situation: string;
  supplierId: string;
  birthDate?: string;
  gender?: number;
  identificationNumber?: string;
  bankId?: number | "";
  agency?: string;
  agencyDv?: string;
  account?: string;
  accountDv?: string;
  zipCode?: string;
  address?: string;
  addressNumber?: string;
  district?: string;
  stateId?: number | "";
  cityId?: number | "";
  telephone?: string;
  email?: string;
	isMainParticipant: boolean
};

export type TOrder = {
  id: number;
  folderNumber?: string;
  processId?: number;
  processNumber?: string;
  name?: string;
  description?: string;
  initialRisk: string | number;
  processObjectId?: number;
  probableInitialRisk: string | number;
  possibleInitialRisk: string | number;
  remoteInitialRisk: string | number;
  initialRiskJustification: string;
  sentenceValue: number;
  sentenceValueJustification: string;
  convictionValue: number;
  justificationAmountConviction: string;
};

export type TAttachedDocument = {
  id: number;
  processId: number;
  folderNumber: string;
  processNumber: string;
  documentName: string;
  documentFormat: string;
  path: string;
};

export type TProcessObject = {
  description: string;
  id: number;
  notes: any;
  objectId: number;
  objectInformation: null | TOrder;
  processId: number;

  objectInformationId: undefined | number;

  possibleInitialRisk: string | number;
  probableInitialRisk: string | number;
  remoteInitialRisk: string | number;
  initialRisk: string | number;

  processObjectId: number;
  convictionValue: number;

  initialRiskJustification: string;
  justificationAmountConviction: string;
  sentenceValue: number;
  sentenceValueJustification: string;
};

// TODO: 158812 checar retorno eSocial ao editar pagamento
export type TProcess = TPaymentESocial & {
  id: number;
  folderNumber: string;
  processNumber: string;
  bornDate: string;
  gender: number;
  oldNumber: string;
  closed: boolean;
  city: string;
  state: string;
  legalDepartmentArea: string;
  legalDepartmentAreaId: number;
  provisionClass: string;
  costCenter: string;
  internalLawyer: string;
  individual: TProcessParties;
  internalLawyerId: number;
  admissionDate: string | null;
  dismissalDate: string | null;
  distributionDate: string | null;
  logsObjects: TLogs[];
  processObject: TProcessObject[];
  processParties: TProcessParties[];
  orders: TOrder[];
  attachedDocuments: any[];
  processKey: number;
  agentId: number;
  officeResponsibleId: number;
  officeResponsible: string;
  officeResponsibleIsActive?: boolean;
  agent: string;
  juridicalResponsible: string;
  statusId: FOLDER_STATUS;
  sphere: string;
  contingency?: string;
  opposingLawyer?: string;
  empresa: string;
  nomeReclamante?: string;
  idReclamante?: number;
  registrationCompletionDate?: string;
  processParty?: TProcessParties[]
  closure: string;
  locationName: string;
  office: string;
  officeManager: string;
  groupingCostCenter: string;
  legalResponsibleId: number;
  legalResponsibleName: string;
	litigationRelationship: number;
	otherPartName: string;
	responsibleAreaId: number;
	responsibleOoffice: string;
  courtPanelDescription?: string;
  courtPanelNumber?: number;
  jurisdictionDescription?: string;
};

export type TProcessFormData = {
  processParties: any;
  numeroProcesso: string;
  nomeReclamante: string;
  centroCusto: string;
  legalDepartmentArea: string;
  legalDepartmentAreaId: number;
  internalLawyer: string;
  legalResponsible?: string;
  empresa: string;
  closed: boolean;
  processKey: number;
  folderNumber: string;
  statusId: FOLDER_STATUS;
  sphere: string;
  agent: string;
  office?: string;
  officeResponsible: string;
  officeResponsibleIsActive?: boolean;
  contingency?: string;
  hasConfronter?: boolean;
  responsibleLegal?: string;
  valorTotalGuia?: any
};

export type TStatisticalOrder = {
  id: number;
  folderNumber: string;
  orders: TOrder[];
  attachedDocuments: any[];
  processObject: TProcessObject[];
  processParties: TProcessParties[];
};

export type TFolderStatisticalOrder = {
  processNumber: string;
  legalDepartmentArea: string;
  costCenter: string;
  provisionClass: string;
  localidade: string;
  processParties: TProcessParties[];
  closed: boolean;
};

export type TResults = {
  id: number;
  description: string;
};

export type TOptions = {
  id: number;
  value: string;
};

export type TStatisticalOrderCalculate = {
  itemCount: number;
  items: TProcess[];
  itemsPerPage: number;
  page: number;
  pageCount: number;
};
