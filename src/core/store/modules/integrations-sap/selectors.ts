import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';

const state = (state: RootState) => state.integrationsSap;

export const getListDataSupplier = createSelector(
	[state],
	({ list }) => list
);