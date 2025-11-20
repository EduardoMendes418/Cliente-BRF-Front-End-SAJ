import { paymentsInstance } from '.';
import { ParamsGet } from '../models';
import { TModulosId } from '../models/modules';

const BASE_URL = 'FinanceChartOfAccountsCategories';

const api = {
	list(params: ParamsGet & { moduleId: TModulosId }) {
		return paymentsInstance.get(BASE_URL, { params });
	},
};

export default api;
