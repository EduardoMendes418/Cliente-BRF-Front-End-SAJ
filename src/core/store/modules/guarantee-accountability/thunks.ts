import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda'

import {
	renameProps,
	TGuaranteeAccountability,
	TGuaranteeAccountabilityFilters,
	TGuaranteeAccountabilityReverse
} from 'src/core/models/guarantee-accountability';
import { TUpdateStatus } from 'src/core/models/guarantee-accountability';
import api from 'src/core/api/guarantee-accountability';
import creditReceiptApi from "src/core/api/credit-receipt"
import { renameKeys } from 'src/core/utils/func';
import { ParamsGet } from 'src/core/models';
import { actions } from '../..';
import { sleep } from 'src/core/utils/sleep';
import FileSaver from 'file-saver';

export const fetchGuaranteeAccountability = createAsyncThunk(
	'guaranteeAccountability/fetch',
	async (values: TGuaranteeAccountabilityFilters, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.list(values);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return renameKeys(renameProps)(response.data)
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchGuaranteeAccountabilityGrid = createAsyncThunk(
	'guaranteeAccountabilityGrid/fetch',
	async (values: TGuaranteeAccountabilityFilters, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.listGrid(values);
			dispatch(actions.pagination.setPageCount(response.data.pageCount))
			return response.data
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getGuaranteeAccountability = createAsyncThunk(
	'guaranteeAccountability/get',
	async (id: number) => {
		const response = await api.list({ id });
		return renameKeys(renameProps)(pathOr({}, ['data', 'items', 0], response))
	}
);

export const addGuaranteeAccountability = createAsyncThunk(
	'guaranteeAccountability/add',
	async ({ files, ...values }: TGuaranteeAccountability, { rejectWithValue, getState }) => {
		try {
			const response = await api.add({ ...values });
			const accountabilityId = response.data.id;
			try {
				if (accountabilityId && files && files.length > 0)
					await api.uploadFiles(accountabilityId, files)
			} catch (error) {
				console.error(error)
			}

			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addGuaranteeAccountabilityMultiples = createAsyncThunk(
	'guaranteeAccountability/addMultiples',
	async ({ files, ...values }: any, { rejectWithValue, getState }) => {
		try {
			const response = await api.addMultiples({...values });

			if (files && files.length > 0) {
				for (const accountabilityId of values.evaluateAccountabilities.accountabilityIds) {
					await api.uploadFiles(accountabilityId, files)
					await sleep(1200)
				}
				
				for (const creditReceiptId of values.evaluateCreditReceipts.creditReceiptIds) {
					await creditReceiptApi.uploadFiles(creditReceiptId, false, files)
					await sleep(1200)
				}
			}

			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
export const addGuaranteeAccountabilityReverse = createAsyncThunk(
	'guaranteeAccountability/Reverse',
	async ({files, ...values }: TGuaranteeAccountabilityReverse, { rejectWithValue, getState }) => {
		try {
			const response = await api.addReversal({...values }) 

			if (files && files.length > 0) {
			
				for (const accountabilityId of response?.data?.accountabilityIds ?? []) {
					await api.uploadFiles(accountabilityId, files)
					await sleep(1200)
				}
				
				for (const creditReceiptId of response?.data?.creditReceiptIds) {
					await creditReceiptApi.uploadFiles(creditReceiptId, false, files)
					await sleep(1200)
				}
			}
			// if (response?.data.control !== "")

			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
export const addGuaranteeCreditMultiples = createAsyncThunk(
	'guaranteeCredit/addMultiples',
	async ({ files, ...values }: any, { rejectWithValue, getState }) => {
		try {
			const response = await api.addCreditMultiples({...values });

			if (files && files.length > 0) {
				for (const accountabilityId of values.evaluateAccountabilities.accountabilityIds) {
					await api.uploadFiles(accountabilityId, files)
					await sleep(1200)
				}
				
				for (const creditReceiptId of values.evaluateCreditReceipts.creditReceiptIds) {
					await creditReceiptApi.uploadFiles(creditReceiptId, false, files)
					await sleep(1200)
				}
			}

			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editGuaranteeAccountability = createAsyncThunk(
	'guaranteeAccountability/edit',
	async ({
		generateLog,
		files,
		...values
	}: TGuaranteeAccountability & { id: number, generateLog?: TUpdateStatus },
		{ rejectWithValue }) => {
		try {
			const normalizedValues = renameKeys(renameProps, true)(values);
			const calls = [api.edit({...normalizedValues})]
			if (files && files.length > 0) {
				calls.push(api.uploadFiles(normalizedValues.id, files))
			}

			const response = await Promise.all(calls)

			if (response && generateLog) await api.updateStatus({
				id: normalizedValues.id,
				statusFlowId: generateLog.statusFlowId,
				observation: generateLog.observation
			}) 
			return response

		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const updateStatusGuaranteeAccountability = createAsyncThunk(
	'guaranteeAccountability/updateStatus',
	async (values: TUpdateStatus, { rejectWithValue }) => {
		try {
			if (values.attachments && values.attachments.length > 0)
				await api.uploadFiles(Number(values.id), values.attachments);

			const response = await api.updateStatus(values);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchGuaranteeAccountabilityDepositList = createAsyncThunk(
	'guaranteeAccountability/fetchDepositList',
	async (values: ParamsGet & { folderNumber: string }, { rejectWithValue }) => {
		try {
			const response = await api.listDeposit(values);
			return (response.data)
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchGetAccontabilityByFolder = createAsyncThunk(
	'guaranteeAccountability/getAccontabilityByFolder',
	async ( folderNumber: string, { rejectWithValue }) => {
		try {
			const response = await api.getAccontabilityByFolder({folderNumber, statusFlowId:1});
			return (response.data)
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const guaranteeAccountabilityAccounting = createAsyncThunk(
	'guaranteeAccountability/getAccounting',
	async (id: number) => {
		const response = await api.getAccounting(id);

		return response.data?.items
	}
);

export const guaranteeAccountabilityFiles = createAsyncThunk(
	'guaranteeAccountability/getFiles',
	async (id: number) => {
		const response = await api.getFiles(id);
		const blob = new Blob([response.data], {
			type: 'application/zip'
		})
		FileSaver(blob as Blob, 'prestação_de_conta.zip')
		
		return pathOr({}, ['data', 'items', response.data?.items?.length - 1], response);
	}
);