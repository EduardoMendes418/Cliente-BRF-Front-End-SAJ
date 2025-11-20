import { createAsyncThunk } from '@reduxjs/toolkit';
import { TReportConfiguration, TReportConfigurationFilter } from 'src/core/models/report-configuration';
import api from 'src/core/api/report-configuration';
import { actions, RootState } from '../..';
import { ParamsGet } from 'src/core/models';
import { pathOr } from 'ramda';

export const fetchReportConfiguration = createAsyncThunk(
	'reportConfiguration/fetch',
	async (values: ParamsGet & TReportConfigurationFilter, { rejectWithValue, dispatch }) => {
		try {

			const response = await api.list(values);
			const reportFilterFields = response.data[0].reportFilterFields;
				
			reportFilterFields.forEach((element: any) => {
				if(element?.value?.length > 15){
					element.value = element.value.split(',')
				}
			}); 

			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return { items: response.data }
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const getReportConfiguration = createAsyncThunk(
	'reportConfiguration/get',
	async (id: number, { getState }) => {
		const { reportConfiguration: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.list({ id });
		return pathOr({}, ['data', 0], response)
	}
);

export const addReportConfiguration = createAsyncThunk(
	'reportConfiguration/add',
	async (values: TReportConfiguration, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data.id;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const editReportConfiguration = createAsyncThunk(
	'reportConfiguration/edit',
	async (values: TReportConfiguration, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const deleteReportConfiguration = createAsyncThunk(
	'reportConfiguration/delete',
	async (values: TReportConfiguration, { rejectWithValue }) => {
		try {
			await api.delete({...values, isDeleted: true});
			return values;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);
