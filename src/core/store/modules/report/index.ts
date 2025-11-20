import { createSlice } from '@reduxjs/toolkit';
import { TState } from 'src/core/models';
import { TReportDictionary } from 'src/core/models/reports';
import { caseDefault, clears } from '..';
import { 
	fetchReportConfiguration, 
	fetchReport, 
	fetchReportExcelFile, 
	fetchEqualizationReportExcelFile, 
	generateProvisionReportRequest,
	exportRequestReportExcelFile
} from './thunks';

export type State = TState & {
	list: any[];
	configuration?: TReportDictionary[]
}

const initialState: State = {
	status: "initial",
	configuration: undefined,
	list: [] as any[]
}

const slice = createSlice({
	name: 'report',
	initialState,
	reducers: {
		...clears(initialState),
		
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchReport)
		caseDefault(addCase, fetchReportConfiguration, "configuration")

		addCase(fetchReportExcelFile.pending, (state) => {
			state.status = 'fetching';
		});
		addCase(fetchReportExcelFile.fulfilled, (state, action) => {
			state.status = 'added';
			state.error = '';
		});
		addCase(fetchReportExcelFile.rejected, (state, action) => {
			state.status = 'failure';
			state.error = action.payload;
		});

		addCase(fetchEqualizationReportExcelFile.pending, (state) => {
			state.status = 'fetching';
		});
		addCase(fetchEqualizationReportExcelFile.fulfilled, (state, action) => {
			state.status = 'added';
			state.error = '';
		});
		addCase(fetchEqualizationReportExcelFile.rejected, (state, action) => {
			state.status = 'failure';
			state.error = action.payload;
		});

		addCase(generateProvisionReportRequest.pending, (state) => {
			state.status = 'fetching';
		});
		addCase(generateProvisionReportRequest.fulfilled, (state, action) => {
			state.status = 'added';
			state.error = '';
		});
		addCase(generateProvisionReportRequest.rejected, (state, action) => {
			state.status = 'failure';
			state.error = action.payload;
		});

		addCase(exportRequestReportExcelFile.pending, (state) => {
			state.status = 'fetching';
		});
		addCase(exportRequestReportExcelFile.fulfilled, (state, action) => {
			state.status = 'added';
			state.error = '';
		});
		addCase(exportRequestReportExcelFile.rejected, (state, action) => {
			state.status = 'failure';
			state.error = action.payload;
		});
	}
});

export default slice;
