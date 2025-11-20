import {
	TJudicialBlocksAndTransfers,
	TJudicialBlocksAndTransfersParams,
} from "../models/judicial-blocks-and-transfers";
import { paymentsInstance } from ".";
import { upload } from "./utils";
import { STATUS_FLOW } from "src/screen/judicial-blocks-and-transfers/constants";

const BASE_URL = "/JudicialBlocksAndTransfers";

const judicialBlocksAndTransfersApi = {
	list(params: TJudicialBlocksAndTransfersParams) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	getById(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } });
	},

	add(value: TJudicialBlocksAndTransfers) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(value));
	},

	edit(value: TJudicialBlocksAndTransfers) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(value));
	},

	uploadFiles(judicialBlocksAndTransferId: number, filesList: FileList) {
		const url = `${BASE_URL}/uploadFiles?judicialBlocksAndTransferId=${judicialBlocksAndTransferId}`;
		return upload(paymentsInstance, url, filesList);
	},

	deleteFile(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?fileId=${id}`);
	},

	updateStatusFlow(id: number, statusFlowId: STATUS_FLOW, observation = "", rejectionAndReturnReasonsId?: number | "" ) {
		let params = { id, statusFlowId } as any;
		if (observation) params = { ...params, observation, rejectionAndReturnReasonsId: rejectionAndReturnReasonsId };

		return paymentsInstance.patch(`${BASE_URL}/set-status`, undefined, {
			params,
		});
	},

	getAccountingSapResponse(id: number, folderNumber: string) {
		return paymentsInstance.get(`${BASE_URL}/get-accounting-sap-responses`, {
			params: {
				folderNumber,
				judicialBlocksAndTransferId: id,
			},
		});
	},
};

export default judicialBlocksAndTransfersApi;
