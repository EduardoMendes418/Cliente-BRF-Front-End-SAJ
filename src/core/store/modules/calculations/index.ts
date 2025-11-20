import { createSlice } from '@reduxjs/toolkit';
import { deleteCalculationsFile, updateCalculationsFolder, updateObjectsInformation } from './thunks';
import { TState } from 'src/core/models';
import { caseDefaultRegister, clears } from '..';

const initialState: TState = {
	status: 'initial',
	error: '',
};

const slice = createSlice({
	name: 'calculations',
	initialState,
	reducers: clears(initialState),
	extraReducers: ({ addCase }) => {
		caseDefaultRegister(addCase, updateObjectsInformation, 'edited')
		caseDefaultRegister(addCase, updateCalculationsFolder, 'edited')
		caseDefaultRegister(addCase, deleteCalculationsFile, 'edited')
	},
});

export default slice;
