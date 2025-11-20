import { paymentsInstance } from '.'
import {
	TProvisionReportPost,
	TBusinessCombinationParameters,
	ProvisionRequestReportFilter
} from 'src/core/models/provision'
import { ORDER_EXPECTATIONS } from 'src/screen/provisions/utils/constantes'
import { TProvisionOrder } from '../models/provision-order'
import { customUploadFilesConfig } from './utils'

const BASE_URL = 'Provision'

const api = {
	generateProvisionReport({ dejurAreas, competenceOne, competenceTwo }: TProvisionReportPost) {
		return paymentsInstance.post(`${BASE_URL}/provision-report`, dejurAreas, {
			params: { competenceOne, competenceTwo },
			responseType: 'arraybuffer'
		})
	},
	getBusinessCombination(params: TBusinessCombinationParameters) {
		return paymentsInstance.get(`${BASE_URL}/business-combination-report`, { params })
	},
	getGrid(folderNumber: string, orderExpectationId: ORDER_EXPECTATIONS | null) {
		return paymentsInstance.get(`${BASE_URL}/provision-totalizer-grid`, { params: { folderNumber, orderExpectationId } })
	},
	updateValues(folderNumber: string) {
		return paymentsInstance.get(`${BASE_URL}/apply-formula-correction-rule-by-folder-number`, { params: { folderNumber } })
	},
	simulateFormulaByOrders(orders: TProvisionOrder[]) {
		return paymentsInstance.post(`${BASE_URL}/simulate-formula-correction-rule-by-orders`, orders)
	},
	getSimulatedGrid(params: unknown, data: unknown) {
		return paymentsInstance.post(`${BASE_URL}/format-orders-to-provision-totalizer-grid`, data, { params })
	},
	generateProvisionReportRequest(filter: Partial<ProvisionRequestReportFilter>) {
		return paymentsInstance.post(`${BASE_URL}/provision-request-report`, filter, {
			responseType: 'arraybuffer'
		})
	},
	getProvisionsProcessByCsv(formFile: FileList) {
		const data = new FormData()
		data.append("formFile", formFile[0]);

		return paymentsInstance.post(
			`${BASE_URL}/apply-formula-correction-rule-by-csv`,
			data,
			{ ...customUploadFilesConfig }
		)
	},
	getReportExecutionManagerGridList(pageSize: number, page: number){
		return paymentsInstance.get(`${BASE_URL}/provision-report-execution-manager-grid-list?pageSize=${pageSize}&page=${page}`)
	}
}

export default api;
