import {TLitigationParticipantSituationEnum} from "../models/litigation-participant-positions";
import {paymentsInstance} from "./index";

const BASE_URL = "LitigationParticipantPositions"

const api = {
	get(situation: TLitigationParticipantSituationEnum) {
		return paymentsInstance.get(BASE_URL, {params: {situations: situation.valueOf()}})
	}
}

export default api;