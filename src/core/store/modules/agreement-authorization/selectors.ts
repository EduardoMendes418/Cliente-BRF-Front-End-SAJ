import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import {
	TAgreementAuthorization,
	TAgreementAuthorizationNormalized,
} from 'src/core/models/agreement-authorization';
import { statusTextApprovalsFlow } from 'src/core/utils/constants'
import { TProcess } from 'src/core/models/process';
import { normalizeProcessFolderData } from '../func';

const state = (state: RootState) => state.agreementAuthorization;

const normalizeItem = ({ process, ...item }: TAgreementAuthorization)
	: TAgreementAuthorizationNormalized => ({
		...item,
		id: item.id ?? 0,
		logs: item.logs ?? [],
		possibleApprovers: item.approvers ?? [],
		status: (statusTextApprovalsFlow as any)[item.statusApprovalId ?? -1],
		legalDepartmentArea: process?.legalDepartmentArea ?? '-',
		legalDepartmentAreaId: process?.legalDepartmentAreaId ?? 0,
		costCenter: process?.costCenter ?? '-',
		processNumber: process?.processNumber || process?.oldNumber || '-',
	})

export const getLoadingAgreementAuthorization = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getListAgreementAuthorization = createSelector(
	[state],
	(state) => state.list.map(normalizeItem)
);

export const getFiltersAgreementAuthorization = createSelector(
	[state],
	(state) => state.listFilters
);

export const getItemAgreementAuthorization = createSelector(
	[state],
	(state) => normalizeItem(state.item)
);

export const getHasItemAgreementAuthorization = createSelector(
	[state],
	({ item }) => !!item.id
);

export const getStatusAgreementAuthorization = createSelector(
	[state],
	(state) => state.status,
);

export const getProcessFolderDataAgreementAuthorization = createSelector(
	[state],
	({ item }) => normalizeProcessFolderData(item.process || {} as TProcess)
);

export const getErrorMessageAgreementAuthorization = createSelector(
	[state],
	(state): string => {
		if (!state.error) return '';
		else if (typeof state.error === 'object' && state.error !== null) return (state.error as any).detail;

		return state.error as string;
	},
);