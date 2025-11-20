import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda';

import api from 'src/core/api/formula-correction-rule';
import { ParamsGet } from 'src/core/models';
import { TFormulaCorrectionRule, TFormulaCorrectionRuleFilters } from 'src/core/models/formula-correction-rule';
import { rejectNoValues } from 'src/core/utils/func';
import { actions } from '../..';

export const fetchFormulaCorrectionRuleList = createAsyncThunk(
	'formulaCorrectionRule/fetch',
	async (values: TFormulaCorrectionRuleFilters & ParamsGet, { rejectWithValue, dispatch }) => {
		try {
			const params = rejectNoValues(values)
			const fetchList = !values.isPage ? api.listIsActiveDefault : api.listAll
			const response = await fetchList(params) ;

			if (!values.notPaginate)
				dispatch(actions.pagination.setPageCount(response.data.pageCount))

			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchFormulaCorrectionRuleOptions = createAsyncThunk(
	'formulaCorrectionRuleOptions/fetch',
	async (values: { isActive?: boolean }, { rejectWithValue, dispatch }) => {
		try {
			const params = rejectNoValues(values)
			const response = await api.listAll(params) ;

			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchFormulaCorrectionRuleById = createAsyncThunk(
	'formulaCorrectionRule/fetchById',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.getById(id);
			return pathOr({}, ['data', 'items', 0], response);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addFormulaCorrectionRule = createAsyncThunk(
	'formulaCorrectionRule/add',
	async (values: TFormulaCorrectionRule, { rejectWithValue }) => {
		try {
			const response = await api.add(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editFormulaCorrectionRule = createAsyncThunk(
	'formulaCorrectionRule/edit',
	async (values: TFormulaCorrectionRule, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const deleteFormulaCorrectionRule = createAsyncThunk(
	'formulaCorrectionRule/delete',
	async (id: number, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.delete(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
