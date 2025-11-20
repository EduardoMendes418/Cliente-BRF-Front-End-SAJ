import { FOLDER_STATUS } from "src/screen/settings/constants"
import { TOrderDescription } from 'src/core/models/order-description'
import { TOrderExpectation } from 'src/core/models/order-expectation'
import { TOrderProbability } from 'src/core/models/order-probability'
import { TOrderRatingDescription } from 'src/core/models/order-rating-description'
import { TOrderStatus } from 'src/core/models/order-status'
import { TFormulaCorrectionRule } from "./formula-correction-rule"
import { CONTINGENCY } from "src/screen/provisions/utils/constantes"

export type TOrderRating = {
	orderId?: number
	id?: number,
	orderRatingId?: number
	orderRatingProbababilityId: number
	orderRatingDescriptionId: number | ''
	accountabilityId?: number
	value: number
	correctedValue: number
	feesValue: number
	riskValue: string | number
	dataBase: Date | string | null
	formulaCorrectionRuleId: number | ''
	orderRatingDescription?: TOrderRatingDescription
	formulaCorrectionRule?: TFormulaCorrectionRule
	transientId?: string // Added by the frontend
	hasChanged?: boolean // Added by the frontend
	orderRatingProbabability: {
		account:boolean
		id: number
	}
}

export type TOrderRatingForm = {
	orderRatingDescriptionId: number | ''
	probableValue: string | number,
	possibleValue: string | number,
	remoteValue: string | number,
	probableId: number
	probablePaymentValue?: string | number,
	possiblePaymentValue?: string | number,
	remotePaymentValue?: string | number,
	riskValue: string | number,
	dataBase: Date | string | null
	formulaCorrectionRuleId: number | ''
	hasChanged?: boolean // Added by the frontend
}

export type TGroupedOrderRatingProbabilities = TOrderRatingForm & {
	orderRatingDescription: string
	formulaCorrectionRule: string
	transientId?: string // Added by the frontend
	isRowEditable?: boolean
}

export type TOrderFile = {
	to: string
	from: string
	id?: number
	ordersId?: number
	path?: string
	documentName: string
	file: string | null // byte[]
}

export type TProvisionOrder = {
	orderDescriptionId: number | ''
	id?: number | ''
	createdDate: Date | string | null
	orderExpectationId: number | ''
	orderStatusId: number | ''
	orderProbabilityId: number | ''
	isActive: boolean
	orderRatings: TOrderRating[]
	orderDescription: TOrderDescription
	orderExpectation?: TOrderExpectation
	orderProbability?: TOrderProbability
	orderStatus?: TOrderStatus
	orderFiles?: TOrderFile[]
	transientId?: string // Added by the frontend
	provisionValue?: number // Added by the frontend
	hasChanged?: boolean // Added by the frontend
	isFormBlocked?: boolean // Added by the frontend
	totalProvisionValue?: number
}

export type TpaymentOrders = {
	id: number | '',
	paymentId: number | '',
	accountabilityId?: number | '',
	orderRatingId: number | '',
	value: number | '',
	isDeleted?: boolean
}

export type TOrderForm = Pick<TProvisionOrder,
	'orderDescriptionId' |
	'createdDate' |
	'orderExpectationId' |
	'orderStatusId' |
	'orderProbabilityId'
> & {
	orderFiles: (TOrderFile | File)[]
}

export type TTreatedOrderForm = Pick<TProvisionOrder,
	'orderDescriptionId' |
	'createdDate' |
	'orderExpectationId' |
	'orderStatusId' |
	'orderProbabilityId' |
	'orderFiles'
>

export type TProvisionOrderForm = TOrderForm & TOrderRatingForm

export type TProvisionProcessParty = {
	name: string
	situation: 'Responsável' | 'Cliente' | 'Outra parte' | 'Advogado de outra parte' | 'Outro'
}

export type TProvisionProcess = {
	originArea?: string | undefined
	legalDepartmentArea: string
	legalDepartmentAreaId: number
	oldNumber: string | null
	processNumber: string | null
	id: number
	internalLawyer: string
	agent: string
	office: string
	officeManager: string
	groupingCostCenter: string
	provisionClass: string
	contingency: CONTINGENCY
	sphere: string
	orders: TProvisionOrder[]
	statusId: FOLDER_STATUS
	processParty: TProvisionProcessParty[]
	responsibleAreaId: number
	folderNumber: string
	isPendingOnTheConfronter: boolean
	attachments: any[],
	responsibleOoffice: string,
	responsibleOfficeId: number,
	courtPanelDescription: string,
	locationName: string,
	bcValue: string | null,
	valueBcConsolidationAdjustment: string | null,
	bcValueWrittenoff: string | null,
	lowDateBc: string | null
	lastEqualizationDate: string
	closure: string
	type: string
	courtPanelNumber: number
	requesterName: string
	jurisdictionName: string;
	hasConfronter?: boolean;
	otherPartName?: string;
	speciesCategory?: string;
	actionType?: string;
	responsibleLegal?: string
	lawyerOppositeParty?: string
	terminationDate?: string
	closingDate?: string
	result?: string
	registrationCompletionDate?: string
	companyName?: string
	jurisdictionDescription?: string
}

export type ChangableOrder = Pick<TProvisionOrder,
	'orderDescriptionId'|'orderExpectationId'|'orderProbabilityId'|'orderStatusId'|'isActive'|'orderRatings'
> & {
	createdDate: string
}