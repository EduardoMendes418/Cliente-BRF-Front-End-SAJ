import { paymentsInstance } from '.';
import { TReportConfiguration, TReportConfigurationFilter } from 'src/core/models/report-configuration';
import { ParamsGet } from '../models';

const BASE_URL = 'ReportConfiguration'

const reportConfigurationAPI = {
	list(params: ParamsGet & TReportConfigurationFilter) {
		return paymentsInstance.get(BASE_URL, {	params });
	},

	add(values: TReportConfiguration) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},

	edit(values: TReportConfiguration) {
		return paymentsInstance.put(BASE_URL, JSON.stringify(values));
	},
	delete(values: TReportConfiguration) {
		return paymentsInstance.put(`${BASE_URL}`, values);
	}

};

export default reportConfigurationAPI;
