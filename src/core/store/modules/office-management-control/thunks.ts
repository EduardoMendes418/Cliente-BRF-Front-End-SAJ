import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "src/core/api/office-management-control";
import {
  TOfficeManagementControl,
  TOfficeManagementControlFilter,
} from "src/core/models/office-management-control";
import { actions } from "../..";
import { rejectNoValues } from "src/core/utils/func";

export const fetchOfficeManagementControl = createAsyncThunk(
  "officeManagementControl/fetch",
  async (
    values: TOfficeManagementControlFilter,
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

export const getOfficeManagementControl = createAsyncThunk(
  "officeManagementControl/get",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.get(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue({ error: err.res.data });
    }
  }
);

export const addOfficeManagementControl = createAsyncThunk(
  "officeManagementControl/add",
  async (values: TOfficeManagementControl, { rejectWithValue }) => {
    try {
      const res = await api.add(values);
      return res.data;
    } catch (err: any) {
      return rejectWithValue("Não é possível realizar cadastro em duplicidade");
    }
  }
);

export const editOfficeManagementControl = createAsyncThunk(
  "officeManagementControl/edit",
  async (values: TOfficeManagementControl, { rejectWithValue }) => {
    try {
      const res = await api.edit(values);
      return res.data;
    } catch (err: any) {
			if(err.response.data.includes("Cannot insert duplicate key in object")) {
				return rejectWithValue("Não é possível realização cadastro em duplicidade");
			}

      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteOfficeManagementControl = createAsyncThunk(
  "officeManagementControl/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.delete(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue({ error: err.res.data });
    }
  }
);
