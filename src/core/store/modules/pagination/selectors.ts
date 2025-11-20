import { createSelector } from '@reduxjs/toolkit';
import { identity } from 'ramda';
import { RootState } from 'src/core/store';

const state = (state: RootState) => state.pagination;

export const getPagination = createSelector([state], identity);
