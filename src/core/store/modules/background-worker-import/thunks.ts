import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	rejectNoValues,
	handleJSONError,
} from "src/core/utils/func";
import api from "src/core/api/background-worker-import";

export const getBackgroundWorkerImport = createAsyncThunk(
	"background-worker-import/getBackgroundWorkerImport",
	async (params: any, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.backgroundWorkerImport(filter)
			return response.data
		} catch (error) {
			return rejectWithValue(handleJSONError(error));
		}
	}
);

export const getWorkerLog = createAsyncThunk(
	"background-worker-import/getLog",
	async (params: any, { rejectWithValue }) => {
		try {
			const filter = rejectNoValues(params);
			const response = await api.getLog(filter)
			return response.data
		} catch (error) {
			return rejectWithValue(handleJSONError(error));
		}
	}
);

export const deleteBackgroundWorkerImport = createAsyncThunk(
	"background-worker-import/delete",
	async (id: any, { rejectWithValue }) => {
		try {
			const response = await api.deleteBackgroundWorkerImport(id)
			return response
		} catch (error: any) {
			return rejectWithValue(error.response.data);
		}
	}
);