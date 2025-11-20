import { LegalDocFormType } from "src/screen/settings/legal-documents/utils/constants"
import { ParamsGet } from "."

export type Block = {
	id?: number
	transientId: string
	legalDocumentDraftTypeId?: number
	name: string
	value: string
	isActive: boolean
	variables: Variable[]
}

export type Variable = {
	id?: number
	transientId: string
	transientBlockId?: string
	legalDocumentDraftTypeId?: number
	legalDocumentDraftTypeBlockId?: number
	name: string
	legalDocumentTableVariableId: number
	isActive: boolean
	draftTypeBlock?: Block
}

export type VariableForm = {
	name: string
	legalDocumentTableVariableId: number
	legalDocumentDraftTypeBlockId?: number
	transientBlockId?: string
}

export type File = {
	id: number
	legalDocumentDraftTypeId: number
	documentName: string
	path: string
	file: null
}

export type TLegalDocDraftType = {
	id?: number
	name: string
	legalDocumentFormType: LegalDocFormType | ''
	isActive: boolean
	blocks: Block[]
	variables: Variable[]
	files?: any[]
}

export type TLegalDocDraftTypeFilter = {
	name?: string
	isActive?: boolean
	id?: number
} & ParamsGet
