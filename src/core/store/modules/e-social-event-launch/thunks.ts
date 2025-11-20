import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/e-social-event-launch'
import { actions } from '../..';
import { ESocialS2500, ESocialS2501, ESocialS3500, ExtractEsocialFile } from 'src/core/models/eSocial';

export const fetchESocialEventLauch = createAsyncThunk(
	'eSocialEventLauch/fetch',
	async ({ notPaginate, ...values }: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			!notPaginate && dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return {
				...response.data,
				items: response.data.items.map((items: []) => items)
			}
		} catch (err: any) {
			
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const fetchESocialEventLauchById = createAsyncThunk(
	'eSocialEventLauch/fetchItem',
	async ({ id, eventCode }: {id:number, eventCode: number}, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.listById({eSocialEventCodeEnum: eventCode, id});
			return {...response.data, folderNumber: response.data?.process?.folderNumber ?? "" };
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const fetchESocialEventLauchGovernmentResponsesById = createAsyncThunk(
	'eSocialEventLauch/fetchItemGovernmentResponses',
	async ({ id, eventCode }: {id:number, eventCode: number}, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.listByIdGovernmentResponses({eSocialEventCodeEnum: eventCode, id});
			return {...response.data, folderNumber: response.data?.process?.folderNumber ?? "" };
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const editESocialEventLauch = createAsyncThunk(
	'eSocialEventLauch/edit',
	async (values: ESocialS2500 | ESocialS2501 | ESocialS3500, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addESocialEventLauch = createAsyncThunk(
	'eSocialEventLauch/add',
	async (values: ESocialS2500 | ESocialS2501 | ESocialS3500, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const sendESocialEventToSAP = createAsyncThunk(
	'eSocialEventLauch/sendSAP',
	async (id: string, { rejectWithValue }) => {
		try {
			if (!id) return;
			const response = await api.sendToSAP({id});
			return response
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchAutocompleteESocialData = createAsyncThunk(
	'eSocialEventLauch/fetchAutocompleteESocialData',
	async (params: { processId: number, paymentId: number }, { rejectWithValue }) => {
		try {
			const { data } = await api.autocompleteData(params);
			return data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const extractEsocialFile = createAsyncThunk(
	'eSocialEventLauch/edit',
	async (values: ExtractEsocialFile, { rejectWithValue }) => {
		try {
			const response = await api.extractESocialFile(values);
			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const cancelEventLaunch = createAsyncThunk(
  'eSocialEventLauch/cancelEventLaunch',
  async (
	params: { id: number; rejectionAndReturnReasonsId: number },
	{ rejectWithValue }
  ) => {
	try {
	  const { id, rejectionAndReturnReasonsId } = params;
	  const { data } = await api.cancel(id, rejectionAndReturnReasonsId);
	  return data;
	} catch (err: any) {
	  return rejectWithValue({ error: err.response.data });
	}
  }
);