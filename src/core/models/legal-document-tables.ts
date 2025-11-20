export type FieldOptionStructure = {
	id: number
	description: string
	field: string
	legalDocumentTableId: number
}

export type TableOptionStructure = {
	id: number
	name: string
	description: string
	variables: FieldOptionStructure[]
}
