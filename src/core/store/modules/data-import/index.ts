import { createSlice } from '@reduxjs/toolkit';

import {
	TDataImportFeedbackLineError,
	TDataImportGoodsAndGuaranteesFilters,
	TDataImportGoodsAndGuarantees,
	TDataImportProcessSheetFilters,
	TDataImportMultipleFilesForm,
	TDataImportRequisition,
} from 'src/core/models/data-import';

import {
	fetchGoodsGuarantees,
	fetchProcessSheet,
	importMultipleFiles,
	importSingleFile,
	importDocuments,
	generateRequestFilter, importGoodsGuarantees, fetchRequest, importContacts,
} from './thunk';
import { clears, caseDefault, caseDefaultImport } from '..';

export type State = {
	lineErrorsFeedback: TDataImportFeedbackLineError[] | any; 
	status: 'initial' | 'saving' | 'imported' | 'failure' | 'fetching';
	error: string;
	listFilters: TDataImportGoodsAndGuaranteesFilters | TDataImportProcessSheetFilters | TDataImportMultipleFilesForm;
	list: TDataImportGoodsAndGuarantees[];
	requests: TDataImportRequisition[];
}

const initialState: State = {
	listFilters: {} as TDataImportGoodsAndGuaranteesFilters | TDataImportProcessSheetFilters | TDataImportMultipleFilesForm,
	list: [],
	status: 'initial',
	lineErrorsFeedback: [],
	error: '',
	requests: []
};

const slice = createSlice({
	name: 'dataImport',
	initialState,
	reducers: {
		...clears(initialState),
		setFilters(state, { payload }) {
			(state.listFilters as any)[payload.page] = payload.filters;
		},
		setLineErrorsFeedback (state, {payload}) {
			state.lineErrorsFeedback = payload
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefaultImport(addCase, importSingleFile)
		caseDefaultImport(addCase, importMultipleFiles)
		caseDefaultImport(addCase, importDocuments);
		caseDefaultImport(addCase, importGoodsGuarantees)
		
		caseDefaultImport(addCase, importContacts, true)

		caseDefault(addCase, generateRequestFilter);
		caseDefault(addCase, fetchGoodsGuarantees);
		caseDefault(addCase, fetchProcessSheet);
		caseDefault(addCase, fetchRequest, "requests")
	},
});


export default slice;
