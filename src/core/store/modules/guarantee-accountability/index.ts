import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	fetchGuaranteeAccountability,
	getGuaranteeAccountability,
	addGuaranteeAccountability,
	editGuaranteeAccountability,
	updateStatusGuaranteeAccountability,
	fetchGuaranteeAccountabilityDepositList,
	fetchGetAccontabilityByFolder,
	guaranteeAccountabilityAccounting,
	addGuaranteeAccountabilityMultiples,
	addGuaranteeCreditMultiples,
	addGuaranteeAccountabilityReverse,
	fetchGuaranteeAccountabilityGrid
} from './thunks';
import {
	TGuaranteeAccountability,
	TGuaranteeAccountabilityFilters
} from 'src/core/models/guarantee-accountability';
import { TState, TAccountingData } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';
import { TCreditReceipt } from 'src/core/models/credit-receipt';

export type TError = {
	detail: string;
};

export type State = {
	list: TGuaranteeAccountability[];
	item: TGuaranteeAccountability;
	accontabilityArray: TGuaranteeAccountability[];
	listFilters: { [page: string]: TGuaranteeAccountabilityFilters };
	creditReceipt: TCreditReceipt[];
	accontability: any;
	accontabilityStatus: string;
	error: TError;
	accounting: TAccountingData[];
};

const initialState: TState & State = {
	status: 'initial',
	accontabilityStatus: 'initial',
	list: [] as TGuaranteeAccountability[],
	accontabilityArray: [] as TGuaranteeAccountability[],
	creditReceipt: [] as TCreditReceipt[],
	item: {} as TGuaranteeAccountability,
	listFilters: {} as { [page: string]: TGuaranteeAccountabilityFilters },
	accontability: {} as any,
	error: {} as TError,
	accounting: [] as TAccountingData[]
};

const slice = createSlice({
	name: 'guaranteeAccountability',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			state.item = payload ?? {} as TGuaranteeAccountability
		},

		setFilters(state, { payload }) {
			state.listFilters[payload.page] = payload.filters;
		},
		setAccontabilityArray(state, action: PayloadAction<TGuaranteeAccountability[]>) {
			state.accontabilityArray = action.payload
		},
		
		addAccontabilityArray(state, action: PayloadAction<TGuaranteeAccountability>) {
			state.accontabilityArray.push(action.payload)
		},
		removeAccontabilityArray(state, action: PayloadAction<number>) {
			state.accontabilityArray.splice(action.payload, 1)
		},
		addCreditReceipt(state, action: PayloadAction<TCreditReceipt>) {
			state.creditReceipt.push(action.payload)
		},
		setCreditReceipt(state, action: PayloadAction<TCreditReceipt[]>) {
			state.creditReceipt = action.payload
		},
		removeCreditReceipt(state, action: PayloadAction<number>) {
			state.creditReceipt.splice(action.payload, 1)
		},
		clearAll (state) {
			state.accontabilityArray= [] as TGuaranteeAccountability[];
			state.creditReceipt= [] as TCreditReceipt[];
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchGuaranteeAccountability)
		caseDefault(addCase, fetchGuaranteeAccountabilityGrid)
		caseDefault(addCase, fetchGuaranteeAccountabilityDepositList)
		caseDefault(addCase, getGuaranteeAccountability, 'item')
		caseDefaultRegister(addCase, addGuaranteeAccountabilityMultiples, 'added')
		caseDefaultRegister(addCase, addGuaranteeAccountabilityReverse, 'added')
		caseDefaultRegister(addCase, addGuaranteeCreditMultiples, 'added')
		caseDefaultRegister(addCase, addGuaranteeAccountability, 'added')
		caseDefaultRegister(addCase, editGuaranteeAccountability, 'edited')
		caseDefaultRegister(addCase, updateStatusGuaranteeAccountability, 'edited')
		addCase(fetchGetAccontabilityByFolder.pending, (state) => {
			state.accontabilityStatus = 'fetching'
		})
		addCase(fetchGetAccontabilityByFolder.fulfilled, (state, action) => {
			state.accontability = action.payload
			state.accontabilityStatus = 'initial'
		})
		addCase(fetchGetAccontabilityByFolder.rejected, (state, action) => {
			state.accontability = {}
			state.accontabilityStatus = 'failure'
		})
		caseDefault(addCase, guaranteeAccountabilityAccounting, 'accounting')
	},
});

export default slice;
export const {
	addAccontabilityArray,
	removeAccontabilityArray,
	addCreditReceipt,
	removeCreditReceipt,
	clearAll,
	setAccontabilityArray,
	setCreditReceipt,
} = slice.actions