import { paymentsInstance } from '.'
import { TCreateInterestUpdatesForApprovalParams, TGetExecutedInterestUpdatesParams, TReportInterestUpdatesAccountingParams, TRunInterestDepositParams } from '../models/closures'
import { TInterestUpdate, TAddInterestUpdate, TInterestUpdateFilter } from '../models/interest-update'

const BASE_URL = 'InterestUpdate'

const api = {
	add(interestUpdate: TAddInterestUpdate) {
		return paymentsInstance.post(BASE_URL, interestUpdate)
	},
	get({page, pageSize, notPaginate, ...params}: TInterestUpdateFilter) {
		return paymentsInstance.post(`${BASE_URL}/get-with-filters-on-body`, {...params }, { params: {page, pageSize, notPaginate}})
	},
	edit(licenseType: TInterestUpdate) {
		return paymentsInstance.put(BASE_URL, licenseType)
	},
	getSap (requestId: number) {
		return paymentsInstance.get(`${BASE_URL}/get-sap-responses`, { params: {requestId, messageType: "S"} })
	},
	runInterestDeposit ({date, areaDejur, closureId}: TRunInterestDepositParams) {
		return paymentsInstance.get(`${BASE_URL}/run-interest-deposit`, {params: {date, areaDejur, closureId}})
	},
	getReportInterestUpdatesAccounting({ referenceMonth, referenceYear, judicialAreaIds, accoutingTypes, id, closureId }: TReportInterestUpdatesAccountingParams) {
		return paymentsInstance.get(`${BASE_URL}/get-Report-Interest-Updates-Accounting?`, { responseType: 'arraybuffer', params: { referenceMonth, referenceYear, judicialAreaIds, accoutingTypes, id, closureId } })
	},

	createInterestUpdateForApproval(values: TCreateInterestUpdatesForApprovalParams){
		return paymentsInstance.post(`${BASE_URL}/create-interest-updates-for-approval`, JSON.stringify(values))
	},
	getExecutedInterestUpdates({juridicalAreaIds, competenceDate, accountingTypeId, statusApprovals, closureId}: TGetExecutedInterestUpdatesParams){
		return paymentsInstance.get(`${BASE_URL}/get-executed-interest-updates`, {params: {juridicalAreaIds, competenceDate, accountingTypeId, statusApprovals, closureId}})
	},
	getExecutedInterestUpdatesWhenpageLoad(){
		return paymentsInstance.get(`${BASE_URL}/get-executed-interest-updates`)
	},
	delete (id: any) {
		return paymentsInstance.delete(`${BASE_URL}/${id}`);
	}
}

export default api

