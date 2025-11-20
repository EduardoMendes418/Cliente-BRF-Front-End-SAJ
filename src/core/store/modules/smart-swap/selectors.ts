import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';

const state = (state: RootState) => state.smartSwap;


export const getListSmartSwap = createSelector([state], (state) => state.list);

export const getSmartSwapId = createSelector([state], (state) => state.smartSwapId);

export const getFiltersSmartSwap = createSelector([state], (state) => state.listFilters);

export const getLoadingFetchingSmartSwap = createSelector([state], (state) => state.status === 'fetching');

export const getLoadingUpdatingSmartSwap = createSelector([state], (state) => state.status === 'saving');

export const getStatusSmartSwap = createSelector([state], (state) => state.status);

export const getFeedbackErrorsSmartSwap = createSelector([state], (state) => state.lineErrorsFeedback);

export const getEditPanelFormSmartSwap = createSelector([state], (state) => state.editPanel);
