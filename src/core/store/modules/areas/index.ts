import { createSlice } from '@reduxjs/toolkit';
import * as F from './thunks';
import { TState } from 'src/core/models';
import { TArea, TAreaByUser, TGroupedArea } from 'src/core/models/areas';
import * as selectors from './selectors';
import { caseDefault } from '..';

type State = {
	listDEJUR: TArea[];
	listDEJURGrouped: TGroupedArea[];
	listDEJURGroupedByUser: any[];
	listDEJURbyUser: TAreaByUser;
	listResponsible: TArea[];
};

const initialState: TState & State = {
	status: 'initial',
	listDEJUR: [] as TArea[],
	listDEJURGrouped: [] as TGroupedArea[],
	listDEJURGroupedByUser: [] as any[],
	listDEJURbyUser: {
		areasDejur: [],
		responsibleAreaIds: [],
		message: '',
	},
	listResponsible: [] as TArea[],
};
const slice = createSlice({
	name: 'areas',
	initialState,
	reducers: {},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, F.fetchAreas, (state, action) => {
			state.status = 'initial';
			if (action.meta.arg === 38 || typeof action.meta.arg === 'object') {
				state.listResponsible = action.payload;
			} else {
				state.listDEJUR = action.payload;
			}
		})
		caseDefault(addCase, F.fetchAreasWitchGroups, 'listDEJUR')
		caseDefault(addCase, F.fetchGroupedAreas, 'listDEJURGrouped')
		caseDefault(addCase, F.fetchGroupedAreasByUserId, 'listDEJURGroupedByUser')
		caseDefault(addCase, F.fetchAreasByUserId, 'listDEJURbyUser')
	},
});

export default slice;
export { selectors };
