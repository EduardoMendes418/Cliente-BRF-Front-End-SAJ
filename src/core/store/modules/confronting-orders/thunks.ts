import { createAsyncThunk } from "@reduxjs/toolkit";
import { ParamsGet } from "src/core/models";

import api from "src/core/api/confronting-orders";
import apiLogProvision from "../../../../core/api/log-provision";
import {
	convertToBlob,
	getAxiosError,
	rejectNoValues,
} from "src/core/utils/func";
import { actions } from "src/core/store";
import { TConfrontingOrdersFilters } from "src/core/models/confronting-orders";

export const fetchConfrontingOrders = createAsyncThunk(
	"confrontingOrders/fetchConfrontingOrders",
	async (
		filters: Partial<TConfrontingOrdersFilters & ParamsGet>,
		{ rejectWithValue, dispatch }
	) => {
		const params = rejectNoValues(filters);
		try {
			const response = await api.list(
				params as TConfrontingOrdersFilters & ParamsGet
			);
			dispatch(actions.pagination.setPageCount(response.data.pageCount));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchConfrontingOrdersByLogs = createAsyncThunk(
	"confrontingOrders/fetchConfrontingOrdersByLogs",
	async (
		filters: { folderNumber: string } & Omit<ParamsGet, "id" | "notPaginate">,
		{ rejectWithValue, dispatch }
	) => {
		const params = rejectNoValues(filters);
		try {
			const response = await api.listLogs(params as any);
			dispatch(actions.pagination.setPageCount(response.data.pageCount));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchProvisionLog = createAsyncThunk(
	"/provisoes/consulta-pasta",

	async (
		filters: {
			filters: {
				folderNumber: string;
				page: number;
				pageSize: number;
			};
		},

		{ rejectWithValue, dispatch }
	) => {
		const params = rejectNoValues(filters.filters);
		try {
			const response = await apiLogProvision.list(params as any);
			dispatch(actions.pagination.setPageCount(response.data.pageCount));
			return response.data.items;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

type SetStatusParams = {
	status: boolean;
	ids: number[];
	reason?: string;
};

export const setStatusConfrontingOrders = createAsyncThunk(
	"confrontingOrders/setStatusConfrontingOrders",
	async (
		{ status, ids, reason }: SetStatusParams,
		{ rejectWithValue, dispatch }
	) => {
		const params = rejectNoValues({ aprovado: status, reason });
		try {
			const response = await api.setStatus(ids, params);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getConfrontingReport = createAsyncThunk(
	"confrontingOrders/fetchConfrontingReport",
	async (filters: Partial<TConfrontingOrdersFilters>, { rejectWithValue }) => {
		const params = rejectNoValues(filters);
		try {
			const response = await api.getReport(params);
			return convertToBlob(response.data);
		} catch (err: any) {
			return rejectWithValue(getAxiosError(err)?.response?.data);
		}
	}
);

export const getPendingConfrontOrders = createAsyncThunk(
	"confrontingOrders/getPendingConfrontOrders",
	async (folderNumber: string, { rejectWithValue }) => {
		try {
			const response = await api.getPendings(folderNumber);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(getAxiosError(error)?.response?.data);
		}
	}
);
