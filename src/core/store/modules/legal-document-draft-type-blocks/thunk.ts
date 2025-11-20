import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/legal-document-draft-type-blocks'

type ChangeIsActiveParams = {
	id: number,
	isActive: boolean,
}

export const setBlockIsActiveLegalDocDraftTypes = createAsyncThunk(
	'setBlockIsActiveLegalDocDraftTypes',
	async ({ id, isActive }: ChangeIsActiveParams, { rejectWithValue }) => {
		try {
			const response = await api.setBlockActive(id, isActive);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
