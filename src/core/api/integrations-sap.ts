import { paymentsInstance } from ".";
import {
	TContactParams,
} from "../models/contacts";

const BASE_URL = "IntegrationsSap";

const integrationsSapAPI = {
	list(params: TContactParams) {
		return paymentsInstance.get(`${BASE_URL}/GetDataSupplier`, { params });
	}

};

export default integrationsSapAPI;
