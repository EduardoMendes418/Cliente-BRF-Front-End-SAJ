import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/core/api/accountability";
import { TAcconting, TAccountabilitySapResponseFilter } from "src/core/models/accountability";

export const getAccountingSapResponse = createAsyncThunk(
	"accountability/getSapResponse",
	async (params: TAccountabilitySapResponseFilter, { rejectWithValue }) => {
		try {
			const response = await api.getSapResponse(params) as {
				data: {
					items: TAcconting[]
				}
			};
			return response.data.items;
		} catch (error: any) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const getAccountingSapResponseByJudicialBlocksAndTransferId = createAsyncThunk(
	"accountability/getSapResponseByJudicialBlocksAndTransferId",
	async (judicialBlocksAndTransferId: number, { rejectWithValue }) => {
		try {
			const response = await api.getSapResponseByJudicialBlocksAndTransferId(judicialBlocksAndTransferId) as {
				data: {
					items: TAcconting[]
				}
			};
			return response.data.items;
		} catch (error: any) {
			return rejectWithValue(error.response.data);
		}
	}	
);

export const costCenterReclassificationAccountability = createAsyncThunk(
	"paymentRequest/costCenterReclassification",
	async (accountabilityId: number, { rejectWithValue }) => {
		try {
			const response = await api.costCenterReclassification(accountabilityId)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);
