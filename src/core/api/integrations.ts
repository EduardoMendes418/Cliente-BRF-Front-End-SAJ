import { paymentsInstance } from ".";
import { TIntegrateCnpj, TIntegrateCpf, TIntegrationContribuitorData } from "../models/integrations";

const BASE_URL = "Integrations";

const api = {
	integrateCpf(form: TIntegrateCpf) {
		return paymentsInstance.post(`${BASE_URL}/cpf`, form)
	},

	integrateCnpj(form: TIntegrateCnpj) {
		return paymentsInstance.post(`${BASE_URL}/cnpj`, form)
	},

	integrateEmployeeData(form: TIntegrationContribuitorData) {
		return paymentsInstance.post(`${BASE_URL}/IntegrateEmployeeData`, form)
	}
}

export default api;