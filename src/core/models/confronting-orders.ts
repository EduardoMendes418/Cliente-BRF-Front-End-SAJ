import { CONFRONTER_STATUS } from "src/screen/confronter/utils/constants"
import { TOrderFile } from "./provision-order"

export type TConfrontingOrdersFilters = {
	legalDepartmentAreaId: number
	companyId: number
	processNumber: string
	oppositePartyId: number
	folderNumber: string
	contingency: string
	statusProcess: number
	expectationId: number
	intenalLawyerId: number
	agentId: number
	legalResponsibleId: number
	responsibleAreaId: number
	responsibleId: number
	orderDescriptionId: number
	confronterPhase: number
	statusFlowId: number[]
	responsible: string
}

export type TConfrontingOrderRating = {
	orderRatingDescriptionId: number
	orderRatingDescriptionName: string
	orderRatingProbababilityId: number
	orderRatingProbababilityName: string
	orderRatingDescriptionOrderById: number
	fromDatabase: string
	toDatabase: string
	fromFormulaCorrectionRuleName: string
	toFormulaCorrectionRuleName: string
	fromValue: number
	toValue: number
}

export type TGroupedConfrontingOrder = {
	id: number
	orderRatingDescriptionId: number
	orderRatingDescriptionName: string
	orderRatingDescriptionOrderById: number
	fromDatabase: string
	toDatabase: string
	hasDatabaseChanged: boolean
	fromFormulaCorrectionRuleName: string
	toFormulaCorrectionRuleName: string
	hasFormulaCorrectionRuleNameChanged: boolean,
	createdDate: string,
	fromProbableValue: number
	toProbableValue: number
	hasProbableValueChanged: boolean
	fromPossibleValue: number
	toPossibleValue: number
	hasPossibleValueChanged: boolean
	fromRemoteValue: number
	toRemoteValue: number
	hasRemoteValueChanged: boolean
	createdBy?:string
}

export type TConfrontingOrderFile = {
  id: number
  confrontingOrdersId: number
  documentName: string
  path: string
  file: any
  deleted: boolean
  to: string
  from: string
}

export interface TConfrontingOrderLog {
	dueDate?: string;
	id: number;
	logDataFromId: number;
	observation: string;
	occurrenceDate: string;
	rejectionAndReturnReasonsId?: number;
	requestId: number;
	statusApprovalId: number;
	statusFlowId: number;
	user?: string;
	userId: number;
	userName: string;
	confrontingOrder?: TConfrontingOrder
}

export type TConfrontingOrder = {
	id: number
	statusFlowId: CONFRONTER_STATUS | number
	statusProcess: number
	processNumber: string
	oppositeParty: string
	folderNumber: string
	responsibleAreaName: string
	internalLawyer: string
	legalResponsible: string
	legalDepartmentAreaName: string
	confrontationalPhase: string
	statusFlowIdLevel1: string
	statusFlowIdLevel2: string
	approver: boolean
	approverLevel1: string
	opinionLevel1: string
	approverLevel2: string
	opinionLevel2: string
	fromIsActive: boolean
	toIsActive: boolean
	fromOrderExpectationName: string
	toOrderExpectationName: string
	fromOrderDescriptionName: string
	toOrderDescriptionName: string
	fromOrderProbabilityName: string
	toOrderProbabilityName: string
	confrontingOrderRatings: TConfrontingOrderRating[]
	logs?: TConfrontingOrderLog[];
	confrontingOrderFiles: TOrderFile[]
	contingency?: string
}


export type TableRow = TConfrontingOrder & {
	ratingsByDescription: Record<number, TGroupedConfrontingOrder>
	statusProcessoName: string // Added by the front
	check: boolean // Added by the front
	createdDate?: string,
	createdBy?:string
}