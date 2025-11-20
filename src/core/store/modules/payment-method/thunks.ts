import { createAsyncThunk } from "@reduxjs/toolkit";
import { TPaymentMethod } from "src/core/models/payment-method";
import api from "src/core/api/payment-method";
import { Modulos } from "src/core/models/modules";
import { actions } from "../..";
import { ParamsGet } from "src/core/models";

type Params = ParamsGet & {
    moduloId: Modulos;
    notPaginate?: boolean;
    descricao?: string;
};

export const fetchPaymentMethod = createAsyncThunk(
    "paymentMethod/fetch",
    async (
        { id, page, pageSize, moduloId, notPaginate, descricao }: Params,
        { rejectWithValue, dispatch }
    ) => {
        try {
            const response = await api.list({
                id,
                page,
                pageSize,
                moduloId,
                descricao,
            });
            !notPaginate &&
                dispatch(
                    actions.pagination.setPageCount(response.data.pageCount)
                );
            return response.data;
        } catch (err: any) {
            return rejectWithValue({ error: err.response.data });
        }
    }
);

export const addPaymentMethod = createAsyncThunk(
    "paymentMethod/add",
    async (value: TPaymentMethod, { rejectWithValue }) => {
        try {
            const response = await api.add({ ...value, status: true });
            return response.data;
        } catch (err: any) {
            return rejectWithValue({ error: err.response.data });
        }
    }
);

export const editPaymentMethod = createAsyncThunk(
    "paymentMethod/edit",
    async (
        params: { id: string; values: TPaymentMethod },
        { rejectWithValue }
    ) => {
        const { id, values } = params;
        try {
            const response = await api.edit(id, values);
            return response.data;
        } catch (err: any) {
            return rejectWithValue({ error: err.response.data });
        }
    }
);

export const deletePaymentMethod = createAsyncThunk(
    "paymentMethod/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.delete(id.toString());
            return response.data;
        } catch (err: any) {
            return rejectWithValue({ id, error: err.response.data });
        }
    }
);
