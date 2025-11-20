import { createAsyncThunk } from '@reduxjs/toolkit';
import { TReportDictionaryFilter } from 'src/core/models/report-dictionary';
import api from 'src/core/api/report-dictionary';

export const fetchReportDictionary = createAsyncThunk(
	'reportDictionary/fetch',
	async ({ reportComponent }: TReportDictionaryFilter, { rejectWithValue }) => {
		try {
			const response = await api.list({ reportComponent });
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const fetchReportDictionaryConfiguration = createAsyncThunk(
	'reportDictionary/fetch',
	async ({ reportComponent }: TReportDictionaryFilter, { rejectWithValue }) => {
		try {
			const response = await api.getReportConfiguration({ reportComponent });
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);


