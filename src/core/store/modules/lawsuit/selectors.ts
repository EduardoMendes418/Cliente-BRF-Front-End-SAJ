import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'

const state = (state: RootState) => state.Lawsuit;

export const getLoadingLoading= createSelector(
	[state],
	(state) => state.status === 'fetching'
);