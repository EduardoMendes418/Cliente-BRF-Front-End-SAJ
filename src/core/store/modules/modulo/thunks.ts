import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/core/api/modulo";
import { TModuloFilter } from "src/core/models/modulo";

export const fetchModuloList = createAsyncThunk(
	"modulo/fetch",
	async (filter: TModuloFilter, { rejectWithValue }) => {
		try {
			const response = await api.list(filter);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.response.data);
		}
	}
);
