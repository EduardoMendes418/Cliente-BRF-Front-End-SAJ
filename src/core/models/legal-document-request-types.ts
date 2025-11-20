import { COUNT_DEADLINE, RESPONSIBLE_TYPE } from "src/screen/settings/general/request-parameters/constants"
import { LegalDocFormType } from "src/screen/settings/legal-documents/utils/constants"

import { ParamsGet } from "."

export type LegalDocRequestTypeDraft = {
	id: number
	legalDocumentRequestTypeId: number
	legalDocumentDraftTypeId: number
	docuSignKey: string
	isActive: boolean
	legalDocumentDraftType?: {
		name: string
	}
}

export type TLegalDocRequestType = {
	id?: number
	name: string
	isActive?: boolean
	formType: LegalDocFormType | ''
	attachmentRequired: boolean | '',
	folderNumberRequired: boolean | '',
	hasDeadline: boolean | '',
	hoursDeadline: number | null | '',
	countDeadline: COUNT_DEADLINE | '',
	autoReproval: boolean | '',
	responsibleType: RESPONSIBLE_TYPE | '',
	responsibleUserId: number | '',
	requestHelp: string,
	informativeNote: string,
	administrativeControlResponsiblesIds: number[],
	legalDocumentRequestTypeDrafts?: LegalDocRequestTypeDraft[]
	userInformation: string | null
}

export type TLegalDocRequestTypeFilter = {
	name?: string
	formType?: number
} & ParamsGet
