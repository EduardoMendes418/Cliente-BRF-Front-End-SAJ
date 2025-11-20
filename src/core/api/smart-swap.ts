import { TSmartSwapChangingParams, TSmartSwapFilter } from 'src/core/models/smart-swap';
import { ParamsGet } from 'src/core/models';

import { paymentsInstance } from '.';

const BASE_URL = 'SmartSwap'

const paymentTypeAPI = {
	async list(params: ParamsGet & TSmartSwapFilter) {
		let folderNumber: string = '';
		if (params?.foldersNumber && params?.foldersNumber !== "" && typeof params?.foldersNumber === "string")
			params?.foldersNumber.split(";").forEach(folder => folderNumber += `folderNumber=${folder}&`);
				
		const newParams = params;
		delete newParams.foldersNumber;

		return paymentsInstance.get(`${BASE_URL}/get-smart-swap?${folderNumber.replace(/.$/,'')}`, { params: newParams });
	},
	update(smartSwapId: string, data: TSmartSwapChangingParams) {
		return paymentsInstance.put(`${BASE_URL}/update-smart-swap`, data, {
			params: { smartSwapId },
		});
	},
	reprocess(processIds: number[], data: string, smartSwapId:string) {
		return paymentsInstance.put(`${BASE_URL}/update-smart-swap`, data, {
			params: { processIds, smartSwapId },
		});
	},
	generateExcel(smartSwapId: string) {
		return paymentsInstance.get(`${BASE_URL}/export-excel-smart-swap`, {
			params: { smartSwapId },
			responseType: 'arraybuffer'
		});
	}
};

export default paymentTypeAPI;
