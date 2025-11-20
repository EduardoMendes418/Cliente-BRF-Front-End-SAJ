import { TOptions } from "src/components/form/AutocompleteField";
import { Color, RowConfig } from "src/components/Logs/FullLogs"
import { STATUSES_FLOW, TLogs } from "src/core/models"
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants"
import { STATUS_FLOW, TYPE_FLOW } from "./constants"

// ENUM statusFlowId from BE
//   NONE = -1 / "Nenhum"
//   REJECTED_DEFINITIVE = 0 / "Cancelado"
//   APPROVED_DEFINITIVE = 1 / "Finalizado"
//   RETURNED = 2 / "Devolvido"
//   REQUESTED = 3 / "Solicitado"
//   IN_REVIEW = 4
//   APPROVED_DRAFT = 5
//   RETURNED_DRAFT = 6 / "Em desbloqueio"
//   IN_REVIEW_DRAFT = 7
//   CONTABILIZATION_ERROR = 8
//   FOR_WITHDRAWAL = 9 / "Para Saque"
//   DEAD = 10 / "Morto"
//   REVERSED = 11 / "Estornado"
//   RETURNED_LEGAL = 12 / "Devolvido Jurídico"
//   RETURNED_ANALYSIS = 13 / "Devolvido Análise"
//   RETURNED_OFFICE = 14 / "Devolvido Escritório"
//   REJECTED = 15 / "Reprovado"
//   SUSPENDED = 16 / "Suspenso"
//   ACTIVE = 17 / "Ativo"

export const beforeCentralApprovalStatusNamesAndColor = {
	[STATUS_FLOW.APPROVED_DEFINITIVE]: { label: 'Aprovado advogado interno', color: 'success' },
	[STATUS_FLOW.RETURNED]: { label: 'Solicitação devolvida', color: 'warn' },
	[STATUS_FLOW.REQUESTED]: { label: 'Solicitado', color: 'info' },
	[STATUS_FLOW.ANEXO]: { label: 'Anexo', color: 'warn' },
	[STATUS_FLOW.REJECTED_DEFINITIVE]: { label: 'Solicitação cancelada', color: 'danger' },
	[STATUS_FLOW.IN_REVIEW]: { label: 'Validado Controles Jurídico', color: 'info' },
}

const insuranceStatusNamesAndColor = {
	[STATUS_FLOW.NONE]: { label: 'Aprovado', color: 'successDark' },
	[STATUS_FLOW.REJECTED_DEFINITIVE]: { label: 'Solicitação cancelada', color: 'danger' },
	[STATUS_FLOW.APPROVED_DEFINITIVE]: { label: 'Minuta final aprovada', color: 'successDark' },
	[STATUS_FLOW.RETURNED]: { label: 'Minuta devolvida', color: 'warn' },
	[STATUS_FLOW.REQUESTED]: { label: 'Minuta solicitada', color: 'info' },
	[STATUS_FLOW.IN_REVIEW]: { label: 'Minuta disponibilizada', color: 'infoInverted' },
	[STATUS_FLOW.APPROVED_DRAFT]: { label: 'Aguardando minuta final', color: 'orange' },
	[STATUS_FLOW.RETURNED_DRAFT]: { label: 'Minuta final devolvida', color: 'warn' },
	[STATUS_FLOW.IN_REVIEW_DRAFT]: { label: 'Minuta final em análise', color: 'infoInverted' },
}

const propertyStatusNamesAndColor = {
	[STATUS_FLOW.NONE]: { label: 'Aprovado', color: 'successDark' },
	[STATUS_FLOW.REJECTED_DEFINITIVE]: { label: 'Solicitação cancelada', color: 'danger' },
	[STATUS_FLOW.APPROVED_DEFINITIVE]: { label: 'Bem disponibilizado', color: 'success' },
	[STATUS_FLOW.RETURNED]: { label: 'Devolvido', color: 'warn' },
	[STATUS_FLOW.REQUESTED]: { label: 'Bem solicitado', color: 'info' },
	[STATUS_FLOW.IN_REVIEW]: { label: 'Validado Controles Jurídico', color: 'info' },
	[STATUS_FLOW.RETURNED_DRAFT]: { label: 'Bem não disponível', color: 'danger' },

}

const letterStatusNamesAndColor = {
	[STATUS_FLOW.NONE]: { label: 'Aprovado', color: 'successDark' },
	[STATUS_FLOW.REJECTED_DEFINITIVE]: { label: 'Solicitação cancelada', color: 'danger' },
	[STATUS_FLOW.APPROVED_DEFINITIVE]: { label: 'Carta fiança disponibilizada', color: 'success' },
	[STATUS_FLOW.RETURNED]: { label: 'Devolvido', color: 'warn' },
	[STATUS_FLOW.REQUESTED]: { label: 'Carta fiança solicitada', color: 'info' },
	[STATUS_FLOW.RETURNED_DRAFT]: { label: "Bem não disponível", color: "danger" }
}



type FlowIdInfo = { label: string, color: Color }
const defaultFlowInfo = { label: '?', color: 'danger' }
const attachmentFlowInfo = { label: 'Anexo', color: 'warn' } as FlowIdInfo
const disapproved = { label: 'Reprovado', color: 'danger' } as FlowIdInfo
const reversed = { label: 'Estornado', color: 'info' } as FlowIdInfo
const dataImport = { label: "Importação", color: "orange" } as FlowIdInfo
type TEntriesStatus = [string, {label: string, color: Color }]

export const statusFlowIdListAsOption = [
	{label: "Aprovado", value: STATUS_FLOW.NONE},
	{label: "Solicitação cancelada", value: STATUS_FLOW.REJECTED_DEFINITIVE},
	{label: "Aprovado adv. Interno / Garantia disponibilizada", value: STATUS_FLOW.APPROVED_DEFINITIVE},
	{label: "Devolvido", value: STATUS_FLOW.RETURNED},
	{label: "Solicitado / Garantia solicitada", value: STATUS_FLOW.REQUESTED},
	{label: "Validado controle jurídico / Minuta disponibilizada", value: STATUS_FLOW.IN_REVIEW},
	{label: "Aguardando minuta final", value: STATUS_FLOW.APPROVED_DRAFT},
	{label: "Minuta final devolvida / Bem não disponível", value: STATUS_FLOW.RETURNED_DRAFT},
	{label: "Minuta final em análise", value: STATUS_FLOW.IN_REVIEW_DRAFT},
] as TOptions[]

//Modalidade da Garantia = sem nenhuma opção escolhida

export const statusFlowIdListAsOptionNoGuaranteeModeId = [
	{label: "Aprovado", value: STATUS_FLOW.NONE},
	{label: "Solicitação cancelada", value: STATUS_FLOW.REJECTED_DEFINITIVE},
	{label: "Aprovado advogado interno", value: STATUS_FLOW.APPROVED_DEFINITIVE},
	{label: "Devolvido", value: STATUS_FLOW.RETURNED},
	{label: "Solicitado", value: STATUS_FLOW.REQUESTED},
	{label: "Validado controle jurídico", value: STATUS_FLOW.IN_REVIEW},
	{label: "Reprovado", value: STATUS_FLOW.REJECTED},
]

//Modalidade da Garantia = 1 

export const statusFlowIdListAsOptionGuaranteeModeIdOne = [
	{label: "Aprovado", value: STATUS_FLOW.NONE}
]

//Modalidade da Garantia = 2 (Seguro Garantia)

export const statusFlowIdListAsOptionGuaranteeModeIdTwo = [
	{label: "Aprovado", value: STATUS_FLOW.NONE},
	{label: "Solicitação cancelada", value: STATUS_FLOW.REJECTED_DEFINITIVE},
	{label: "Minuta final aprovada", value: STATUS_FLOW.APPROVED_DEFINITIVE},
	{label: "Minuta devolvida", value: STATUS_FLOW.RETURNED},
	{label: "Minuta solicitada", value: STATUS_FLOW.REQUESTED},
	{label: "Minuta disponibilizada", value: STATUS_FLOW.IN_REVIEW},
	{label: "Aguardando minuta final", value: STATUS_FLOW.APPROVED_DRAFT},
	{label: "Minuta final devolvida", value: STATUS_FLOW.RETURNED_DRAFT},
	{label: "Minuta final em análise", value: STATUS_FLOW.IN_REVIEW_DRAFT},

]

//Modalidade da Garantia = 3 (Fiança Bancária)

export const statusFlowIdListAsOptionGuaranteeModeIdThree = [
	{label: "Aprovado", value: STATUS_FLOW.NONE},
	{label: "Bem não disponível", value: STATUS_FLOW.REJECTED_DEFINITIVE},
	{label: "Carta fiança disponibilizada", value: STATUS_FLOW.APPROVED_DEFINITIVE},
	{label: "Carta fiança devolvida", value: STATUS_FLOW.RETURNED},
	{label: "Carta fiança solicitada", value: STATUS_FLOW.REQUESTED},
	{label: "Bem não disponível", value: STATUS_FLOW.RETURNED_DRAFT},
]

//Modalidade da Garantia = 4 ou  5 (Bem Móvel ou Imóvel)

export const statusFlowIdListAsOptionGuaranteeModeIdFourOrFive = [
	{label: "Aprovado", value: STATUS_FLOW.NONE},
	{label: "Solicitação cancelada", value: STATUS_FLOW.REJECTED_DEFINITIVE},
	{label: "Bem disponibilizado", value: STATUS_FLOW.APPROVED_DEFINITIVE},
	{label: "Bem devolvido", value: STATUS_FLOW.RETURNED},
	{label: "Bem solicitado", value: STATUS_FLOW.REQUESTED},
	{label: "Validado controle jurídico", value: STATUS_FLOW.IN_REVIEW},
	{label: "Bem não disponível", value: STATUS_FLOW.RETURNED_DRAFT},
]

export const getStatusInfoFromGoodAndGuarantees = (
	typeFlow: TYPE_FLOW,
	statusFlowId: STATUSES_FLOW,
	statusApprovalId: STATUS_APPROVALS_FLOW
) => {
		const afterCentralApprovalStatusNames =
			typeFlow === TYPE_FLOW.INSURANCE
				? insuranceStatusNamesAndColor
				: typeFlow === TYPE_FLOW.PROPERTY
				? propertyStatusNamesAndColor
				: typeFlow === TYPE_FLOW.LETTER
				? letterStatusNamesAndColor
				: {};
		if (statusFlowId === STATUS_FLOW.ANEXO) return attachmentFlowInfo;

		let iterationStatus: FlowIdInfo;
		if (statusApprovalId === STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE)
			iterationStatus =
				(afterCentralApprovalStatusNames as any)[statusFlowId] ?? defaultFlowInfo;
		else if (statusApprovalId === 0) 
			iterationStatus = disapproved;
		else
			iterationStatus =
				(beforeCentralApprovalStatusNamesAndColor as any)[statusFlowId] ??
				defaultFlowInfo;


		return iterationStatus
}
const getStatusToOption = (typeFlow: TYPE_FLOW, status: TEntriesStatus[], title: string, sufix:string = "T" ): TOptions[] => status.map((item) => ({label: `${title} - ${item[1].label}` , value: `${item[0]}|${typeFlow}|${sufix}`}))

export const getAllStatusToOption = (): TOptions[] => {
	const allOptions = [] as TOptions[];
	const PROPERTYI = Object.entries(propertyStatusNamesAndColor) as TEntriesStatus[]
	allOptions.push(...getStatusToOption(TYPE_FLOW.PROPERTY, PROPERTYI,  "Bens Imovel", "I"))
	const PROPERTY = Object.entries(propertyStatusNamesAndColor) as TEntriesStatus[]
	allOptions.push(...getStatusToOption(TYPE_FLOW.PROPERTY, PROPERTY,  "Bens Movel", "M"))
	const LETTER = Object.entries(letterStatusNamesAndColor) as TEntriesStatus[]
	allOptions.push(...getStatusToOption(TYPE_FLOW.LETTER, LETTER, "Fiança bancária"))
	const INSURANCE = Object.entries(insuranceStatusNamesAndColor) as TEntriesStatus[]
	allOptions.push(...getStatusToOption(TYPE_FLOW.INSURANCE, INSURANCE, "Seguro garantia"))
	return allOptions
}

export const getStatusTextFromGoodAndGuarantees = (
	typeFlow: TYPE_FLOW,
	statusFlowId: STATUSES_FLOW,
	statusApprovalId: STATUS_APPROVALS_FLOW
) => getStatusInfoFromGoodAndGuarantees(typeFlow, statusFlowId, statusApprovalId).label

type RuleLogFunction = (log: TLogs, index: number, ruleProps: { typeFlow: TYPE_FLOW }) => RowConfig

export const getLogFromGoodsAndGuarantees: RuleLogFunction = (log, index, ruleProps) => {
	const { typeFlow } = ruleProps
	const { statusFlowId, statusApprovalId } = log
	const iterationStatus = getStatusInfoFromGoodAndGuarantees(typeFlow, statusFlowId, statusApprovalId)

	return {
		text: iterationStatus.label,
		color: iterationStatus.color
	}
}

export const getLogFromGoodsAndGuaranteesForLogs: RuleLogFunction = (log, index, ruleProps) => {
	const { typeFlow } = ruleProps
	const { statusFlowId, statusApprovalId } = log
	let iterationStatus = getStatusInfoFromGoodAndGuarantees(typeFlow, statusFlowId, statusApprovalId)

	if (statusApprovalId === 1 && statusFlowId === -1)
		iterationStatus = dataImport
	if (statusApprovalId === 1 && statusFlowId === 11)
		iterationStatus = reversed
	return {
		text: iterationStatus.label,
		color: iterationStatus.color
	}
}