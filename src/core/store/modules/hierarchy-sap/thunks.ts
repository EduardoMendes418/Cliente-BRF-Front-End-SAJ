import { createAsyncThunk } from '@reduxjs/toolkit';
import { renamePropsSAP } from 'src/core/models/hierarchy';
import { renameKeys } from 'src/core/utils/func';
import api from '../../../api/hierarchy';

export const fetchSapHierarchy = createAsyncThunk(
	'sapHierarchy/fetch',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.getSapHierarchy(id.toString());
			return renameKeys(renamePropsSAP)(response.data) ?? {}
		} catch (err: any) {
			return rejectWithValue({ id, error: err.response.data });
		}
	},
);
