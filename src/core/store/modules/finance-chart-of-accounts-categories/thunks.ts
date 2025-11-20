import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/finance-chart-of-accounts-categories';
import { TModulosId } from 'src/core/models/modules';
import { ParamsGet } from 'src/core/models';
import { actions } from '../..';

export const fetchFinanceChartOfAccountsCategoriesList = createAsyncThunk(
	'financeChartOfAccountsCategories/fetch',
	async (values: ParamsGet & { moduleId: TModulosId }, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);