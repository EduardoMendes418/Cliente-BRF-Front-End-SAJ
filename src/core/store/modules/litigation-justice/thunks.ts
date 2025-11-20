import {createAsyncThunk} from "@reduxjs/toolkit";

import api from "src/core/api/litigation-justice"
import {getAxiosError} from "../../../utils/func";

export const fetchLitigationJustice = createAsyncThunk(
	"litigationJustice/list", 
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.list()
			return response.data
		} catch (err: any) {
			return rejectWithValue(getAxiosError(err)?.response)
		}
})