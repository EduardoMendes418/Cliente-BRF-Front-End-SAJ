import { ParamsGet } from "."
import { TProcess } from "./process";
import { TUser } from "./users";

export enum LegalDocumentFormTypeEnum {
	// [Description("Carta Preposição")]
	PrepositionLetter = 1,
	// [Description("Substabelecimento")]
	Replacement = 2,
	// [Description("Procuração Eletrônica - Jurídico")]
	EletronicProcurationLegal = 3,
	// [Description("Procuração Eletrônica - Demais Áreas")]
	EletronicProcurationOtherAreas = 4
}

export const LegalDocumentRequestStatusTranslation = [
	"legalDocs:requestStatus.cancelled",
	"legalDocs:requestStatus.returnedService",
	"legalDocs:requestStatus.inSignature",
	"legalDocs:requestStatus.inTreatment",
	"legalDocs:requestStatus.finished",
	"legalDocs:requestStatus.informationPending",
	"legalDocs:requestStatus.disapproved",
	"legalDocs:requestStatus.requested",
	"legalDocs:requestStatus.legalValidation"
]

export enum LegalDocumentRequestStatusEnum {
	ALL = -1, // NOT EXIST ON API, ONLY CREATED TO USE IN SELECT

	//[Description("Cancelado")]
	Cancelled = 1,
	//[Description("Devolvido Atendimento")]
	ReturnedService = 2,
	//[Description("Em Assinatura")]
	InSignature = 3,
	//[Description("Em Atendimento")]
	InTreatment = 4,
	//[Description("Finalizado")]
	Finished = 5,
	//[Description("Pendência de Informação")]
	InformationPending = 6,
	//[Description("Reprovado")]
	Disapproved = 7,
	//[Description("Solicitado")]
	Requested = 8,
	//[Description("Validação Jurídico")]
	LegalValidation = 9
}

export const LegalDocumentFormTypeFieldTranslation = [
	'legalDocs:requestTypesList.prepositionLetter',
	'legalDocs:requestTypesList.replacement',
	'legalDocs:requestTypesList.electronicPowerOfAttorney.legal',
	'legalDocs:requestTypesList.electronicPowerOfAttorney.otherAreas',
];

export const LegalDocumentRequestSignatureTranslation = [
	'legalDocs:request.signatureType.eletronic',
	'legalDocs:request.signatureType.manual',
]

export enum LegalDocumentRequestSignatureEnum {
	//  [Description("Eletrônica")]
	Electronic = 1,
	//  [Description("Manual")]
	Manual = 2
}

export enum LegalDocumentCoverageEnum {
	// [Description("Genérica")]
	Generic = 1,
	// [Description("Específica")]
	Specific = 2
}

export type TLegalDocStatusUpdate = {
	id: number
	status: LegalDocumentRequestStatusEnum
	observation: string
	responsibleUserId: number
}

export interface TLegalDocFilter extends ParamsGet {
	legalDocumentRequestTypeId?: LegalDocumentFormTypeEnum | null;
	requestDateStart?: string | null;
	requestDateEnd?: string | null;
	requestUserName?: string;
	dejurAreaId?: number | null;
	folderNumber?: string;
	processNumber?: string;
	coverage?: LegalDocumentCoverageEnum | null;
	requestStatus?: LegalDocumentRequestStatusEnum | LegalDocumentRequestStatusEnum[];
	internalLawyerId?: number;
	legalResponsibleId?: number;
	office?: string;
	serviceUserId?: number;
	expectedServiceDateStart?: string | null;
	expectedServiceDateEnd?: string | null;
	conclusionDate?: string | null;
	mandatoryCorrespondentData?: boolean;
}

export type TLegalDoc = {
	id?: number
	folderNumbers: string[] | null
	folderNumber: string
	legalDocumentRequestTypeId?: number | null
	processId?: number
	requestUserId?: number
	responsibleUserId?: number
	responsibleUserName?: string
	requestDate: Date
	signatureType?: LegalDocumentRequestSignatureEnum | null
	processNumber?: string
	isDeleted?: boolean
	files?: FileList
	legalDocumentRequestType?: LegalDocumentRequestType
	status?: LegalDocumentRequestStatusEnum
	prepositionLetter?: LegalDocumentPrepositionLetter
	prepositionReplacement?: LegalDocumentPrepositionReplacement
	eletronicProcurationLegal?: LegalDocumentEletronicProcurationLegal
	eletronicProcurationOtherArea?: LegalDocumentEletronicProcurationOtherArea
	requestUser?: TUser
	process?: TProcess
	serviceUserId?: number
	serviceUser?: TUser
}

export type LegalDocumentRequestType = {
	formType: LegalDocumentFormTypeEnum
	dejurAreaId?: number
	name: string
}

export type LegalDocumentPrepositionLetter = {
	id?: number
	coverageId: number | ''
	legalDocumentRequestId: number | ''
	dejurAreaId: number | ''
	folderNumber: string
	observation: string
	processNumber: string
	parties: LegalDocumentPrepositionLetterParties[]
	processes: LegalDocumentPrepositionLetterProcess[]
}

export enum LegalDocumentPrepositionLetterPartyEnum
{
		// [Description("Empresa")]
		Company = 1,
		// [Description("Nomeado")]
		Individual = 2
}

export type LegalDocumentPrepositionLetterParties = {
	id?: number
	legalDocumentRequestPrepositionLetterId?: number
	name: string
	identificationNumber: string
	addressName: string
	addressNumber: string
	addressNeighborhood: string
	addressCityId: number
	addressStateId: number
	addressPostalCode: string
	partyType: LegalDocumentPrepositionLetterPartyEnum
	registryIdentification?: string
	identifier?: string
	role?: string
}

export type LegalDocumentPrepositionLetterProcess = {
	id?: number
	processNumber: string
	legalCourt: string
	district: string
	actionType: string
	observation?: string
}

export type LegalDocumentPrepositionReplacement = {
	id: number
	legalDocumentRequestId: number
	legalDocumentGrantId: number
	coverageId: number
	dejurAreaId: number
	folderNumber: string
	observation: string
	processNumber: string
	parties: LegalDocumentPrepositionReplacementParties[]
	processes: LegalDocumentPrepositionLetterProcess[]
} & LegalDocumentPrepositionReplacementExtraData

export type LegalDocumentPrepositionReplacementExtraData = {
	powers: string
	observationProcess: string
}

export enum LegalDocumentPrepositionReplacementPartyEnum
{
		// [Description("Empresa")]
		Company = 1,
		// [Description("Substalecimento")]
		Replacements = 2,
		// [Description("Correspondente")]
		Correspondents = 3
}

export type LegalDocumentPrepositionReplacementParties = {
	id?: number
	name: string
	identificationNumber: string
	addressName: string
	addressNumber: string
	addressNeighborhood: string
	addressCityId: number
	addressStateId: number
	addressPostalCode: string
	partyType: LegalDocumentPrepositionReplacementPartyEnum
	registryIdentification?: string
	oabState?: string
	officeName?: string
	officeOAB?: string
}

export type LegalDocumentEletronicProcurationLegal = {
	id: number
	legalDocumentRequestId: number
	publicAgency: string
	processNumber: string
	folderNumber: string
	observation: string
	grantorName: string
	grantorCNPJ: string
	granteds: LegalDocumentEletronicProcurationLegalGranteds[]
} & LegalDocumentEletronicProcurationLegalExtraData

export type LegalDocumentEletronicProcurationLegalExtraData = {
	validityStart?: Date
	validityEnd?: Date
	justification: string
	powers: string
}

export enum PersonTypeEnum
{
		// [Description("Jurídica")]
		Legal = 1,
		// [Description("Física")]
		Phisical = 2
}

export type LegalDocumentEletronicProcurationLegalGranteds = {
	id?: number
	personType: PersonTypeEnum
	name: string
	identificationNumber: string
	employeeBRF: boolean
	partnerOfficeName: string
}

export type LegalDocumentEletronicProcurationOtherArea = {
	id?: number
	legalDocumentRequestId?: number
	folderNumber: string
	publicAgency?: string
	processNumber?: string
	physicalProcuration?: boolean
	observation?: string
	grantorName: string
	grantorCNPJ: string
	granteds?: LegalDocumentEletronicProcurationLegalGranteds[]
} & LegalDocumentEletronicProcurationOtherAreaExtraData

export type LegalDocumentEletronicProcurationOtherAreaExtraData = {
	validityStart?: Date
	validityEnd?: Date
	justification?: string
	powers?: string
}

export type TLegalDocumentInput = {
	inputs: {
		company: TLegalDocumentInputCompany
	}
}

export type TLegalDocumentInputCompany = {
	name: string
	identificationNumber: string
	addressName: string
	addressNumber: string
	addressNeighborhood: string
	addressCityId: number
	addressStateId: number
	addressPostalCode: string
}
