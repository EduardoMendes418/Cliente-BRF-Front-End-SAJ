import { paymentsInstance } from '.';
import { ParamsGet } from '../models';

const BASE_URL = 'LogInterest'

const api = {
	list({...params}: ParamsGet & {folderNumber?: string}) {
		return paymentsInstance.get(BASE_URL, { params });
	},
};

export default api;