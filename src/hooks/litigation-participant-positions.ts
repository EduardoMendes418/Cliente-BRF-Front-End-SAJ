import {TLitigationParticipantSituationEnum} from "../core/models/litigation-participant-positions";
import {useDispatch, useSelector} from "react-redux";
import {actions, AppDispatch} from "../core/store";
import {getLitigationParticipantPositions} from "../core/store/modules/litigation-participant-positions/selectors";
import {useEffect, useMemo} from "react";
import {fetchLitigationParticipantPositions} from "../core/store/modules/litigation-participant-positions/thunks";
import {TOptionsSelect} from "../components/form";

export const useLitigationParticipantPosition = (situation: TLitigationParticipantSituationEnum | null) => {
	const dispatch = useDispatch<AppDispatch>()
	const litigationParticipants = useSelector(getLitigationParticipantPositions)
	
	useEffect(() => {
		if(situation)
			dispatch(fetchLitigationParticipantPositions(situation))
		else
			dispatch(actions.litigationParticipantPositions.clean())
	}, [dispatch, situation])
	
	const litigationParticipantPositionsOptions = useMemo(() => litigationParticipants
		.map(x => ({label: x.name, value: x.id} as TOptionsSelect)), [litigationParticipants])
	
	return {
		litigationParticipantPositions: litigationParticipants,
		litigationParticipantPositionsOptions
	}
}