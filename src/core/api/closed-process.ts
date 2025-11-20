import { paymentsInstance } from "."
import { TClosedProcessReport } from 'src/core/models/closed-process';

const BASE_URL = 'ClosedProcess'

const api = {
	generateClosedProcessReport(params: TClosedProcessReport) {
		return paymentsInstance.get(`${BASE_URL}/honorario-exito/get-excel`, {
			params,
			responseType: 'arraybuffer'
		})
	},

	circularizationOfficeLaunchProcess(params: any){
		return paymentsInstance.get(`${BASE_URL}/circularizationOfficeLaunch/processes`, {
			params,
		})
	}
}

export default api;