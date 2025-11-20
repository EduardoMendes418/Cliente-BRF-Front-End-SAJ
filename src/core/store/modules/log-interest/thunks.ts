import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/log-interest';
import { ParamsGet } from 'src/core/models';
import { actions, RootState } from "../..";

export const fetchLogInterest = createAsyncThunk(
	'logInterest/list',
	async (params: ParamsGet & {folderNumber?: string}, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(params)
			dispatch(actions.pagination.setPageCount(response.data.pageCount));
			dispatch(actions.pagination.setItemCount(response.data.itemCount));
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
