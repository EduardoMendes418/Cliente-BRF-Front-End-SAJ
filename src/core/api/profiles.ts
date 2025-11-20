import { paymentsInstance } from '.';
import { TProfiles, TProfilesFilters } from 'src/core/models/profiles';
import { ParamsGet } from '../models';

const BASE_URL = 'UsersProfiles'

const api = {
	list(params: ParamsGet & TProfilesFilters) {
		return paymentsInstance.get(BASE_URL, { params });
	},

	add(values: TProfiles) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	edit(values: TProfiles & { id: number }) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},

	report(filters: TProfilesFilters) {
		return paymentsInstance.get(`${BASE_URL}/report`, { params: filters, responseType: 'arraybuffer' })
	}
};

export default api;
