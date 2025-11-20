import {
	TGoodsGuaranteesRequest,
	TGoodsGuaranteesRequestParams,
	TGuaranteesNotificationFilter
} from '../models/goods-guarantee';
import { upload } from './utils';
import { paymentsInstance } from '.';
import { TUpdateStatus } from '../models';
import { rejectNoValues } from '../utils/func';

const BASE_URL = '/GoodsGuaranteesRequest';

const goodsGuaranteesRequestApi = {
	list(params: TGoodsGuaranteesRequestParams) {
		return paymentsInstance.get(BASE_URL, { params });
	},
	listNewGuarantee(params: TGoodsGuaranteesRequestParams){
		return paymentsInstance.get(BASE_URL, { params });

	},

	listSimplify(params: TGoodsGuaranteesRequestParams) {
		return paymentsInstance.get(`${BASE_URL}/new-request`, { params });
	},

	getById(id: number) {
		return paymentsInstance.get(BASE_URL, { params: { id } });
	},

	add(value: TGoodsGuaranteesRequest, flowEmails: string) {
		return paymentsInstance.post(BASE_URL, {...value, flowEmails: flowEmails.split(';')});
	},

	edit(value: TGoodsGuaranteesRequest, flowEmails: string) {
		return paymentsInstance.put(BASE_URL, {...value, flowEmails: flowEmails.split(';')});
	},

	uploadFiles(goodsAndGuaranteesId: number, filesList: FileList, main = true) {
		const url = `${BASE_URL}/uploadFiles?goodsGuaranteesRequestId=${goodsAndGuaranteesId}&isMainFile=${main}`;
		return upload(paymentsInstance, url, filesList);
	},

	deleteFile(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?fileId=${id}`);
	},

	updateStatusFlow({ attachments, ...rest }: TUpdateStatus, flowEmails: string | undefined ) {
		const params = rejectNoValues(rest) as any;
		const finalParams = {
			...params, 
			flowEmails: flowEmails?.split(';'),
		};

		if (flowEmails === "") delete finalParams.flowEmails;
		if (finalParams.observation === "") delete finalParams.observation;
		return paymentsInstance.patch(`${BASE_URL}/set-status`, undefined, { params: finalParams });
	},

	sendEmail(goodsAndGuaranteesId: number) {
		return paymentsInstance.post(`${BASE_URL}/sendEmail?id=${goodsAndGuaranteesId}`);
	},

	getNotifications(params: TGuaranteesNotificationFilter) {
		return paymentsInstance.get(`${BASE_URL}/get-goods-guarantees-request-signaling-dashBoard`, { params })
	},

	setAwareNotification(id: number, isUserAwared: boolean) {
		return paymentsInstance.patch(
			`${BASE_URL}/set-is-user-awared-goods-guarantees-request-signaling-dashboard`, undefined, {
				params: { id, isUserAwared }
		})
	},

	setPostponedNotification(id: number, isUserPostponed: boolean) {
		return paymentsInstance.patch(
			`${BASE_URL}/set-is-user-postponed-goods-guarantees-request-signaling-dashboard`, undefined, {
				params: { id, isUserPostponed }
		})
	},

	setAnsweredNotification(id: number, isUserAnswered: boolean) {
		return paymentsInstance.patch(
			`${BASE_URL}/set-is-user-answered-goods-guarantees-request-signaling-dashboard`, undefined, {
				params: { id, isUserAnswered }
		})
	},

	getCompanies() {
		return paymentsInstance.get(`${BASE_URL}/insurers`)
	}
};

export default goodsGuaranteesRequestApi;