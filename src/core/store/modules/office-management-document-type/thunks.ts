import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "src/core/api/office-management-document-type";
import {
  TOfficeManagementDocumentType,
  TOfficeManagementDocumentTypeFilter,
} from "src/core/models/office-management-document-type";
import { actions } from "../..";
import { rejectNoValues } from "src/core/utils/func";

export const fetchOfficeManagementDocumentType = createAsyncThunk(
  "officeManagementDocumentType/fetch",
  async (
    values: TOfficeManagementDocumentTypeFilter,
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

export const getOfficeManagementDocumentType = createAsyncThunk(
  "officeManagementDocumentType/get",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.get(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue({ error: err.res.data });
    }
  }
);

export const addOfficeManagementDocumentType = createAsyncThunk(
  "officeManagementDocumentType/add",
  async (values: TOfficeManagementDocumentType, { rejectWithValue }) => {
    try {
      const res = await api.add(values);
      return res.data;
    } catch (err: any) {
      return rejectWithValue("Não é possível realizar cadastro em duplicidade");
    }
  }
);

export const editOfficeManagementDocumentType = createAsyncThunk(
  "officeManagementDocumentType/edit",
  async (values: TOfficeManagementDocumentType, { rejectWithValue }) => {
    try {
      const res = await api.edit(values);
      return res.data;
    } catch (err: any) {
			if(err.response.data.includes("Cannot insert duplicate key in object")) {
				return rejectWithValue("Não é possível realização cadastro em duplicidade")
			}

      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteOfficeManagementDocumentType = createAsyncThunk(
  "officeManagementDocumentType/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.delete(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue({ error: err.res.data });
    }
  }
);
