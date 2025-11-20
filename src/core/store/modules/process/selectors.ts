import { createSelector } from '@reduxjs/toolkit';
import { isEmpty } from 'ramda';
import { TOptionsSelect } from 'src/components/form';
import { TProcessParties, TProcessFormData, TProcess, TProcessObject } from 'src/core/models/process';
import { RootState } from 'src/core/store';
import { toDefaultValues } from 'src/core/utils/func';
import { t } from 'src/locale/i18n';
import { State } from '.';
import { finderParty } from '../func';

const state = (state: RootState) => state.process;

export const getProcessFolder = createSelector(
	[state],
	({ folder }: State) => {
		if (isEmpty(folder)) return {} as TProcess

		const juridicalResponsible = folder?.processParties?.find(processPart => processPart.situation === 'Responsável')?.name ?? ''
		return {
			...folder,
			orders: folder.orders?.map(item => toDefaultValues([
				'initialRiskJustification',
				'justificationAmountConviction',
				'sentenceValueJustification',
			], item)),
			juridicalResponsible
		} as TProcess
	}
);

export const getObjectsFolder = createSelector(
	[state],
	({ folder }: State) => {
		if (isEmpty(folder)) return {} as TProcess
		const juridicalResponsible = folder.processParties.find(processPart => processPart.situation === 'Responsável')?.name ?? ''
		return {
			...folder,
			logsObjects: folder.logsObjects?.map(item => ({
				dueDate: item.dueDate ?? '',
				id: item.id ?? 0,
				logDataFromId: item.logDataFromId ?? 0,
				observation: item.observation ?? '',
				occurrenceDate: item.occurrenceDate ?? '',
				rejectionAndReturnReasonsId: item.rejectionAndReturnReasonsId ?? 0,
				requestId: item.requestId ?? 0,
				statusApprovalId: item.statusApprovalId ?? 0,
				statusFlowId: item.statusFlowId ?? 0,
				userName: item.userName ?? '',
			})),
			processObject: folder.processObject?.map(item => ({
				id: item.id,
				description: item.description,
				notes: item.notes,
				objectId: item.objectId,
				processId: item.processId,
				// OBJECT INFORMATION
				// Normalização necessária devido a erro de inicializaçao dos campos do formulaario
				// local: src/screen/calculations/statistical-order/form.tsx
				// o ideal era entregar os dados dentro do objeto "objectInformation"
				// mas o formulário está considerando o processObject nos campos
				objectInformation: null,
				objectInformationId: item.objectInformation?.id ?? 0,
				convictionValue: item.objectInformation?.convictionValue ?? 0,
				initialRisk: item.objectInformation?.initialRisk ?? 0,
				initialRiskJustification: item.objectInformation?.initialRiskJustification ?? '',
				justificationAmountConviction: item.objectInformation?.justificationAmountConviction ?? '',
				possibleInitialRisk: item.objectInformation?.possibleInitialRisk ?? 0,
				probableInitialRisk: item.objectInformation?.probableInitialRisk ?? 0,
				processObjectId: item.objectInformation?.processObjectId ?? 0,
				remoteInitialRisk: item.objectInformation?.remoteInitialRisk ?? 0,
				sentenceValue: item.objectInformation?.sentenceValue ?? 0,
				sentenceValueJustification: item.objectInformation?.sentenceValueJustification ?? '',
			})).sort((a: TProcessObject, b: TProcessObject) => { return a.objectId - b.objectId; }),
			juridicalResponsible
		} as TProcess
	}
);

export const getProcessFolders = createSelector(
	[state],
	(state) => state.list
);

export const getProcessFoldersLoading = createSelector(
	[state],
	(state) => state.listLoading === 'fetching'
);

export const getProcessIsFetching = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getStatusProcess = createSelector(
	[state],
	(state) => state.status
);

export const getProcessNotFound = createSelector(
	[state],
	({ error }) => error === t('folderNotFound')
);

export const getProcessError = createSelector(
	[state],
	({ error }: State) => error
);

export const getHasFolder = createSelector(
	[state],
	({ folder }) => !!folder.id
);

export const getProcessIsEmpty = createSelector(
	[getProcessFolder, getProcessIsFetching],
	(folder, isFetching) => Object.keys(folder).length === 0 && !isFetching
);

export const getProcessLocalidade = createSelector(
	[getProcessFolder],
	(folder) => {
		const { city, state } = folder;
		return city && state ? `${city} / ${state}` : '';
	}
);

export const getProcessOppositeParty = createSelector(
	[getProcessFolder],
	(folder) => {
		const processParties = folder.processParty ?? folder.processParties
		return processParties?.find(finderParty('OUTRA PARTE')) ?? ({} as TProcessParties)
	}
);

export const getProcessEmpresa = createSelector(
	[getProcessFolder],
	(folder) => {
		const processParties = folder.processParty ?? folder.processParties
		return processParties?.find(finderParty('CLIENTE')) ?? ({} as TProcessParties)
	}
);

export const getProcessLegalResponsible = createSelector(
	[getProcessFolder],
	(folder) => {
		const processParties = folder.processParty ?? folder.processParties
		return processParties?.find(finderParty('RESPONSÁVEL')) ?? ({} as TProcessParties)
	}
);

export const getProcessStatus = createSelector(
	[getProcessFolder],
	({ closed }) => !!closed
);

export const getProcessFolderNumber = createSelector(
	[getProcessFolder],
	({ folderNumber }) => folderNumber
);

export const getProcessFormData = createSelector(
	[getProcessIsEmpty, getProcessFolder, getProcessOppositeParty, getProcessLegalResponsible, getProcessEmpresa],
	(isEmpty, folder, oppositeParty, legalResponsible, empresa): TProcessFormData => (
		isEmpty
			? {}
			: {
				centroCusto: folder.costCenter,
				nomeReclamante: oppositeParty?.name,
				numeroProcesso: folder.processNumber ?? folder.oldNumber ?? '',
				legalDepartmentArea: folder.legalDepartmentArea,
				legalDepartmentAreaId: folder.legalDepartmentAreaId,
				internalLawyer: folder.internalLawyer,
				legalResponsible: legalResponsible?.name,
				closed: folder.closed,
				empresa: empresa.name,
				processParties: folder.processParties ?? folder.processParty ?? [],
				processKey: folder.id,
				folderNumber: folder.folderNumber,
				statusId: folder.statusId,
				sphere: folder.sphere,
				agent: folder.agent,
				office: folder.office,
				officeResponsible: folder.officeResponsible,
				officeResponsibleIsActive: folder.officeResponsibleIsActive,
				contingency: folder.contingency,
			}

	) as unknown as TProcessFormData
)

export const getContingenciesAsOptions = createSelector(
	[state],
	({ contingencies }) => (contingencies ?? []).map(contingency => ({ label: contingency, value: contingency })) as TOptionsSelect[]
);

export const getSpheresAsOptions = createSelector(
	[state],
	({ spheres }) => (spheres ?? []).map(sphere => ({ label: sphere, value: sphere })) as TOptionsSelect[]
);

export const getStatusesAsOptions = createSelector(
	[state],
	({ statuses }) => {
		const statusesOptions = statuses ?? {};
		return Object.keys(statusesOptions).map(key => ({ label: (statusesOptions as any)[key], value: Number(key) })) as TOptionsSelect[]
	}
);

export const getResultsAsOptions = createSelector(
	[state],
	({ results }) => {
		const resultsOptions = results ?? {};
		return Object.keys(resultsOptions)
			.map(key => ({ label: (resultsOptions as any)[key], value: Number(key) }))
			.sort((a, b) => a.label.localeCompare(b.label)) as TOptionsSelect[]
	}
);

export const getResults = createSelector(
	[state], ({ results }) => results
)

export const getFolder = createSelector(
	[state, getProcessOppositeParty], ({ folder }, oppositeParty) => ({...folder, nomeReclamante: oppositeParty?.name, idReclamante: oppositeParty?.id,})
)
export const getClosingAsOptions = createSelector(
	[state],
	({ closing }) => (closing ?? []).map(item => ({ label: item.value, value: item.id })) as TOptionsSelect[]
);

export const getSpeciesCategoryAsOptions = createSelector(
	[state],
	({ speciesCategory }) => (speciesCategory ?? []).map(item => ({ label: item.value, value: item.id })) as TOptionsSelect[]
);

// export const getStatisticalOrderListAsOptions = createSelector(
// 	[state],
// 	({ statisticalOrder }) => (statisticalOrder ?? []).map(item => ({ label: item.description, value: item.id })) as TOptionsSelect[]
// );