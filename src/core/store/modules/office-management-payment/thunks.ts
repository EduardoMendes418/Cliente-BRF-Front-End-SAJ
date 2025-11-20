import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "src/core/api/office-management-payment";
import {
  TLegalResponsibleGiveBack,
  TOfficeManagementPayment,
  TOfficeManagementPaymentFilter,
  TOfficeManagementPaymentItem,
} from "src/core/models/office-management-payment";
import { actions } from "../..";
import { rejectNoValues, toNumber } from "src/core/utils/func";
import { TLogs } from "src/core/models";
import { OfficeManagementTypeEnum } from "src/screen/office-management/utils/getOfficeManagementType";

const treateFile: any = (files: any) => {
  return files.map((el: any) => ({
    documentName: el.name,
    id: el.id,
    pagamentoId: el.paymentId,
    path: el.url,
  }));
};

export const fetchOfficeManagementPayment = createAsyncThunk(
  "officeManagementPayment/fetch",
  async (
    values: TOfficeManagementPaymentFilter,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const normalizedValues = rejectNoValues(values);

      if (normalizedValues.stage === OfficeManagementTypeEnum.requestPayment) {
        delete normalizedValues["stage"];
      } else if (
        normalizedValues.stage === OfficeManagementTypeEnum.lawyerReview
      ) {
        normalizedValues.internalLawyer = normalizedValues.userFilter;
      } else if (
        normalizedValues.stage === OfficeManagementTypeEnum.invoicePosting
      ) {
        normalizedValues.externalOffice = normalizedValues.userFilter;
      } else if (
        normalizedValues.stage === OfficeManagementTypeEnum.evaluationJuridical
      ) {
        normalizedValues.legalControlId = normalizedValues.userFilter;
      } else {
        normalizedValues.legalResponsibleId = normalizedValues.userFilter;
      }
      delete normalizedValues["userFilter"];

      const response = await api.getAll(normalizedValues);
      if (!values.notPaginate)
        dispatch(actions.pagination.setPageCount(response.data.pageCount));

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getOfficeManagementPayment = createAsyncThunk(
  "officeManagementPayment/get",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.get(id);
      const logs = res.data?.logs?.map(
        (log: any) =>
          ({
            id: log.id,
            rejectionAndReturnReasonsId: 1,
            logDataFromId: log.paymentId,
            statusApprovalId: log.paymentId,
            statusFlowId: log.type,
            userName: log.user,
            occurrenceDate: log.createdDate,
            observation: log.action,
          } as TLogs)
      );

      res.data.treatedLogs = logs;
      res.data.filesExternalOffice = treateFile(res.data.filesExternalOffice);
      res.data.filesResponsibleControl = treateFile(
        res.data.filesResponsibleControl
      );
      res.data.filesSolicitation = treateFile(res.data.filesSolicitation);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const addOfficeManagementPayment = createAsyncThunk(
  "officeManagementPayment/add",
  async (values: TOfficeManagementPayment, { rejectWithValue }) => {
    try {
      const { data } = await api.add({ ...values, requestDate: new Date() });
      const { id } = data;
      if (id && values && values.files && values.files.length > 0) {
        const responseFile = await api.uploadFiles(id, values.files);
        return responseFile.data;
      }
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const editOfficeManagementPayment = createAsyncThunk(
  "officeManagementPayment/add",
  async (values: TOfficeManagementPayment, { rejectWithValue }) => {
    try {
      const { data } = await api.edit({ ...values, requestDate: new Date() });
      const { id } = data;
      if (id && values && values.files && values.files.length > 0) {
        const responseFile = await api.uploadFiles(id, values.files);
        return responseFile.data;
      }
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const addOfficeManagementPaymentLawyerReview = createAsyncThunk(
  "officeManagementPayment/add",
  async (values: TOfficeManagementPayment, { rejectWithValue }) => {
    try {
      const { data } = await api.lawyerReview({
        ...values,
        analysisDate: new Date(),
        externalOfficeId: values.externalOfficeId
          ? parseInt(values.externalOfficeId.toString())
          : "",
      });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const addOfficeManagementPaymentExternalOffice = createAsyncThunk(
  "officeManagementPayment/add",
  async (values: TOfficeManagementPayment, { rejectWithValue }) => {
    try {
      const { data } = await api.externalOffice(values);
      const { id } = data;
      if (id && values && values.files && values.files.length > 0) {
        const responseFile = await api.uploadFilesExternalOffice(
          id,
          values.files
        );
        return responseFile.data;
      }
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const addOfficeManagementPaymentLegalResponsible = createAsyncThunk(
  "officeManagementPayment/add",
  async (values: TOfficeManagementPayment, { rejectWithValue }) => {
    try {
      const { data } = await api.legalResponsible(values);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const addOfficeManagementPaymentSendSap = createAsyncThunk(
  "officeManagementPayment/add",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.sendSap(id);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const addOfficeManagementPaymentLegalResponsibleControl = createAsyncThunk(
    "officeManagementPayment/add",
    async (values: TOfficeManagementPayment, { rejectWithValue }) => {
      try {
        const { data } = await api.legalResponsibleControl(values);
        const { id } = data;

        if (id && values && values.files && values.files.length > 0) {
          await api.uploadFilesControl(id, values.files);
        }

        if (
          id &&
          values &&
          values.paymentItems &&
          values.paymentItems.length > 0
        ) {
          values.paymentItems.forEach((el: TOfficeManagementPaymentItem) => {
            api.legalResponsibleControlItem(data.id, {
              ...el,
              costExpense: toNumber(el.costExpense),
            });
          });
        }

        if (
          id &&
          values &&
          values.itensToDelete &&
          values.itensToDelete.length > 0
        ) {
          values.itensToDelete.forEach((el: TOfficeManagementPaymentItem) => {
            api.itemToDelete(id, el);
          });
        }

        return data;
      } catch (err: any) {
        return rejectWithValue(err.response.data.message);
      }
});

export const sendLegalResponsibleGiveBack = createAsyncThunk(
	"officeManagementPayment/fetch",
	async (values: TLegalResponsibleGiveBack, {rejectWithValue}) => {
	   try {
		const { data } = await api.legalResponsibleGiveBack(values);
		return data;
	  } catch (err: any) {
		return rejectWithValue(err.response.data.message);
	  } 
	}
  );
