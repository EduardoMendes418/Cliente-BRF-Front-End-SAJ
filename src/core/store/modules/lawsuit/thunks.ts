import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/lawsuit';

export const RunIntegrationByFolderIds = createAsyncThunk(
	'lawsuit/RunIntegrationByFolderIds',
	async (params: any, { rejectWithValue }) => {
			const response = await api.postByFolderIds(params);
				return response.data	
	}
);

export const RunIntegrationByListFolderNumber = createAsyncThunk(
	'lawsuit/RunIntegrationByListFolderNumber',
	async (params: any, { rejectWithValue }) => {
			const response = await api.postByFolderNumber(params);
				return response.data
	}
);

