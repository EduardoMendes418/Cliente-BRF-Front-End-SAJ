import { createSlice } from "@reduxjs/toolkit";

export type State = {
	totalItems: number;
}

export const initialState: State = {
	totalItems: 0,
};

const slice = createSlice({
	name: 'report-items-count',
	initialState,
	reducers: {
		setTotalItems(state, action) {
			state.totalItems = action.payload;
		}
	}
})

export default slice;
