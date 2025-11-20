import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'src/core/api/litigation-jurisdictions'
import { TComarcaFilters } from 'src/core/models/litigation-jurisdictions'
import { actions } from '../..'
import {rejectNoValues} from "../../../utils/func";

export const fetchComarca = createAsyncThunk(
	'litigationJurisdictions/fetch',
	async (params: TComarcaFilters, { rejectWithValue, dispatch }) => {
		try {
			const filterClean = rejectNoValues(params)
			const response = await api.list(filterClean)
			const responseData = response.data?.litigationJurisdictions
			const { pageSize } = params

			pageSize && dispatch(actions.pagination.setPageCount(responseData.pageCount))
			return responseData
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data })
		}
	}
)