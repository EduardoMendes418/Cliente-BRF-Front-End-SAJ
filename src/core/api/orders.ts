
import { paymentsInstance } from '.'

const BASE_URL = 'Orders'

const api = {
	getOrders(folderNumber: string) {
		return paymentsInstance.get(`${BASE_URL}/Approveds?folderNumber=${folderNumber}`)
	}
}

export default api