import { createSlice } from '@reduxjs/toolkit';

export type State = {
	page: number;
	pageSize: number;
	pageCount: number;
	lastPath: string;
	itemCount: number;
	errorsCount?: number;
};

export const initialState: State = {
	page: 1,
	pageSize: 20,
	pageCount: 1,
	lastPath: '',
	itemCount: 0,
	errorsCount: 0
};

const slice = createSlice({
	name: 'pagination',
	initialState,
	reducers: {

		setPage(state, action) {
			state.page = action.payload;
		},

		setPageSize(state, action) {
			state.pageSize = action.payload;
		},

		setPageCount(state, action) {
			state.pageCount = action.payload;
		},

		setLastPath(state, action) {
			state.lastPath = action.payload;
		},

		setItemCount(state, action) {
			state.itemCount = action.payload;
		},
		setErrorsCount(state, action) {
			state.errorsCount = action.payload;
		},
		clear(state) {
			state.page = initialState.page
			state.pageSize = initialState.pageSize
			state.pageCount = initialState.pageCount
			state.itemCount = initialState.itemCount
		}
	}
});

export default slice;
