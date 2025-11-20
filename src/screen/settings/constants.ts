import { getOptionsAsObject } from 'src/core/utils/func'
import { TYPE_FLOW } from "../goods-and-guarantees/constants"

export const booleanOptions = [
	{ label: 'Sim', value: true },
	{ label: 'Não', value: false },
]

export enum WRITE_OFF_PROVISION_BALANCE {
	NONE,
	PARTIAL,
	TOTAL
}

export const abaterSaldoProvisaoOptions = [
	{ label: 'Sim - Total', value: WRITE_OFF_PROVISION_BALANCE.TOTAL },
	{ label: 'Sim - Parcial', value: WRITE_OFF_PROVISION_BALANCE.PARTIAL },
	{ label: 'Não', value: WRITE_OFF_PROVISION_BALANCE.NONE },
]

export const optionsGenerateGuidesFiles = [
	{ value: 1, label: 'GPS' },
	{ value: 2, label: 'DIRF/DARF' },
	{ value: 3, label: 'SEFIP' },
	{ value: 4, label: 'eSocial' }
]

export const optionsTypeFlow = [
	{ value: TYPE_FLOW.INSURANCE, label: 'Seguro' },
	{ value: TYPE_FLOW.PROPERTY, label: 'Móveis/Imóveis' },
	{ value: TYPE_FLOW.LETTER, label: 'Carta Fiança' },
	{ value: TYPE_FLOW.JUDICIAL_DEPOSIT, label: 'Depósito Judicial' }
]
export const typeFlowText = getOptionsAsObject(optionsTypeFlow);

export enum FOLDER_STATUS {
	ACTIVE = 1,
	SUSPENDED = 2,
	TEMPORARY_WRITE_OFF = 3,
	DEAD = 4
}

export enum folderStatusAsOptions {
	"Ativo" = FOLDER_STATUS.ACTIVE,
	"Suspenso" = FOLDER_STATUS.SUSPENDED,
	"Baixa provisória" = FOLDER_STATUS.TEMPORARY_WRITE_OFF,
	"Morto" = FOLDER_STATUS.DEAD
}

export const optionsCivilMassFolderStatus = [
	{ value: FOLDER_STATUS.ACTIVE, label: 'Ativo' },
	{ value: FOLDER_STATUS.TEMPORARY_WRITE_OFF, label: 'Baixa provisória' }
]

export const optionsCorrectionRules = [
	{ value: FOLDER_STATUS.ACTIVE, label: 'Ativo' },
	{ value: FOLDER_STATUS.TEMPORARY_WRITE_OFF, label: 'Baixa provisória' }
]

export const optionsFolderStatus = [
	...optionsCivilMassFolderStatus,
	{ value: FOLDER_STATUS.SUSPENDED, label: 'Suspenso' },
	{ value: FOLDER_STATUS.DEAD, label: 'Morto' }
]

export const optionsFolderText = getOptionsAsObject(optionsFolderStatus)

export enum VALUE_TYPE {
	PERCENTAGE = 1,
	UNIQUE_VALUE = 2
}

export const optionsValueType = [
	{ value: VALUE_TYPE.PERCENTAGE, label: 'Percentual' },
	{ value: VALUE_TYPE.UNIQUE_VALUE, label: 'Valor único' }
]

export enum CONTINGENCY_TYPE {
	ATIVA = 1,
	PASSIVA = 2
}

export const optionsContingencyType = [
	{ value: CONTINGENCY_TYPE.ATIVA, label: 'Ativa' },
	{ value: CONTINGENCY_TYPE.PASSIVA, label: 'Passiva' }
]

