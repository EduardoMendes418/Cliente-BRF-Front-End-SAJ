import { createSlice } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';

import { caseDefaultRegister, clears } from '..';
import { addGoodsGuaranteesEstimates, editGoodsGuaranteesEstimates } from './thunks';

const initialState: TState = {
	status: 'initial',
	error: '',
};

const slice = createSlice({
	name: 'goodsGuaranteesEstimates',
	initialState,
	reducers: {
		...clears(initialState),
	},
	extraReducers: ({ addCase }) => {
		caseDefaultRegister(addCase, addGoodsGuaranteesEstimates, 'added')
		caseDefaultRegister(addCase, editGoodsGuaranteesEstimates, 'edited')
	},
});

export default slice;
