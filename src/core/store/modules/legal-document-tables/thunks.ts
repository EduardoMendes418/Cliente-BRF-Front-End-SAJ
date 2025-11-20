import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/legal-document-tables'
import { TableOptionStructure } from 'src/core/models/legal-document-tables'

export const getLegalDocTables = createAsyncThunk<TableOptionStructure[]>(
	'legalDocTables/get',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.list()
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)
