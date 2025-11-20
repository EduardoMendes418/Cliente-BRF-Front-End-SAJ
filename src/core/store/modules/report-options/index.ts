import { createSlice } from '@reduxjs/toolkit';
import { fetchBusinessAreas, fetchGrouperCostCenters, fetchProvisionClasses } from './thunks';
import { TOptions } from 'src/core/models';
import { caseDefault } from '..';

export type State = {
	businessAreas: TOptions[];
	provisionClasses: TOptions[];
	grouperCostCenters: TOptions[];

};

const initialState: State = {
	businessAreas: [],
	provisionClasses: [],
	grouperCostCenters: [],
};

const slice = createSlice({
	name: 'reportOptions',
	initialState,
	reducers: {},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchBusinessAreas, 'businessAreas')
		caseDefault(addCase, fetchProvisionClasses, 'provisionClasses')
		caseDefault(addCase, fetchGrouperCostCenters, 'grouperCostCenters')
	},
});

export default slice;
