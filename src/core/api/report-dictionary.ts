import { paymentsInstance } from '.';
import { TReportDictionaryFilter } from 'src/core/models/report-dictionary';

const BASE_URL = 'ReportDictionary'

const reportDictionaryAPI = {
	list({ reportComponent }: TReportDictionaryFilter) {
		return paymentsInstance.get(BASE_URL, {
			params: { reportComponent },
		});
	},
	getReportConfiguration(values: TReportDictionaryFilter) {
		return paymentsInstance.get(`Report/GetReportConfiguration`, {
			params: {
				id: values.reportComponent
			}
		})
	},
};

export default reportDictionaryAPI;
