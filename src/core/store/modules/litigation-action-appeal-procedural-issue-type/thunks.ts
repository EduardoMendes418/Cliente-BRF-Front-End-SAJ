import { createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/core/api/litigation-action-appeal-procedural-issue-type';

export const fetchLitigationActionAppealProceduralIssueType = createAsyncThunk(
	'litigationActionAppealProceduralIssueType/list',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.list()
			return { items: response.data };
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
		
	}
);
