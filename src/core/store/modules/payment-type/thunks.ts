import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  TPaymentType,
  renameProps,
  TPaymentTypeFilters,
} from "src/core/models/payment-type";
import api from "src/core/api/payment-type";
import { renameKeys } from "src/core/utils/func";
import { actions } from "../..";

export const fetchPaymentType = createAsyncThunk(
  "typeOfPayment/fetch",
  async (
    {
      id,
      page,
      pageSize,
      desc,
      modulo,
      notPaginate,
      status,
			eSocialRestriction
    }: TPaymentTypeFilters,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await api.list({
        id,
        page,
        pageSize,
        desc,
        modulo,
        notPaginate,
        status,
				eSocialRestriction,
      });

      !notPaginate &&
        dispatch(
          actions.pagination.setPageCount(
            response.data.items ? response.data.pageCount : 0
          )
        );
      return renameKeys(renameProps)(response.data);
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addPaymentType = createAsyncThunk(
  "paymentType/add",
  async (values: TPaymentType, { rejectWithValue }) => {
    try {
      const normalizedValues = renameKeys(renameProps, true)(values);
      const response = await api.add(normalizedValues);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const editPaymentType = createAsyncThunk(
  "paymentType/edit",
  async (params: { id: number; values: TPaymentType }, { rejectWithValue }) => {
    const { id, values } = params;
    const normalizedValues = renameKeys(renameProps, true)(values);

    try {
      const response = await api.edit(id.toString(), normalizedValues);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deletePaymentType = createAsyncThunk(
  "paymentType/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(id.toString());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);
