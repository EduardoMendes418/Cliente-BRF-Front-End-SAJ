import {TLitigationParticipantSituationEnum} from "../../../core/models/litigation-participant-positions";

export const situationToArray = (situationId: number) => {
	const items = new Array<TLitigationParticipantSituationEnum>()
	if(situationId & TLitigationParticipantSituationEnum.Company)
		items.push(TLitigationParticipantSituationEnum.Company)
	if(situationId & TLitigationParticipantSituationEnum.Responsible)
		items.push(TLitigationParticipantSituationEnum.Responsible)
	if(situationId & TLitigationParticipantSituationEnum.Others)
		items.push(TLitigationParticipantSituationEnum.Others)
	if(situationId === 0)
		items.push(TLitigationParticipantSituationEnum.None)
	
	return items
}