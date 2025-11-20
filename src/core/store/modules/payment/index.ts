import { createSlice } from '@reduxjs/toolkit';
import { TComplementData, TPayment, TPaymentBank, TPaymentRequestFilters, TRatValues } from 'src/core/models/payment';
import * as F from './thunks';
import { TAccountingData, TState } from 'src/core/models';
import { caseDefault, caseDefaultRegister, clears } from '..';

export type State = {
	list: TPayment[];
	listFilters: { [page: string]: TPaymentRequestFilters };
	item: TPayment & TComplementData;
	folderNumber: string;
	tipoPagamentoId: number;
	formaPagamentoId: number;
	accounting: TAccountingData[];
	ratValues?: TRatValues;
	banks?: TPaymentBank[];
	modalESocialLinkId: number
};

const initialState: TState & State = {
	list: [] as TPayment[],
	listFilters: {} as { [page: string]: TPaymentRequestFilters },
	item: {} as TPayment & TComplementData,
	folderNumber: '',
	tipoPagamentoId: NaN,
	formaPagamentoId: NaN,
	status: 'initial',
	error: '',
	accounting: {} as TAccountingData[],
	modalESocialLinkId: 0,
};

const slice = createSlice({
	name: 'paymentRequest',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, { payload }) => {
			state.item = payload;
		},

		setModalESocialLinkId: (state, { payload }) => {
			state.modalESocialLinkId = payload;
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
		caseDefaultRegister(addCase, F.addPaymentRequest, 'edited')
		caseDefaultRegister(addCase, F.updateStatusPaymentRequest, 'edited')
		caseDefault(addCase, F.getPayment, 'item')
		caseDefault(addCase, F.fetchSolicitacao)
		caseDefault(addCase, F.fetchSolicitacaoGrid)
		caseDefault(addCase, F.fetchPensionPayment)
		caseDefault(addCase, F.getPaymentAccounting, 'accounting')
		caseDefault(addCase, F.getRatValues, "ratValues")
		caseDefault(addCase, F.getPaymentBanks, "banks")
		caseDefault(addCase, F.rawEditPaymentRequest, 'edited')
		caseDefaultRegister(addCase, F.editPaymentRequest, 'edited')
		caseDefaultRegister(addCase, F.editPaymentRequestSimple, 'edited')
	},
});

export default slice;
