import { createSlice } from '@reduxjs/toolkit';
import { TComplementData, TPaymentRequestFilters } from 'src/core/models/payment';
import { TPayment } from 'src/core/models/inspection';
import {
	fetchPaymentInspectionList,
	addPaymentInspectionRequest,
	getPaymentInspection,
	updateStatusPaymentInspectionRequest,
	getPaymentInspectionAccounting,
} from './thunks';
import { TAccountingData, TState } from 'src/core/models';
import { caseDefault, caseDefaultRegister, clears } from '..';

export type State = {
	list: TPayment[];
	listFilters: { [page: string]: TPaymentRequestFilters };
	item: TPayment & TComplementData;
	folderNumber: string;
	tipoPagamentoId: number;
	formaPagamentoId: number;
	valorTotalGuia: any;
	folderNumberRequired: any;
	accounting: TAccountingData;
};

const initialState: TState & State = {
	list: [] as TPayment[],
	listFilters: {} as { [page: string]: TPaymentRequestFilters },
	item: {} as TPayment & TComplementData,
	folderNumber: '',
	tipoPagamentoId: NaN,
	formaPagamentoId: NaN,
	valorTotalGuia: NaN,
	folderNumberRequired: null,
	status: 'initial',
	error: '',
	accounting: {} as TAccountingData
};

const slice = createSlice({
	name: 'inspection',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, { payload }) => {
			state.item = payload;
		},

		setFolderNumber: (state, { payload }) => {
			state.folderNumber = payload;
		},

		setPaymentTypeId: (state, { payload }) => {
			state.tipoPagamentoId = payload;
		},

		setPaymentMethodId: (state, { payload }) => {
			state.formaPagamentoId = payload;
		},

		setValorTotalGuia: (state, {payload}) => {
			state.valorTotalGuia = payload
		},

		addSolicitacao(state, { payload }) {
			state.folderNumber = payload.folderNumber;
			state.tipoPagamentoId = payload.tipoPagamentoId;
			state.formaPagamentoId = payload.formaPagamentoId;
		},

		setFilters(state, { payload }) {
			state.listFilters[payload.page] = payload.filters;
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefaultRegister(addCase, addPaymentInspectionRequest, 'edited')
		caseDefaultRegister(addCase, updateStatusPaymentInspectionRequest, 'edited')
		caseDefault(addCase, getPaymentInspection, 'item')
		caseDefault(addCase, fetchPaymentInspectionList)
		caseDefault(addCase, getPaymentInspectionAccounting, 'accounting')
	},
});

export default slice;
