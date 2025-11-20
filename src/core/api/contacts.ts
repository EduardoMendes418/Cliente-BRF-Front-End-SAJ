import { integrationInstance, paymentsInstance } from ".";
import {
	TContactLikePartName,
	TContactParams,
	TContactWithLikeAndCpfWithoutIncludes,
	TContactWithLikeParams,
	TContactWithLikeWithoutIncludes,
} from "../models/contacts";

const BASE_URL = "Contacts";

const contactsAPI = {
	list(params: TContactParams) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	listLike(params: TContactWithLikeParams) {
		return paymentsInstance.get(`${BASE_URL}/get-with-like`, { params });
	},

	listLikeWithoutIncludes(params: TContactWithLikeWithoutIncludes) {
		return paymentsInstance.get(`${BASE_URL}/get-with-like-without-includes`, {
			params,
		});
	},
	listLikeAgent(params: TContactLikePartName) {
		return paymentsInstance.get(`${BASE_URL}/get-with-like-agent`, { params });
	},
	listLikeInternalLawyer(params: TContactLikePartName) {
		return paymentsInstance.get(`${BASE_URL}/get-with-like-internal-lawyer`, {
			params,
		});
	},
	listLikeOfficeResponsible(params: TContactLikePartName) {
		return paymentsInstance.get(
			`${BASE_URL}/get-with-like-office-responsible`,
			{ params }
		);
	},
	listLikeLegalResponsible(params: TContactLikePartName) {
		return paymentsInstance.get(`${BASE_URL}/get-with-like-legal-responsible`, {
			params,
		});
	},
	listLikeAndCpfWithoutIncludes(params: TContactWithLikeAndCpfWithoutIncludes) {
		return paymentsInstance.get(
			`${BASE_URL}/get-with-name-like-and-cpf-like-without-includes`,
			{ params }
		);
	},
	sendServiceBus(params: number){
		return integrationInstance.post(`${BASE_URL}/send-servicebus-by-ids`, params)
	}
};

export default contactsAPI;
