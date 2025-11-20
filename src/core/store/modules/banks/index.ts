import { createSlice } from '@reduxjs/toolkit';
import { fetchBanks } from './thunks';
import { TBank } from 'src/core/models/banks';
import * as selectors from './selectors';
import { caseDefault } from '..';

export type State = {
	list: TBank[];
};

const initialState: State = {
	list: [] as TBank[],
};

const slice = createSlice({
	name: 'banks',
	initialState,
	reducers: {},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchBanks, 'list')
	},
});

export default slice;
export { selectors };
