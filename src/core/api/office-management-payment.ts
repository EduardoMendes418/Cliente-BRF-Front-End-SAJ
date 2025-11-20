import {
  TLegalResponsibleGiveBack,
  TOfficeManagementPayment,
  TOfficeManagementPaymentFilter,
  TOfficeManagementPaymentItem,
} from "src/core/models/office-management-payment";

import { paymentsInstance } from ".";
import { upload } from "./utils";

const BASE_URL = "OfficeManagementPayment";

const api = {
  getAll(params: TOfficeManagementPaymentFilter) {
    return paymentsInstance.get(`${BASE_URL}`, { params });
  },
  add(params: TOfficeManagementPayment) {
    return paymentsInstance.post(`${BASE_URL}`, params);
  },
  edit(params: TOfficeManagementPayment) {
    return paymentsInstance.patch(
      `${BASE_URL}/${params.id}/solicitation`,
      params
    );
  },
  get(id: number) {
    return paymentsInstance.get(`${BASE_URL}/${id}`);
  },
  uploadFiles(id: number, filesList: FileList) {
    const url = `${BASE_URL}/${id}/attachment-solicitation`;
    return upload(paymentsInstance, url, filesList);
  },
  uploadFilesExternalOffice(id: number, filesList: FileList) {
    const url = `${BASE_URL}/${id}/attachment-external-office`;
    return upload(paymentsInstance, url, filesList);
  },
  uploadFilesControl(id: number, filesList: FileList) {
    const url = `${BASE_URL}/${id}/attachment-responsible-control`;
    return upload(paymentsInstance, url, filesList);
  },
  lawyerReview(params: TOfficeManagementPayment) {
    return paymentsInstance.patch(
      `${BASE_URL}/${params.id}/internal-lawyer`,
      params
    );
  },
  externalOffice(params: TOfficeManagementPayment) {
    return paymentsInstance.patch(
      `${BASE_URL}/${params.id}/external-office`,
      params
    );
  },
  legalResponsible(params: TOfficeManagementPayment) {
    return paymentsInstance.patch(
      `${BASE_URL}/${params.id}/legal-responsible`,
      params
    );
  },
  legalResponsibleControl(params: TOfficeManagementPayment) {
    return paymentsInstance.patch(
      `${BASE_URL}/${params.id}/responsible-control`,
      params
    );
  },
  legalResponsibleControlItem(
    id: number,
    params: TOfficeManagementPaymentItem
  ) {
    return paymentsInstance.post(`${BASE_URL}/${id}/itens`, params);
  },
  itemToDelete(id: number, params: TOfficeManagementPaymentItem) {
    return paymentsInstance.delete(`${BASE_URL}/${id}/itens/${params.id}`);
  },
  sendSap(id: string) {
    return paymentsInstance.post(`${BASE_URL}/${id}/sap`);
  },
  legalResponsibleGiveBack(params: TLegalResponsibleGiveBack) {
	return paymentsInstance.patch(`${BASE_URL}/${params.id}/legal-responsible-give-back?observation=${params.justification}`)
  }
};

export default api;
