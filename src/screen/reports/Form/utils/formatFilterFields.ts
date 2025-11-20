import { TReportFilterField } from 'src/core/models/report-configuration';
import { TFilterType } from 'src/core/models/reports'

const fieldWithInvalidValue = [
	'empresa',
	'oppositePart',
	'opposingLawyer',
	'city',
	'internalLawyer',
	'agent',
	'mainResponsible',
	'officeResponsible',
	'originCostCenter',
	'costCenter',
	'favorecido'
]

export const formatFilterFields = (values: any, resultFields: TReportFilterField[]) => {
	const searchFields = Object.keys(values).map(key => {
		const value = values[key] === null || (fieldWithInvalidValue.includes(key) && values[key] === -1)
			? ""
			: String(values[key]);

		return {
			fieldName: key,
			value,
			filterType: TFilterType.SEARCH
		}
	})

	return searchFields.concat(resultFields)
}