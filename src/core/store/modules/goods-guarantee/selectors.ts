import { createSelector } from '@reduxjs/toolkit';
import { add } from 'date-fns';

import { TGoodsGuaranteesRequest } from 'src/core/models/goods-guarantee';
import { TUserDefault } from 'src/core/models/users';
import { STATUS_APPROVALS_FLOW } from 'src/core/utils/constants';
import { TLogs } from 'src/core/models';

import { RootState } from '../../index';
import { getBanksByID } from '../banks/selectors';
import { State } from '.';

const normalizeItem = ({ logs = [], requester = {} as TUserDefault, statusFlowId, ...item }: TGoodsGuaranteesRequest) => {

	const legalControl = logs.find(
		({ statusFlowId, statusApprovalId }) => {

			if(statusApprovalId === -1){

				if(requester.isInternal) {
					return statusFlowId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
				}
				return statusFlowId === STATUS_APPROVALS_FLOW.APPROVED
			}
			return false
		}
	) ?? {} as TLogs;

	const internalLawyer = logs.find(
		({ statusFlowId, statusApprovalId }) => statusFlowId === 1 && statusApprovalId === -1
	) ?? {} as TLogs;

	const estimates = item.estimates?.map(item => {
		const files = item.files?.map(({ isMainFile, ...file }) => ({ isMainFile: !isMainFile, file }));
		return ({ ...item, files });
	});

	const newFiles = item.files?.map(item => ({
		...item,
	}));

	return {
		logs,
		...item,
		/* statusDoBem: item?.statusBem, */
		estimates,
		files: newFiles,
		isInternal: requester.isInternal,
		statusFlowId: statusFlowId ?? -1,
		approverOfLegalControl: legalControl.userName,
		approvalDateOfLegalControl: legalControl.occurrenceDate,
		observationOfLegalControl: legalControl.observation,
		approverOfInternalLawyer: internalLawyer.userName,
		approvalDateOfInternalLawyer: internalLawyer.occurrenceDate,
		observationOfInternalLawyer: internalLawyer.observation,
	}
}

const state = (state: RootState) => state.goodsGuaranteesRequest;

export const getLoadingGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.status === 'fetching',
);

export const getStatusGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.status,
);

export const getErrorGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.error,
);

export const getSavingGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.status === 'saving',
);

export const getItemGoodsGuaranteesRequest = createSelector(
	[state],
	(state: State) => {
		if (!state.item || Object.keys(state.item).length === 0) return {} as TGoodsGuaranteesRequest;

		return normalizeItem(state.item) as TGoodsGuaranteesRequest;
	}
);

export const getRedirectUrlGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.redirectUrl,
);

export const getEmailGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.emails,
);


export const getErrorMessageGoodsGuaranteesRequest = createSelector(
	[getErrorGoodsGuaranteesRequest],
	(error): string => {
		if (!error) return '';

		if (typeof error === 'object' && error !== null) return (error as any).error;

		return error as string;
	},
);

export const getFiltersGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.listFilters
);

export const getListGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.list.map(({
		statusFlowId,
		statusApprovalId,
		process,
		goodsGuaranteesRequests,
		id,
		requestDate,
		folderNumber,
		effectiveDate,
		guaranteeModalityId,
		valueGuarantee,
		requestTypeId,
		requester = {} as TUserDefault,
		logs,
		recordType,
		/* statusBem, */
		...item
	}) => {
		
		return {
			id,
			process,
			statusFlowId,
			goodsGuaranteesRequests,
			statusApprovalId,
			requestDate,
			folderNumber,
			effectiveDate,
			guaranteeModalityId,
			valueGuarantee,
			requestTypeId,
			applicantName: requester.name,
			legalDepartmentArea: process?.legalDepartmentArea ?? '',
			isInternal: requester.isInternal,
			logs,
			recordType,
			/* statusBem, */
			...item
		}
	})
);

export const getListActivePoliciesGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.list.filter(({ policyNumber }) => policyNumber)
)

export const getHasItemGoodsGuaranteesRequest = createSelector(
	[state],
	({ item }) => !!item.id
);

export const getJudicialDepositData = createSelector(
	[state, getBanksByID],
	({ item }, banks) => {
		let fromAccountabilityData = {};
		if (item.fromAccountabilityId) {
			fromAccountabilityData = {
				legalAccountName: item.account,
				internalLawyer: item.process?.internalLawyer ?? '',
				bank: item.bankId ? banks[item.bankId] : '',
				valueGuarantee: item.valueGuarantee,
			}
		}

		if (item.payment) return {
			...item.payment,
			isPayment: true,
			...fromAccountabilityData,
			account: item.account,
			interestUpdateMethodDescription: item.interestUpdateMethodDescription,
			interestUpdateMethodId: item.interestUpdateMethodId,
			statusFlowId: item.statusFlowId
		} as any;
		if (item.judicialBlocksAndTransfer) {
			const { judicialBlocksAndTransfer, interestUpdateMethodDescription, interestUpdateMethodId, statusFlowId } = item;
			return {
				isPayment: false,
				description: judicialBlocksAndTransfer.description,
				judicialAccountNumber: judicialBlocksAndTransfer.judicialAccountNumber,
				bank: (banks as any)[judicialBlocksAndTransfer.bankId],
				legalAccountName: judicialBlocksAndTransfer.judicialAccountNumber,
				internalLawyer: item.process?.internalLawyer ?? '',
				occurrenceType: judicialBlocksAndTransfer.occurrenceType,
				occurrenceReason: judicialBlocksAndTransfer.occurrenceReason,
				updateMethod: judicialBlocksAndTransfer.updateMethod,
				updateMethodDescription: interestUpdateMethodDescription,
				updateMethodId: interestUpdateMethodId,
				blockOrTransfDate: judicialBlocksAndTransfer.blockOrTransfDate,
				value: judicialBlocksAndTransfer.value,
				accountingDocumentNumber: judicialBlocksAndTransfer.accountingDocumentNumber,
				statusFlowId: statusFlowId,
				...fromAccountabilityData
			} as any;
		}
	}
);

export const getNotificationListGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.notificationList.filter(({ userPostponedDate }) => {
		if (userPostponedDate) {
			const postponedDate = add(new Date(userPostponedDate!), { days: 1 })
			const now = new Date()
			return now >= postponedDate
		}
		return true
	})
);

export const getNotificationsGoodsGuaranteesRequest = createSelector(
	[getNotificationListGoodsGuaranteesRequest],
	(notificationList) => notificationList.filter(
		({ isUserAwared, isUserAnswered }) => {
			if (isUserAwared || isUserAnswered) return false
			return true
		}
	)
);

export const getIsLoadingNotificationListGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.notificationStatus === 'fetching'
);

export const getNotificationFilterGoodsGuaranteesRequest = createSelector(
	[state],
	(state) => state.notificationFilter
);

export const getGoodguaranteesCompanies = createSelector(
	[state],
	(state) => state.companies ?? []
)