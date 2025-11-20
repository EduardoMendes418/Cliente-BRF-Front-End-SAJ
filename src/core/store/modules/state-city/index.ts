import { createSlice } from '@reduxjs/toolkit';
import { fetchStates, fetchCitiesByState } from './thunks';
import { TState, TCity } from 'src/core/models/state-city';
import * as selectors from './selectors';
import { TState as TReduxState } from 'src/core/models'
import { caseDefault, clears } from '..';

export type State = {
	states: TState[];
	cities: TCity[];
};

const initialState: TReduxState & State = {
	status: 'initial',
	states: [] as TState[],
	cities: [] as TCity[],
	error: '',
};

const slice = createSlice({
	name: 'stateCity',
	initialState,
	reducers: clears(initialState),
	extraReducers: (builder) => {
		caseDefault(builder.addCase, fetchStates, 'states')
		caseDefault(builder.addCase, fetchCitiesByState, (state: State, action) => {
			if (state.cities.find(x => x.stateId === action.payload[0].stateId)) {
				return
			}
			const concat = state.cities.concat(action.payload)
			state.cities = concat
		})
	},
});

export default slice;
export { selectors };
