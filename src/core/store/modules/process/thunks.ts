import { createAsyncThunk } from '@reduxjs/toolkit';
import { pathOr } from 'ramda';

import api, { TParamsProcessFolders, TParamProcessStatisticalOrderCalculate } from 'src/core/api/process';
import { TProcess } from 'src/core/models/process';
import { t } from 'src/locale/i18n';
import { actions, RootState } from '../..';
import { finderParty } from '../func';
import { fetchPaymentType } from '../payment-type/thunks';

const getParteContrariaID = (json: TProcess) => json.processParties.find(finderParty('OUTRA PARTE'))?.contactId ?? null

export const fetchIndividual = createAsyncThunk(
	'process/fetchIndividual',
	async (individualID: number, { rejectWithValue }) => {
		try {
			const response = await api.getIndividual(individualID);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchProcessFolder = createAsyncThunk(
	'process/fetchFolder',
	async ({ folderNumber, noValidateDejurArea }: { folderNumber: string; noValidateDejurArea?: boolean }, { rejectWithValue, dispatch, getState }) => {
		try {
			
			if (!folderNumber) return {};
			if (folderNumber.includes('/')) { folderNumber = folderNumber.replace('/', '-'); }
			const { currentUser: { data: { responsibleAreas, dejurAreas } } } = getState() as RootState;
			const { data } = await api.getFolder(folderNumber);

			if (!responsibleAreas?.includes(data.responsibleAreaId))
				return rejectWithValue('Sem permissões de acesso para esta Área responsável');

			if (!noValidateDejurArea && !dejurAreas?.includes(data.legalDepartmentAreaId))
				return rejectWithValue('Sem permissões de acesso para esta Área DEJUR');

			const parteContrariaID = getParteContrariaID(data);
			if (parteContrariaID) dispatch(fetchIndividual(parteContrariaID)); 
			return data;
		} catch (err: any) {
			if (err.response.status === 404) {
				return rejectWithValue(err.response.data);
			} else {
				return rejectWithValue(pathOr('Ocorreu um erro', ['response', 'data', 'detail'], err));
			}
		}
	}
);


export const fetchFolder = createAsyncThunk(
	'process/fetchFolder',
	async ({ folderNumber }: { folderNumber: string;}, { rejectWithValue }) => {
		try {
			
			if (!folderNumber) return {};
			if (folderNumber.includes('/')) { folderNumber = folderNumber.replace('/', '-'); }
	
			const { data } = await api.getFolder(folderNumber);

			return data;
		} catch (err: any) {
			if (err.response.status === 404) {
				return rejectWithValue(err.response.data);
			} else {
				return rejectWithValue(pathOr('Ocorreu um erro', ['response', 'data', 'detail'], err));
			}
		}
	}
);

export const fetchProcessFolderPayW = createAsyncThunk(
	'process/fetchProcessFolderPayW',
	async ({ folderNumber, noValidateDejurArea }: { folderNumber: string; noValidateDejurArea?: boolean; }, { rejectWithValue, dispatch, getState }) => {
		try {
			if (!folderNumber) return {};
			if (folderNumber.includes('/')) { folderNumber = folderNumber.replace('/', '-'); }
			const { currentUser: { data: { responsibleAreas, dejurAreas } } } = getState() as RootState;
			const { data } = await api.getFolder(folderNumber);
	
			if (!responsibleAreas?.includes(data.responsibleAreaId))
				return rejectWithValue('Sem permissões de acesso para esta Área responsável');

			if (!noValidateDejurArea && !dejurAreas?.includes(data.legalDepartmentAreaId))
				return rejectWithValue('Sem permissões de acesso para esta Área DEJUR');

			if (data.statusId === 4) return rejectWithValue('Pasta/CTG com status Morto, não permite lançamento');
			if (data.statusId === 3 ) return rejectWithValue('Pasta/CTG com status Baixa provisória, não permite lançamento');

			const parteContrariaID = getParteContrariaID(data);

			if (parteContrariaID) dispatch(fetchIndividual(parteContrariaID));
			return data;
		} catch (err: any) {
			if (err.response.status === 404) {
				return rejectWithValue(t('folderNotFound'));
			} else {
				return rejectWithValue(pathOr('Ocorreu um erro', ['response', 'data', 'detail'], err));
			}
		}
	}
);

export const fetchProcessFolderPaymentRequest = createAsyncThunk(
	'process/fetchProcessFolderPayW',
	async ({ folderNumber, noValidateDejurArea, tipoPagamentoId }: { folderNumber: string; noValidateDejurArea?: boolean; tipoPagamentoId?: any }, { rejectWithValue, dispatch, getState }) => {
		try {
			if (!folderNumber) return {};
			if (folderNumber.includes('/')) { folderNumber = folderNumber.replace('/', '-'); }
			const { currentUser: { data: { responsibleAreas, dejurAreas } } } = getState() as RootState;
			const { data } = await api.getFolder(folderNumber);
			const { payload } = await dispatch(fetchPaymentType({id: +tipoPagamentoId}))

			if (!responsibleAreas?.includes(data.responsibleAreaId))
				return rejectWithValue('Sem permissões de acesso para esta Área responsável');

			if (!noValidateDejurArea && !dejurAreas?.includes(data.legalDepartmentAreaId))
				return rejectWithValue('Sem permissões de acesso para esta Área DEJUR');

			if (data?.statusId === 4) return rejectWithValue('Pasta/CTG com status Morto, não permite lançamento');
			if (data?.statusId === 3 && payload?.solicitarPagamentoBaixaProvisoria === false) return rejectWithValue('Pasta/CTG com status Baixa provisória, não permite lançamento');

			const parteContrariaID = getParteContrariaID(data);

			if (parteContrariaID) dispatch(fetchIndividual(parteContrariaID));
			return data;
		} catch (err: any) {
			if (err.response.status === 404) {
				return rejectWithValue(t('folderNotFound'));
			} else {
				return rejectWithValue(pathOr('Ocorreu um erro', ['response', 'data', 'detail'], err));
			}
		}
	}
);

export const fetchProcessFolders = createAsyncThunk(
	'process/fetchProcessFolders',
	async ({ page, pageSize }: TParamsProcessFolders, { rejectWithValue, dispatch }) => {
		try {
			const { data } = await api.getProcessFolders({ page, pageSize });
			dispatch(actions.pagination.setPageCount(data.pageCount))
			return data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchProcessStatisticalOrderCalculate = createAsyncThunk(
	'process/StatisticalOrderCalculate',
	async ({
		page,
		pageSize,
		id,
		folderNumber,
		RequesterDate,
		LocationId,
		ContraryPartyId,
	}: TParamProcessStatisticalOrderCalculate, { rejectWithValue, dispatch }) => {
		try {
			const { data } = await api.getProcessStatisticalOrderCalculate({
				id, page, pageSize,
				folderNumber, RequesterDate,
				LocationId, ContraryPartyId,
			});

			dispatch(actions.pagination.setPageCount(data.pageCount))
			return data;
		} catch (err: any) {
			if (err.response.status === 404) {
				return rejectWithValue(t('folderNotFound'));
			} else {
				return rejectWithValue(pathOr('Ocorreu um erro', ['response', 'data', 'detail'], err));
			}
		}
	}
);

export const fetchStatisticalOrderCalculate = createAsyncThunk(
	'process/fetchStatisticalOrderCalculate',
	async ({ folderNumber, noValidateDejurArea }: { folderNumber: string; noValidateDejurArea?: boolean }, { rejectWithValue, dispatch, getState }) => {
		try {
			if (!folderNumber) return {};
			const { currentUser: { data: { responsibleAreas, dejurAreas } } } = getState() as RootState

			const { data } = await api.getStatisticalOrderCalculate({ folderNumber });

			if (!responsibleAreas?.includes(data.responsibleAreaId))
				return rejectWithValue('Sem permissões de acesso para esta Área responsável');

			if (!noValidateDejurArea && !dejurAreas?.includes(data.legalDepartmentAreaId))
				return rejectWithValue('Sem permissões de acesso para esta Área DEJUR');

			const parteContrariaID = getParteContrariaID(data);
			if (parteContrariaID) dispatch(fetchIndividual(parteContrariaID));

			return { ...data };
		} catch (err: any) {
			if (err.response.status === 404) {
				return rejectWithValue(t('folderNotFound'));
			} else {
				return rejectWithValue(pathOr('Ocorreu um erro', ['response', 'data', 'detail'], err));
			}
		}
	}
);

export const fetchContingencies = createAsyncThunk(
	'process/fetchContingencies',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getContingencies();
			const { contingencies } = response.data;
			return contingencies;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchSpheres = createAsyncThunk(
	'process/fetchSpheres',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getSpheres();
			const { sphere } = response.data;
			return sphere;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchStatuses = createAsyncThunk(
	'process/fetchStatuses',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getStatuses();
			const { statuses } = response.data;
			return statuses;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchResults = createAsyncThunk(
	'process/fetchResults',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getResults();
			const { results } = response.data;
			return results;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchClosing = createAsyncThunk(
	'process/fetchClosing',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getClosing();
			const { closing } = response.data;
			return closing;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const fetchSpeciesCategory = createAsyncThunk(
	'process/fetchSpeciesCategory',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getSpeciesCategory();
			const { speciesCategory } = response.data;
			return speciesCategory;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	}
);
