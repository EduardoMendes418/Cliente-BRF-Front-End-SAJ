import { paymentsInstance } from '.';
import { TParamsXlsx } from 'src/core/models/watson'
import { getIdToken } from '../utils/func';


const BASE_URL = 'ExportWatson';

const api = {
	getWatsonStatusreturnFile(watsonLoadExecutionId: string) {
		return paymentsInstance.get(`${BASE_URL}/get-watson-status-return-file`, { params: {watsonLoadExecutionId} });
	},
	reprocessReturnFile(watsonLoadExecutionId: string) {
		return paymentsInstance.post(`${BASE_URL}/reprocess-return-file`,  [watsonLoadExecutionId]);
	},
	export(params: any, baseRevision: boolean, simulation: boolean) {
		return paymentsInstance.post(`${BASE_URL}/start-manual-load-watson`, params, {params: {baseRevision, simulation}});
	},
	list({page, pageSize, notPaginate, ...params}: any) {
		return paymentsInstance.post(`${BASE_URL}/get-watson-load-execution`, {...params}, { params: {page, pageSize, notPaginate} });
	},
	exportxlsx(params: TParamsXlsx) {
		const options = {
			method: 'GET',
			headers: {
				"Accept": "*/*",
				'Authorization': `Bearer ${getIdToken()}`,
			}
		}
		return fetch(`${import.meta.env.REACT_APP_BASE_URL_PAYMENTS}${BASE_URL}/get-file-excel?${params.nameFiles}&idWatson=${params.idWatson}`, options)
			.then((response) => response.blob())


	}
};

export default api;