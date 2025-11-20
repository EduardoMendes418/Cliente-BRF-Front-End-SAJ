import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './';

const state = (state: RootState) => state.modal;

export const getLastModalOpen = createSelector(
	[state],
	(state: State) => state.lastModalOpen,
);
