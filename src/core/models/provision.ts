export type TProvisionReportPost = {
	dejurAreas: number[]
	competence: string | null,
	competenceOne: string | null,
	competenceTwo: string | null

}

export type TBusinessCombinationParameters = {
	dejurAreaId?: number | null;
	competence: string | null;
	haveBusinessCombination?: boolean;
}

export type ProvisionRequestReportFilter = {
	folderNumber: string[]
	legalDepartmentAreaId: number[]
	originAreaId: number[]
	createdDateStart: string
	createdDateEnd: string
	dataComplementoCadastroStart: string
	dataComplementoCadastroEnd: string
	contingency: string
	statusId: number[]
	type: string
	preposto: string
	internalLawyer: number
	mainResponsible: number
	responsibleAreaId: number
	officeResponsible: number
	actionTypeId: number
	provisionClass: string
	closure: number
	costCenter: string
	sphere: string[]| string
	active: boolean | null | ''
	filterId?: number | null
}

export type ProvisionRequestReportFilterForm = Omit<ProvisionRequestReportFilter, "folderNumber" | "createdDateStart" | "createdDateEnd" | "dataComplementoCadastroStart" | "dataComplementoCadastroEnd" | "actionTypeId" | "provisionClass" | "closure" | "mainResponsible" | "internalLawyer" | "responsibleAreaId" | "officeResponsible" | "preposto"> & {
	folderNumber: string
	createdDateStart: string | null
	createdDateEnd: string | null
	dataComplementoCadastroStart: string | null
	dataComplementoCadastroEnd: string | null
	actionTypeId: number[] | ''
	provisionClass: string[] | string
	closure: number[] | ''
	orderDescriptionId: number[]
	orderExpectationId: number[]
	orderProbabilityId?: number[]
	orderStatusId: number[]
	orderRatingDescription: number[]
	riskValueStart?: number | ''
	riskValueEnd?: number | ''
	baseDateStart: string | null
	baseDateEnd: string | null
	correctionIndex: number[]
	sumProvisionTable: boolean | ''
	active: boolean | '' | null
	orderRatingsValueStart?: number | ''
	orderRatingsValueEnd?: number | ''
	hasAttachment?: boolean | ''
	probableValueStart?: number | ''
	probableValueEnd?: number | ''
	possibleValueStart?: number | ''
	possibleValueEnd?: number | ''
	remoteValueStart?: number | ''
	remoteValueEnd?: number | ''
	internalLawyerIds: number[] | ''
	mainResponsibleIds: number[] | ''
	responsibleAreaIds: number[] | ''
	officeResponsibleIds: number[] | ''
	prepostoIds: number[] | ''
};

