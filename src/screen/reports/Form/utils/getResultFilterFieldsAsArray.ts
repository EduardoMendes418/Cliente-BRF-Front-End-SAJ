import { TReportFilterField } from 'src/core/models/report-configuration';
import { TFilterType } from 'src/core/models/reports'

export const getResultFilterFieldsAsArray = (reportFilterField: TReportFilterField[]): TReportFilterField[] => {
	return reportFilterField.filter(field => field.filterType === TFilterType.RESULT).map(field => {
		return {
			filterType: field.filterType,
			fieldName: field.fieldName,
			value: field.value
		}
	})
}