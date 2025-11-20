import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import {
	TAgreementAuthorization,
	TAgreementAuthorizationSearch,
	renameProps,
} from 'src/core/models/agreement-authorization';
import api from 'src/core/api/agreement-authorization';
import { renameKeys } from 'src/core/utils/func';
import { pathOr } from 'ramda'

import { actions } from 'src/core/store';

export const fetchAgreementAuthorization = createAsyncThunk(
	'agreementAuthorization/fetch',
	async (params: TAgreementAuthorizationSearch, { dispatch }) => {
		const response = await api.list(params);
		dispatch(actions.pagination.setPageCount(response.data.pageCount))
		return renameKeys(renameProps)(response.data)
	}
);

export const getAgreementAuthorization = createAsyncThunk(
	'agreementAuthorization/get',
	async (id: number, { getState }) => {
		const { agreementAuthorization: { list } } = getState() as RootState

		const item = list.find((item) => item.id === id)
		if (item) return item

		const response = await api.list({ id });
		return renameKeys(renameProps)(pathOr({}, ['data', 'items', 0], response))
	}
);

export const addAgreementAuthorization = createAsyncThunk(
	'agreementAuthorization/add',
	async (values: TAgreementAuthorization, { rejectWithValue }) => {
		if (!values.folderNumber) return rejectWithValue('Pasta não encontrada')
		try {
			const normalizeValues = renameKeys(renameProps, true)(values)
			const response = await api.add(normalizeValues);
			const agreementAuthorizationId = response.data.id;
			if (agreementAuthorizationId && values.attachments.length) {
				try {
					const responseFile = await api.uploadFiles(agreementAuthorizationId, values.attachments);
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

