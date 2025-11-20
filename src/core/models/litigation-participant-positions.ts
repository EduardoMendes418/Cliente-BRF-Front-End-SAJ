export enum TLitigationParticipantSituationEnum {
	None = 0,
	Responsible = 1,
	Company = 2,
	Others = 4,
}

export type TLitigationParticipantPosition = {
	id: number,
	name: string
	availableForLawsuit: boolean,
	availableForAppeal: boolean,
	availableForProceduralIssue: boolean,
	availableForMainClient: boolean,
	availableForOtherParticipants: boolean,
	availableForResponsible: boolean
}