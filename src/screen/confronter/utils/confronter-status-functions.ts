import { CONFRONTER_STATUS } from "./constants";

export function checkIsPending(status: CONFRONTER_STATUS) {
	return [
		CONFRONTER_STATUS.PENDENTE_NIVEL_1,
		CONFRONTER_STATUS.PENDENTE_NIVEL_2
	].includes(status)
}
