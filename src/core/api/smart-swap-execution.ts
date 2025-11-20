import { paymentsInstance } from '.'
import { SmartSwapChangesParameters } from '../models/smart-swap-execution';

const BASE_URL = 'SmartSwapChanges'

const api = {
	list(params: SmartSwapChangesParameters) {
		return paymentsInstance.get(BASE_URL, { params })
	},
	statusExecutionSmartSwap() {
		return paymentsInstance.get(`${BASE_URL}/Get-Status-Execution-SmartSwap`)
	},
	statusProcessSmartSwap() {
		return paymentsInstance.get(`${BASE_URL}/Get-Status-Execution-SmartSwap-Process`)
	},
}

export default api