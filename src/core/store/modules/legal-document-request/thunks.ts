import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	LegalDocumentRequestStatusEnum,
	TLegalDoc,
	TLegalDocFilter,
	TLegalDocStatusUpdate,
} from 'src/core/models/legal-document-request';
import api from 'src/core/api/legal-document-request';

import { actions } from 'src/core/store';

export const fetchLegalDocRequest = createAsyncThunk(
	'legalDocRequest/fetch',
	async (params: Partial<TLegalDocFilter>, { dispatch }) => {
		//TO ALL IN LEGAL DOCS REQUEST SEND 1,5,7
		const requestStatus = (params?.requestStatus === LegalDocumentRequestStatusEnum.ALL || !params.requestStatus)
			? [
				LegalDocumentRequestStatusEnum.ReturnedService,
				LegalDocumentRequestStatusEnum.InSignature,
				LegalDocumentRequestStatusEnum.InTreatment,
				LegalDocumentRequestStatusEnum.InformationPending,
				LegalDocumentRequestStatusEnum.Requested,
				LegalDocumentRequestStatusEnum.LegalValidation
			]
			: params.requestStatus;
		const response = await api.list({ ...params, requestStatus });
		dispatch(actions.pagination.setPageCount(response.data.pageCount))
		return response.data
	}
);

export const getLegalDocRequest = createAsyncThunk(
	'legalDocRequest/get',
	async (id: number) => {
		const response = await api.list({
			id, requestStatus: [
				LegalDocumentRequestStatusEnum.ReturnedService,
				LegalDocumentRequestStatusEnum.InSignature,
				LegalDocumentRequestStatusEnum.InTreatment,
				LegalDocumentRequestStatusEnum.InformationPending,
				LegalDocumentRequestStatusEnum.Requested,
				LegalDocumentRequestStatusEnum.LegalValidation
			]
		});
		return response.data.items[0];
	}
);

export const addLegalDocRequest = createAsyncThunk(
	'legalDocRequest/add',
	async (values: TLegalDoc, { rejectWithValue }) => {
		if (!values.folderNumbers) return rejectWithValue('Pasta não encontrada')
		try {
			const response = await api.add({
				...values,
				files: undefined
			});
			const legalDocumentId = response.data.id;
			if (legalDocumentId && values.files) {
				try {
					const responseFile = await api.uploadFiles(legalDocumentId, values.files);
					return responseFile.data;
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const editLegalDocRequest = createAsyncThunk(
	'legalDocRequest/edit',
	async (values: TLegalDoc, { rejectWithValue }) => {
		if (!values.folderNumbers) return rejectWithValue('Pasta não encontrada')
		try {
			const response = await api.edit(values);
			const legalDocumentId = response.data.id;
			if (legalDocumentId && values.files) {
				try {
					const responseFile = await api.uploadFiles(legalDocumentId, values.files);
					return responseFile.data;
				} catch (err: any) {
					return rejectWithValue(err.response.data);
				}
			}
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const setStatusDocRequest = createAsyncThunk(
	'legalDocRequest/setStatus',
	async (values: TLegalDocStatusUpdate, { rejectWithValue }) => {
		try {
			const response = await api.setStatus(values)
			return response.data
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	}
)