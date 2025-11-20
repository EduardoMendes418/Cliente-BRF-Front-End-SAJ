import { createSlice } from '@reduxjs/toolkit';
import { TState } from 'src/core/models';
import { TCreditReceipt, TCreditReceiptFilters  } from 'src/core/models/credit-receipt';
import { caseDefault, caseDefaultRegister, clears } from '..';
import {
	fetchCreditReceiptList,
	fetchCreditReceiptById,
	addCreditReceipt,
	editCreditReceipt,
	addGuaranteeCreditReceipReverse
} from './thunks';

export type State = {
	item: TCreditReceipt;
	list: TCreditReceipt[];
	listFilters: { [page: string]: TCreditReceiptFilters };
	willLinkAPayment: boolean;
	folderNumber: string;
};

const initialState: TState & State = {
	status: 'initial',
	error: '',
	item: {} as TCreditReceipt,
	list: [] as TCreditReceipt[],
	listFilters: {} as { [page: string]: TCreditReceiptFilters },
	willLinkAPayment: false,
	folderNumber: '',
};

const slice = createSlice({
	name: 'creditReceipt',
	initialState,
	reducers: {
		...clears(initialState),

		setFilters(state, { payload }) {
			state.listFilters[payload.page] = payload.filters;
		},

		setWillLinkAPayment(state, action) {
			state.willLinkAPayment = action.payload;
		},

		setFolderNumber(state, action) {
			state.folderNumber = action.payload;
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchCreditReceiptList)
		caseDefault(addCase, fetchCreditReceiptById, 'item')
		caseDefaultRegister(addCase, addCreditReceipt, 'added')
		caseDefaultRegister(addCase, addGuaranteeCreditReceipReverse, 'added')
		caseDefaultRegister(addCase, editCreditReceipt, 'edited')
	},
});

export default slice;
