export enum STAGE {
	REJECTED = -1,
	NONE = 0,
	SOLICITATION = 1,
	TO_APROVAL = 2,
	LEGAL_RESPONSIBLE = 3,
	INTERNAL_LAWYER = 4
}

export const pathStage = {
	"/gestao-escritorio/solicitar-reembolso": STAGE.SOLICITATION,
	"/gestao-escritorio/aprovacao-juridico-reembolso": STAGE.TO_APROVAL,
	"/gestao-escritorio/advogado-interno-reembolso": STAGE.INTERNAL_LAWYER
} as any