export type TLegalDocumentSwapFilter = {
	id?: number
	legalDocumentRequestTypeId?: number
	requestDateStart?: Date
	requestDateEnd?: Date
	requestUserName?: string
	dejurAreaId?: number
	folderNumber?: string
	processNumber?: string
	coverageId?: number
	requestStatus?: LegalDocumentSwapStatusEnum[]
	internalLawyerId?: number
	legalResponsibleId?: number
	office?: string
	serviceUserId?: number
	expectedServiceDateStart?: Date
	expectedServiceDateEnd?: Date
	conclusionDate?: Date
	mandatoryCorrespondentData?: boolean
	notPaginate?: boolean
	page?: number
	pageSize?: number
}

export enum LegalDocumentSwapStatusEnum {
	//[Description("Devolvido Atendimento")]
	ReturnedService = 2,
	//[Description("Em Assinatura")]
	InSignature = 3,
	//[Description("Em Atendimento")]
	InTreatment = 4,
	//[Description("Pendência de Informação")]
	InformationPending = 6,
	//[Description("Solicitado")]
	Requested = 8,
	//[Description("Validação Jurídico")]
	LegalValidation = 9
}

export type TLegalDocumentSwapEdit = {
	serviceUserId?: number
	filter?: TLegalDocumentSwapFilter
}