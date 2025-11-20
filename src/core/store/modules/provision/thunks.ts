import { createAsyncThunk } from '@reduxjs/toolkit';

import api from 'src/core/api/provision';
import apiBusiness from 'src/core/api/business-combination-accounting';
import {
	TProvisionReportPost,
	TBusinessCombinationParameters,
	ProvisionRequestReportFilter
} from 'src/core/models/provision'
import { convertArrayBufferToObject, rejectNoValues } from 'src/core/utils/func';
import { ORDER_EXPECTATIONS } from 'src/screen/provisions/utils/constantes';
import { TProvisionOrder } from 'src/core/models/provision-order';
import { actions } from '../..';

const b64toBlob = (b64Data: any, contentType='', sliceSize=512) => {
	const byteCharacters = atob(b64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
	  const slice = byteCharacters.slice(offset, offset + sliceSize);

	  const byteNumbers = new Array(slice.length);
	  for (let i = 0; i < slice.length; i++) {
		byteNumbers[i] = slice.charCodeAt(i);
	  }

	  const byteArray = new Uint8Array(byteNumbers);
	  byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, {type: contentType});
	return blob;
  }

export const generateReport = createAsyncThunk(
	'provision/generateProvisionReport',
	async (data: TProvisionReportPost, { rejectWithValue }) => {
		try {
			const response = await api.generateProvisionReport(data);
			const type = response.headers['content-type']
			return new Blob([response.data], { type });
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response.data)
			return rejectWithValue(error);
		}
	}
);

export const businessCombination = createAsyncThunk(
	'provision/businessCombination',
	async (values: TBusinessCombinationParameters, { rejectWithValue }) => {
		try {
			
			const normalizedValues = rejectNoValues({
				...values,
				competence: values?.competence !== null ? `${values?.competence?.slice(0, 8)}01` : null
			}) as TBusinessCombinationParameters

			const response = await api.getBusinessCombination(normalizedValues) as any;
			const { executeContabilization, reportFile } = response.data;
			if (executeContabilization) apiBusiness.account(normalizedValues);
			const { fileContents, contentType } = reportFile
			return b64toBlob(fileContents, contentType);
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
);

type generateGridParams = {
	folderNumber: string
	orderExpectationId: ORDER_EXPECTATIONS | null
}

export const generateGrid = createAsyncThunk(
	'provision/generateGrid',
	async (params: generateGridParams, { rejectWithValue }) => {
		try {
			const { folderNumber, orderExpectationId } = rejectNoValues(params) as generateGridParams
			const response = await api.getGrid(folderNumber, orderExpectationId)
			return response.data?.rows || []
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
)

export const updateValues = createAsyncThunk(
	'provision/updateValues',
	async (folderNumber: string, { rejectWithValue }) => {
		try {
			const response = await api.updateValues(folderNumber)
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
)

export const simulateFormulaByOrders = createAsyncThunk(
	'provision/simulateFormulaByOrders',
	async (orders: TProvisionOrder[], { rejectWithValue }) => {
		try {
			const response = await api.simulateFormulaByOrders(orders)
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
)

type simulateFormulaAndGenerateGridParams = {
	orders: TProvisionOrder[]
	orderExpectationId: ORDER_EXPECTATIONS | null
	folderNumber?: string
}

export const simulateFormulaAndGenerateGrid = createAsyncThunk(
	'provisionOrder/simulateFormulaAndGenerateGrid',
	async ({ orders, orderExpectationId, folderNumber }: simulateFormulaAndGenerateGridParams) => {
		const params = rejectNoValues({ folderNumber, orderExpectationId })

		const response = await api.simulateFormulaByOrders(orders)
			.then((simulationResponse: any) => api.getSimulatedGrid(params, simulationResponse.data))

		return response?.data?.rows ?? []
	}
)

export const generateProvisionReportRequest = createAsyncThunk(
	'provision/generateProvisionReportRequest',
	async (params: ProvisionRequestReportFilter, { rejectWithValue, dispatch }) => {
		try {
			const response = await api.generateProvisionReportRequest(params)
			const type = response.headers['content-type']
			const totalItems = Number(response.headers['x-total-count']);
			dispatch(actions.reportItemsCount.setTotalItems(isNaN(totalItems) ? 0 : totalItems))
			return new Blob([response.data], { type })
		} catch (err: any) {
			const error = convertArrayBufferToObject(err.response.data)
			return rejectWithValue(error);
		}
	}
)

type pagination = {
	pageSize: number,
	page: number
}

export const getReportExecutionManagerGridList = createAsyncThunk(
	'provision/updateValues',
	async ({pageSize, page}: pagination, { rejectWithValue }) => {
		try {
			const response = await api.getReportExecutionManagerGridList(pageSize, page)
			return response.data
		} catch (err: any) {
			return rejectWithValue({ error: err.response.data });
		}
	}
)
