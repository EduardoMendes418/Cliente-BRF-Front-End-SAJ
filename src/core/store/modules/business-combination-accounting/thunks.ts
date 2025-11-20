import { createAsyncThunk } from '@reduxjs/toolkit';
import { ParamsGet } from "src/core/models"

import api from '../../../api/business-combination-accounting';
import { actions } from 'src/core/store';

export const fetchBusinessCombinationAccountingList = createAsyncThunk(
	'businessCombinationAccounting/fetch',
	async (params: ParamsGet, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(params);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

