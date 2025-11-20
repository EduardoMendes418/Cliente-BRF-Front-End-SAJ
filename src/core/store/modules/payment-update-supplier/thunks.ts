import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/core/api/payment";
import { SupplierUpdateRequestData } from "src/core/models/payment";

export const updateSupplier = createAsyncThunk(
	'paymentUpdateSupplier/update',
	async (values: SupplierUpdateRequestData, {rejectWithValue}) => {
		try {
			const response = await api.updateSupplier(values)
			return response.data;
		} catch(e: any) {
			const {data} = e.response;
			if (data.detail && data.detail.includes("tools.ietf.org")) {
				const logs = JSON.parse(JSON.parse(data.detail)?.detail)?.logs ?? []
				return rejectWithValue({...data, detail: logs.map(({message}: any)=> message).join(" ")})
			}
			return rejectWithValue(data);
		}
	}
);