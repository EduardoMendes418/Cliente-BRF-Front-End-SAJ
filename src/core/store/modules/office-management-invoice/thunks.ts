import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "src/core/api/office-management-invoice";
import {
  TOfficeManagementInvoice,
  TOfficeManagementInvoiceFilter,
} from "src/core/models/office-management-invoice";
import { actions } from "../..";
import { rejectNoValues } from "src/core/utils/func";

export const fetchOfficeManagementInvoice = createAsyncThunk(
  "officeManagementInvoice/fetch",
  async (
    values: TOfficeManagementInvoiceFilter,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const normalizedValues = rejectNoValues(values);
      const response = await api.getAll(normalizedValues);

      if (!values.notPaginate)
        dispatch(actions.pagination.setPageCount(response.data.pageCount));

      return response.data;
    } catch (err: any) {
      return rejectWithValue({ error: err.response.data });
    }
  }
);

export const getOfficeManagementInvoice = createAsyncThunk(
  "officeManagementInvoice/get",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.get(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue({ error: err.res.data });
    }
  }
);

export const addOfficeManagementInvoice = createAsyncThunk(
  "officeManagementInvoice/add",
  async (values: TOfficeManagementInvoice, { rejectWithValue }) => {
    try {
      const res = await api.add(values);
      return res.data;
    } catch (err: any) {
      return rejectWithValue("Não é possível realizar cadastro em duplicidade");
    }
  }
);

export const editOfficeManagementInvoice = createAsyncThunk(
  "officeManagementInvoice/edit",
  async (values: TOfficeManagementInvoice, { rejectWithValue }) => {
    try {
      const res = await api.edit(values);
      return res.data;
    } catch (err: any) {
			if(err.response.data.includes("Cannot insert duplicate key in object")) {
				return rejectWithValue("Não é possível realização cadastro em duplicidade")
			}

      return rejectWithValue(err.response.data)
    }
  }
);

export const deleteOfficeManagementInvoice = createAsyncThunk(
  "officeManagementInvoice/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.delete(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue({ error: err.res.data });
    }
  }
);
