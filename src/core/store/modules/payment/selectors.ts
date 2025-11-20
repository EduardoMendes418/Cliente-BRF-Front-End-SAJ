import { createSelector } from '@reduxjs/toolkit';
import store,  { RootState} from 'src/core/store';
import { getPaymentMethodByID } from 'src/core/store/modules/payment-method/selectors';
import { getFormByPaymentMethodByPaymentType } from 'src/core/store/modules/payment-type-method/selectors';
import { getPaymentTypeByID } from 'src/core/store/modules/payment-type/selectors';
import {
	getProcessEmpresa,
	getProcessFolder,
	getProcessOppositeParty,
} from 'src/core/store/modules/process/selectors';

import { normalizeProcessFolderData } from '../func'
import { TProcess } from 'src/core/models/process';
import { TPayment } from 'src/core/models/payment';
import { TLogs } from 'src/core/models';
import { STATUS_APPROVALS_FLOW } from 'src/core/utils/constants';
import { TUserDefault } from 'src/core/models/users';

const normalizeItem = ({ logs = [], requester = {} as TUserDefault, statusFlowId, ...item }: TPayment) => {
	const legalControl = logs.find(
		({ statusFlowId }) => requester.isInternal
			? statusFlowId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
			: statusFlowId === STATUS_APPROVALS_FLOW.APPROVED
	) ?? {} as TLogs

	const internalLawyer = logs.find(
		({ statusFlowId }) => statusFlowId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
	) ?? {} as TLogs

	return {
		logs,
		...item,
		numeroContaJudicial: item.contaJudicial,
		isInternal: requester.isInternal,
		statusFlowId: statusFlowId ?? -1,
		internalLawyerId: item.advogadoInternoId,
		approverOfLegalControl: legalControl.userName,
		approvalDateOfLegalControl: legalControl.occurrenceDate,
		observationOfLegalControl: legalControl.observation,
		approverOfInternalLawyer: internalLawyer.userName,
		approvalDateOfInternalLawyer: internalLawyer.occurrenceDate,
		observationOfInternalLawyer: internalLawyer.observation,
	}
}

const normalizeItemIdBrf = ({ logs = [], requester = {} as TUserDefault, statusFlowId, ...item }: TPayment, idBrf: number) => {
	// const legalControl = logs.find(
	// 	({ statusFlowId }) => idBrf === item.advogadoInternoId
	// 		? statusFlowId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
	// 		: statusFlowId === STATUS_APPROVALS_FLOW.APPROVED
	// ) ?? {} as TLogs
	const legalControl = logs.find(
			({ statusFlowId }) =>statusFlowId === STATUS_APPROVALS_FLOW.APPROVED
		) ?? {} as TLogs

	const internalLawyer = logs.find(
		({ statusFlowId }) => statusFlowId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
	) ?? {} as TLogs

	return {
		logs,
		...item,
		numeroContaJudicial: item.contaJudicial,
		isInternal: requester.isInternal,
		statusFlowId: statusFlowId ?? -1,
		internalLawyerId: item.advogadoInternoId,
		approverOfLegalControl: legalControl.userName,
		approvalDateOfLegalControl: legalControl.occurrenceDate,
		observationOfLegalControl: legalControl.observation,
		approverOfInternalLawyer: internalLawyer.userName,
		approvalDateOfInternalLawyer: internalLawyer.occurrenceDate,
		observationOfInternalLawyer: internalLawyer.observation,
	}
}

const state = (state: RootState) => state.paymentRequest;

export const getPaymentSearch = createSelector(
	[state],
	(state) => {
		const { folderNumber, formaPagamentoId, tipoPagamentoId } = state;
		return { folderNumber, formaPagamentoId, tipoPagamentoId };
	}
);

export const getPaymentForm = createSelector(
	[getPaymentSearch, getFormByPaymentMethodByPaymentType],
	(busca, getFormularioByFormaByTipoPagamento) => {
		const { tipoPagamentoId, formaPagamentoId } = busca;
		if (!isNaN(tipoPagamentoId) && !isNaN(formaPagamentoId)) {
			const formularioByForma =
				getFormularioByFormaByTipoPagamento[tipoPagamentoId];
			if (formularioByForma) {
				return formularioByForma[formaPagamentoId] ?? 'default';
			}
		}
		return undefined;
	}
);

export const getStatusPayment = createSelector(
	[state],
	({ status }) => status
);

export const getListPayment = createSelector(
	[state],
	({ list }) => list.map(normalizeItem)
);
export const getListPaymentGrid = createSelector(
	[state],
	({ list }) => list//.map(normalizeItem)
);

export const getListPensionsPayment = createSelector(
	[state],
	({ list }) => list
);

export const getItemPayment = createSelector(
	[state],
	({ item }) => normalizeItem(item)
);

export const getItemNoNormalizeItemPayment = createSelector(
	[state],
	({ item }) => item
);

export const getItemPaymentNew = createSelector([getItemNoNormalizeItemPayment],
	(item) => {
		const idBrf = store.getState().currentUser?.data?.idBrf ?? 0
		return normalizeItemIdBrf(item, idBrf)
	}
);

export const getRowsPayment = createSelector(
	[getListPayment, getPaymentTypeByID, getPaymentMethodByID],
	(list, tipoPagamentoByID, formaPagamentoByID) => list.map((item) => {
		const { legalDepartmentArea, oldNumber, processNumber } = item.process ?? {};

		return ({
			...item,
			id: item.id,
			requestDate: item.dataSolicitacao,
			folderNumber: item.folderNumber,
			legalDepartmentArea,
			processNumber: processNumber ?? oldNumber ?? '',
			oppositeParty: item.processPartiesOther.name,
			paymentType: tipoPagamentoByID[item.tipoPagamentoId]?.financeChartOfAccountsCategory?.name ?? '',
			paymentForm: formaPagamentoByID[item.formaPagamentoId]?.descricao ?? '',
			paymentDate: item.dataPagamento,
			paymentValue: item.valorPagamentoJudicial,
			internalLawyerId: item.advogadoInternoId,
			internalLaywer: item.advogadoInterno,
			statusApprovalId: item.statusApprovalId,
			statusFlowId: item.statusFlowId ?? -1,
			isInternal: item.isInternal,
			paymentTypeId: item.tipoPagamentoId,
			requesterId: item.requesterId
		})
	})
);

export const getFiltersPayment = createSelector(
	[state],
	(state) => state.listFilters
);

export const getFolderInfoPayment = createSelector(
	[getProcessFolder, getProcessOppositeParty, getProcessEmpresa],
	(folder, parteContraria, empresa) => {
		const {
			costCenter,
			processNumber,
			oldNumber,
			internalLawyer,
			internalLawyerId,
			admissionDate,
			dismissalDate,
			distributionDate,
			pagamentosESocial, // TODO: 158812 checar retorno eSocial ao editar pagamento
		} = folder;

		return {
			costCenter,
			processNumber: processNumber ?? oldNumber ?? '',
			cpf: parteContraria.identificationNumber ?? '',
			nomeReclamante: parteContraria.name ?? '',
			dataNascimento: parteContraria.birthDate || null,
			bancoId: parteContraria.bankId ?? '',
			agencia: parteContraria.agency ?? '',
			agenciaDv: parteContraria.agencyDv ?? '',
			conta: parteContraria.account ?? '',
			contaDv: parteContraria.accountDv ?? '',
			cep: parteContraria.zipCode ?? '',
			endereco: parteContraria.address ?? '',
			numero: parteContraria.addressNumber ?? '',
			bairro: parteContraria.district ?? '',
			cidadeId: parteContraria.cityId ?? '',
			estadoId: parteContraria.stateId ?? '',
			telefone: parteContraria.telephone ?? '',
			email: parteContraria.email ?? '',
			internalLawyer,
			internalLawyerId: internalLawyerId ?? '',
			supplierId: parteContraria.supplierId ?? '',
			empresa: empresa.name,
			admissionDate: admissionDate ?? '',
			dismissalDate: dismissalDate ?? '',
			distributionDate: distributionDate ?? '',
			pagamentosESocial: pagamentosESocial ?? null,
		};
	}
);

export const getLoadingPayment = createSelector(
	[state],
	({ status }) => status === 'fetching'
);

export const getHasItem = createSelector(
	[state],
	({ item }) => !!item.id
);

export const getProcessFolderData = createSelector(
	[state],
	({ item }) => normalizeProcessFolderData(item.process || {} as TProcess)
);

export const getErrorMessage = createSelector(
	[state],
	({ error }) => {
		if (!error) return '';

		if (typeof error === 'object' && error !== null) return (error as any).detail;

		return error as string;
	}
);

export const getPaymentAccounting = createSelector(
	[state],
	({ accounting }) => accounting
);

export const getPaymentAccountingReversal = createSelector(
	[state],
	({ accounting }) => {
	  if (accounting && Array.isArray(accounting)) {
		return accounting.find(item => item.type === 2);
	  } else {
		return [];
	  }
	}
  );

export const getPaymentAccountingReclassification = createSelector(
	[state],
	({ accounting }) => {
	  if (accounting && Array.isArray(accounting)) {
		return accounting.find(item => item.type === 3);
	  } else {
		return [];
	  }
	}
);

export const ratValues = createSelector(
	[state],
	({ ratValues }) => ratValues
);

export const listPaymentBanks = createSelector(
	[state],
	({ banks }) => banks
);

export const getModalEsocialLinkId = createSelector(
	[state],
	({ modalESocialLinkId }) => modalESocialLinkId
);
