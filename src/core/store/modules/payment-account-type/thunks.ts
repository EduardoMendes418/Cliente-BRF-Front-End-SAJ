import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/core/api/payment-account-type";
import { TPaymentAccountType } from "src/core/models/payment-account-type";


export const fetchPaymentAccountType = createAsyncThunk(
    "paymentAccountType/fetch",
    async () => {
		try {
			const response = await api.list();
			return { items: response.data };
		} catch (err: any) {
			console.error({ error: err.response.data });
		}
	}
);

export const fetchPaymentAccountTypeById = createAsyncThunk(
	'paymentAccountTypeById/fetch',
	async ( id: number, { rejectWithValue }) => {
		try {
			const response = await api.listById(id);
	
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const addPaymentAccountType = createAsyncThunk(
    "paymentAccountType/add",
    async (value: TPaymentAccountType, { rejectWithValue }) => {
        try {
            const response = await api.add(value);
            return response.data;
        } catch (err: any) {
            return rejectWithValue({ error: err.response.data });
        }
    }
);

export const editPaymentAccountType = createAsyncThunk(
    "paymentAccountType/edit",
    async ( value: TPaymentAccountType,
        { rejectWithValue }
    ) => {
        try {
            const response = await api.edit(value);
            return response.data;
        } catch (err: any) {
            return rejectWithValue({ error: err.response.data });
        }
    }
);