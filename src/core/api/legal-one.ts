import { paymentsInstance } from "."
import { TCompany, TCompanyFilter, TIndividual, TIndividualFilter } from "../models/legal-one"

const BASE_URL_INDIVIDUALS = "Individuals"
const BASE_URL_COMPANIES = "Companies"

const api = {
	findIndividuals(values: TIndividualFilter) {
		return paymentsInstance.get(`${BASE_URL_INDIVIDUALS}`, {
			params: values
		})
	},
	createOrUpdateIndividuals(values: TIndividual) {
		return paymentsInstance.post(`${BASE_URL_INDIVIDUALS}`, values)
	},
	findCompanies(values: TCompanyFilter) {
		return paymentsInstance.get(`${BASE_URL_COMPANIES}`, {
			params: values
		})
	},
	createOrUpdateCompanies(values: TCompany) {
		return paymentsInstance.post(`${BASE_URL_COMPANIES}`, values)
	}
}

export default api