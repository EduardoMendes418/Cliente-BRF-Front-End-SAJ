import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/legal-document-draft-type-variables'

type ChangeIsActiveParams = {
	id: number,
	isActive: boolean,
}

export const setVariableIsActiveLegalDocDraftTypes = createAsyncThunk(
	'setVariableIsActiveLegalDocDraftTypes',
	async ({ id, isActive }: ChangeIsActiveParams, { rejectWithValue }) => {
		try {
			const response = await api.setVariableActive(id, isActive);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);