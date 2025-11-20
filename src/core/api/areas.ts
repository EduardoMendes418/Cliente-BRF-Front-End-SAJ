import { paymentsInstance } from '.';

const BASE_URL = 'Areas';

const api = {
	getAreas(params: { parentAreaId: number }) {
		return paymentsInstance.get(BASE_URL,  { params } );
	},
	getAreasByUserId(id: number) {
		return paymentsInstance.get(`${BASE_URL}/get-areas-by-user-id`, { params: { id } });
	},
	getParentAreas() {
		return paymentsInstance.get(`${BASE_URL}/get-parent-area`);
	},
	getParentAreasGrouped(checkProfile: boolean = true) {
		return paymentsInstance.get(`${BASE_URL}/get-parent-area-group?checkProfile=${checkProfile}`)
	},
	getParentAreasGroupedById(parentAreaId: number[]) {
		return paymentsInstance.get(`${BASE_URL}/get-by-parent-id-group`, { params: { parentAreaId } })
	}
};

export default api;
