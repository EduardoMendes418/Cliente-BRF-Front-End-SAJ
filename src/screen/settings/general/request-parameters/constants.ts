import { getOptionsAsObject } from "src/core/utils/func";

export enum STATUS_FOLDER_NUMBER {
  NONE,
  DIED = 4,
  SUSPENDED = 2,
  TEMPORARY_DISCHARGE = 3,
  ACTIVE = 1,
}

export const statusFolderNumberAsOptions = [
  { value: STATUS_FOLDER_NUMBER.ACTIVE, label: "Ativo" },
  { value: STATUS_FOLDER_NUMBER.SUSPENDED, label: "Suspenso" },
  {
    value: STATUS_FOLDER_NUMBER.TEMPORARY_DISCHARGE,
    label: "Baixa provisória",
  },
  { value: STATUS_FOLDER_NUMBER.DIED, label: "Morto" },
];

export enum RESPONSIBLE_TYPE {
  NONE,
  LEGAL_RESPONSIBLE,
  INTERNAL_LAWYER,
  AGENT,
  OFFICE_MANAGER,
  ADMINISTRATIVE_CONTROL,
  CUSTOM,
  REQUESTER,
}

export const resposibleAsOptions = [
  { value: RESPONSIBLE_TYPE.NONE, label: "Nenhum" },
  { value: RESPONSIBLE_TYPE.LEGAL_RESPONSIBLE, label: "Responsável jurídico" },
  { value: RESPONSIBLE_TYPE.INTERNAL_LAWYER, label: "Advogado interno" },
  { value: RESPONSIBLE_TYPE.AGENT, label: "Preposto" },
  { value: RESPONSIBLE_TYPE.OFFICE_MANAGER, label: "Resp. do escritório" },
  { value: RESPONSIBLE_TYPE.ADMINISTRATIVE_CONTROL, label: "Equipe de atendimento", },
  { value: RESPONSIBLE_TYPE.CUSTOM, label: "Indicar responsável" },
  { value: RESPONSIBLE_TYPE.REQUESTER, label: "Solicitante" },
] as any;

export enum RESPONSIBLE_TYPE_REQUEST {
  NONE = 0,
  AGENT = 4,
  INTERNAL_LAWYER = 5,
  OFFICE_MANAGER = 2,
  ADMINISTRATIVE_CONTROL = 1,
  REQUESTER = 3
}

export const resposibleAsOptionsRequest = [
  { value: RESPONSIBLE_TYPE_REQUEST.INTERNAL_LAWYER, label: "Advogado interno" },
  { value: RESPONSIBLE_TYPE_REQUEST.AGENT, label: "Preposto" },
  { value: RESPONSIBLE_TYPE_REQUEST.OFFICE_MANAGER, label: "Resp. do escritório" },
  { value: RESPONSIBLE_TYPE_REQUEST.ADMINISTRATIVE_CONTROL, label: "Empresa" },
  { value: RESPONSIBLE_TYPE_REQUEST.REQUESTER, label: "Indicar responsável" },

] as any;

export enum COUNT_DEADLINE {
  NONE,
  PROGRESS,
  NEXT_BUSINESS_DAY,
  FIRST_AUDIENCE,
  MANUAL,
}

export const countDeadlineAsOptions = [
  { value: COUNT_DEADLINE.PROGRESS, label: "A partir da requisição" },
  {
    value: COUNT_DEADLINE.NEXT_BUSINESS_DAY,
    label: "A partir do próximo dia últil",
  },
  { value: COUNT_DEADLINE.MANUAL, label: "Manual" },
];

export const statusText = getOptionsAsObject(statusFolderNumberAsOptions);
