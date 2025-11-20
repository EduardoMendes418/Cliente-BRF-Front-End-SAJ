import { paymentsInstance } from ".";
import { TAccountabilitySapResponseFilter } from "../models/accountability";

const BASE_URL = "Accountability";

const api = {
	getSapResponse(params: TAccountabilitySapResponseFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-sap-response`, {
			params,
		});
	},
	getSapResponseByJudicialBlocksAndTransferId(judicialBlocksAndTransferId: number) {
		return paymentsInstance.get(`${BASE_URL}/get-sap-response-by-judicial-blocks-and-transfer-id`, {
			params: { judicialBlocksAndTransferId, page: 100 }
		});
	},
	costCenterReclassification(accountabilityId: number) {
		return paymentsInstance.get(`${BASE_URL}/cost-center-reclassification`, {
			params: {
				accountabilityId
			}
		})
	}
}

export default api;
