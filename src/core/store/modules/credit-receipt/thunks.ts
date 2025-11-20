import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda';

import api from 'src/core/api/credit-receipt';
import {
	TCreditReceipt,
	TCreditReceiptParams,
	TUpdateStatus
} from 'src/core/models/credit-receipt';
import {
	TGuaranteeAccountabilityReverse
} from 'src/core/models/guarantee-accountability';
import { actions, RootState } from '../..';
import apiAccountability from 'src/core/api/guarantee-accountability';
import { sleep } from 'src/core/utils/sleep';


export const fetchCreditReceiptList = createAsyncThunk(
	'creditReceipt/fetch',
	async (params: TCreditReceiptParams, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(params);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addGuaranteeCreditReceipReverse = createAsyncThunk(
	'creditReceipt/Reverse',
	async ({files, ...values }: TGuaranteeAccountabilityReverse, { rejectWithValue, getState }) => {
		try {
			const response = await api.addReversal({...values }) 

			if (files && files.length > 0) {
			
				for (const accountabilityId of response?.data?.accountabilityIds ?? []) {
					await apiAccountability.uploadFiles(accountabilityId, files)
					await sleep(1200)
				}
				
				for (const creditReceiptId of response?.data?.creditReceiptIds) {
					await api.uploadFiles(creditReceiptId, false, files)
					await sleep(1200)
				}
			}

			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
export const fetchCreditReceiptById = createAsyncThunk(
	'creditReceipt/fetchById',
	async (id: number, { rejectWithValue, getState }) => {
		try {
			const { creditReceipt: { list } } = getState() as RootState;

			const item = list.find((item) => item.id === id);
			if (item) return item;

			const response = await api.list({id, page:1, pageSize:10});
			return pathOr({}, ['data', 'items', 0], response);
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addCreditReceipt = createAsyncThunk(
	'creditReceipt/add',
	async (value: TCreditReceipt, { rejectWithValue }) => {
		try {
			const { files, requestFiles, evaluationFiles, ...data } = value;

			const response = await api.add(data);
			const creditReceiptId = response.data.id;

			if (creditReceiptId && requestFiles && requestFiles.length > 0) {
				const responseFile = await api.uploadFiles(creditReceiptId, true, requestFiles as any);
				return responseFile.data;
			}
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editCreditReceipt = createAsyncThunk(
	'creditReceipt/edit',
	async (value: TCreditReceipt & { id: number, updateStatusFlow?: TUpdateStatus }, { rejectWithValue }) => {
		try {
			const { files, requestFiles, evaluationFiles, updateStatusFlow, ...data } = value;
			const response = await api.edit(data);

			const requestFilesToAdd = (requestFiles ?? []).filter((file) => !file.id);
			const evaluationFilesToAdd = (evaluationFiles ?? []).filter((file) => !file.id);

			const calls = [];
			if (requestFilesToAdd.length > 0) calls.push(api.uploadFiles(value.id, true, requestFilesToAdd as any));
			if (evaluationFilesToAdd.length > 0) calls.push(api.uploadFiles(value.id, false, evaluationFilesToAdd as any));
			if (updateStatusFlow) calls.push(api.updateStatusFlow(updateStatusFlow))

			if (calls.length) return await Promise.all(calls);

			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const deleteCreditReceiptFile = createAsyncThunk(
	'creditReceipt/deleteFile',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await api.deleteFile(id);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);