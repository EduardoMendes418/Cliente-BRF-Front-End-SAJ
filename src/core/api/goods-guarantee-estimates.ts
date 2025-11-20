import { TBudget } from '../models/goods-guarantee-estimates';
import { upload } from './utils';
import { paymentsInstance } from '.';

const BASE_URL = '/GoodsGuaranteesEstimates';

const goodsGuaranteesEstimatesApi = {
	add(value: TBudget[]) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(value));
	},

	edit(value: TBudget) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(value));
	},

	uploadFiles(id: number, main: boolean, filesList: FileList) {
		const url = `${BASE_URL}/uploadFiles?id=${id}&isMainFile=${main}`;
		return upload(paymentsInstance, url, filesList);
	},

	deleteFile(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?fileId=${id}`);
	},
};

export default goodsGuaranteesEstimatesApi;