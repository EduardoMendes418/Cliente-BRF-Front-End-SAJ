import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type State = {
	selectedModals: string[];
	lastModalOpen: string;
};

const initialState: State = {
	selectedModals: [],
	lastModalOpen: '',
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		open(state, action: PayloadAction<{ modalId: string }>) {
			state.selectedModals = [
				...state.selectedModals,
				action.payload.modalId
			];
			state.lastModalOpen = action.payload.modalId
		},
		close(state, action: PayloadAction<{ modalId: string }>) {
			state.selectedModals = state.selectedModals.filter(
				(m) => m !== action.payload.modalId
			);
		},
	},
});

export default modalSlice;
