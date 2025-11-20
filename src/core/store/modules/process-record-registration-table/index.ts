import { createSlice } from '@reduxjs/toolkit';
import { addProcessRecordRegistrationTable, editProcessRecordRegistrationTable, fetchProcessRecordRregistrationTableGrid, fetchProcessRecordTableAttributes, fetchProcessRecordTableAttributesList, fetchProcessRecordTableAttributesListWithLike } from './thunks';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	detail: string;
};

export type State = {
	list: any[];
	item: any;
	error: TError;
	listFilters: any;
	tableAttributes: any;
	tableAttributesList: any;
	tableAttributesWithLike: any;
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as any[],
	item: {} as any,
	error: {} as TError,
	listFilters: {} as any,
	tableAttributes: [] as any[],
	tableAttributesList: [] as any[],
	tableAttributesWithLike: [] as any[],
};


const slice = createSlice({
	name: 'processRecordRegistrationTable',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, action) => {
			state.item = action.payload;
		},

		setFilters: (state, { payload }) => {
			state.listFilters = payload
		},

		setTableAttributesList: (state, { payload }) => {
			state.tableAttributesList = payload;
		},

		setTableAttributesWithLike: (state, { payload }) => {
			state.tableAttributesWithLike = payload;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchProcessRecordRregistrationTableGrid)
	   	caseDefaultRegister(addCase, addProcessRecordRegistrationTable, 'added')
		caseDefaultRegister(addCase, editProcessRecordRegistrationTable, 'edited') 
		caseDefault(addCase, fetchProcessRecordTableAttributes, 'tableAttributes');
		caseDefault(addCase, fetchProcessRecordTableAttributesListWithLike, 'tableAttributesWithLike');
	},
});

export default slice;