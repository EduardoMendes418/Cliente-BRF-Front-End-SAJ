import { paymentsInstance } from '.';
import { TSearchEvent } from '../models/e-social-tables';
import { ESocial, ESocialS2500, ESocialS2501, ESocialS3500, ExtractEsocialFile } from 'src/core/models/eSocial';
import { upload } from './utils';

const BASE_URL = 'ESocialEventLaunch';

function getType(type: ESocial | "") {
	switch (type) {
		case ESocial.S2500:
			return 'S2500';
		case ESocial.S2501:
			return 'S2501';
		case ESocial.S3500:
			return 'S3500';
		case ESocial.S5501:
			return 'S5501';
		default:
			return 'S2500';
	}

}

const eSocialEventAPI = {
	list({
		page,
		pageSize,
		...values
	}: TSearchEvent) {
		return paymentsInstance.post(`${BASE_URL}/grid-list`, { ...values }, { params: {
			page,
			pageSize,
		}});
	},

	readEsocialFile(files: FileList) {
		return upload(
			paymentsInstance,
			`${BASE_URL}/read-esocial-file`,
			files,
			"file"
		);
	},

	listById(params: any) {
		return paymentsInstance.get(`${BASE_URL}/get-by-id-with-includes`, { params });
	},
	listByIdGovernmentResponses(params: any) {
		return paymentsInstance.get(`${BASE_URL}/get-by-id-with-includes`, { params });
	},

	getGovernmentResponses(params: any) {
		return paymentsInstance.get(`${BASE_URL}/get-government-responses`, { params });
	},

	add(values: ESocialS2500 | ESocialS2501 | ESocialS3500) {
		return paymentsInstance.post(`${BASE_URL}/create-${getType(values.eventCode)}`, JSON.stringify(values));
	},

	edit(values: ESocialS2500 | ESocialS2501 | ESocialS3500) {
		return paymentsInstance.put(`${BASE_URL}/update-${getType(values.eventCode)}`, JSON.stringify(values));
	},

	sendToSAP({ id, sajDelete = false }: { id: string, sajDelete?: boolean }) {
		return paymentsInstance.get(`${BASE_URL}/send-event-launch-to-sap`, { params: { id, sajDelete } });
	},

	autocompleteData({ processId, paymentId }: { processId: number, paymentId: number }) {
		return paymentsInstance.get(`${BASE_URL}/get-autocomplete-data?processId=${processId}&paymentId=${paymentId}`);
	},

	extractESocialFile(values: ExtractEsocialFile) {
		return paymentsInstance.post(`${BASE_URL}/extract-esocial-file`, JSON.stringify(values))
	},

	cancel(id: number, rejectionAndReturnReasonsId: number) {
		return paymentsInstance.put(`${BASE_URL}/cancel?id=${id}&rejectionAndReturnReasonsId=${rejectionAndReturnReasonsId}`);
	}

}

export default eSocialEventAPI;