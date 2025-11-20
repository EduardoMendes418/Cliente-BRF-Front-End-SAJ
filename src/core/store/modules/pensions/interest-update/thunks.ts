import { createAsyncThunk } from '@reduxjs/toolkit'
import pensionRequestAPI from 'src/core/api/pension-request'
import { TPeriodDateFilter } from 'src/core/models/pensions'

export const getActiveMonths = createAsyncThunk(
	'pensionInterestUpdate/getActiveMonths',
	async (params: TPeriodDateFilter, { rejectWithValue }) => {
		try {
			const response = await pensionRequestAPI.getActiveMonths(params)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const generateSinglePayment = createAsyncThunk(
	'pensionInterestUpdate/generatePayment',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await pensionRequestAPI.generateSinglePayment(id)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)

export const generatePayments = createAsyncThunk(
	'pensionInterestUpdate/generatePayment',
	async (dates: TPeriodDateFilter, { rejectWithValue }) => {
		try {
			const response = await pensionRequestAPI.generatePayments(dates)
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
)
