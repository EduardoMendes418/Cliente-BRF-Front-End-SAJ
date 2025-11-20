import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/correction-rule';
import { TCorrectionRuleParams, TSubmitCorrectionRules, TCorrectionRule } from 'src/core/models/correction-rule';
import { actions } from '../..';

export const fetchCorrectionRuleList = createAsyncThunk(
	'correctionRule/fetch',
	async (values: TCorrectionRuleParams, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			dispatch(actions.correctionRule.setNoCorrectionRuleForFormulaId(response.data.itemCount === 0))

			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editAccountType = createAsyncThunk(
	'correctionRule/edit',
	async (values: TCorrectionRule, { rejectWithValue }) => {
		try {
			const response = await api.edit(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

export const submitCorrectionRules = createAsyncThunk(
	'correctionRule/submit',
	async ({ itemsToAdd, itemsToEdit, itemsToDelete }: TSubmitCorrectionRules, { rejectWithValue }) => {
		try {

			const calls = [];
			if (itemsToAdd && itemsToAdd.length) calls.push(api.add(itemsToAdd.map(({ id, ...item }) => item)))
			if (itemsToEdit && itemsToEdit.length) itemsToEdit.map((item) => calls.push(api.edit(item)))
			if (itemsToDelete && itemsToDelete.length) itemsToDelete.map((item) => calls.push(api.delete(Number(item.id))))

			const response = await Promise.all(calls);

			return response;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
