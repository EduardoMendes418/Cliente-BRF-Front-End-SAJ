import { paymentsInstance } from '.';
import {
	TAgreementAuthorization,
	TAgreementAuthorizationSearch,
} from 'src/core/models/agreement-authorization';
import { upload } from './utils';

const BASE_URL = 'AgreementAuthorization'

const agreementAuthorizationAPI = {
	list(params: TAgreementAuthorizationSearch) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	uploadFiles(agreementAuthorizationId: number, filesList: FileList) {
		const url = `${BASE_URL}/uploadFiles?agreementAuthorizationId=${agreementAuthorizationId}`;
		return upload(paymentsInstance, url, filesList);
	},

	add(value: TAgreementAuthorization) {
		return paymentsInstance.post(
			BASE_URL,
			JSON.stringify(value)
		);
	},

};

export default agreementAuthorizationAPI;
