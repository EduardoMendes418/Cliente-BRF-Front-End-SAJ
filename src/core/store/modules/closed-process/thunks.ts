import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/core/api/closed-process";
import { TClosedProcessReport } from 'src/core/models/closed-process';
import { convertArrayBufferToObject } from "src/core/utils/func";

export const generateReport = createAsyncThunk(
	'closed-process/generateClosedProcessReport',
	async (values: TClosedProcessReport, { rejectWithValue }) => {
		try {
			const res = await api.generateClosedProcessReport(values);
			const type = res.headers['content-type']
			return new Blob([res.data], { type })
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response.data)
			return rejectWithValue(error);
		}
	}
);

export const circularizationOfficeLaunchProcess = createAsyncThunk(
	'closed-process/generateClosedProcessReport',
	async (values: any, { rejectWithValue }) => {
		try {
			const res = await api.circularizationOfficeLaunchProcess(values);
			return res.data
		} catch (err: any) {
			const error = err.response.data
			return rejectWithValue(error);
		}
	}
);