import { TReportFilterField } from 'src/core/models/report-configuration';
import { TFilterType } from 'src/core/models/reports'
import { toArray } from 'src/core/utils/func';

const MULTIPLE_AND_NUMBER_VALUES = [
	'statusId',
	'result',
	'categoria',
	'tipoPagamentoId',
	'formaPagamentoId',
	'bankId',
	'pensionCategoryId',
	'statusPensionId',
	'occurrenceType',
	'judicialBlockStatus',
	'judicialTransferStatus',
	'originAreaId',
	'legalDepartmentAreaId',
	'provisionClass',
	'actionType',
	'guaranteeModeId',
	'requestTypeId',
	'statusBem',
	'paymentTypeId',
	'accountabilityBankId',
	'accountabilityStatusFlowId',
	'bearishReasons',
	'note',
	'returnReasonsId',
	'rejectionReasonsId',
	"empresa",
	"oppositePart",
	"statusFlowId",
	"statusApprovalId",
	"internalLawyer",
	"agent",
	"mainResponsible",
	"responsibleAreaId",
	"officeResponsible"
]

const MULTIPLE_VALUES = ['contingency', 'sphere', 'status', 'occurrenceReason', ...MULTIPLE_AND_NUMBER_VALUES];
const NUMBER_VALUES = ['provisionOrderList', ...MULTIPLE_AND_NUMBER_VALUES];
const BOOLEAN_VALUES = ['listObjects', 'listInvolved'];

const normalizeValue = (name: string, value: string) => {
	let fieldValue: any = value;
	if (MULTIPLE_VALUES.includes(name))
		fieldValue = toArray(fieldValue);

	if (NUMBER_VALUES.includes(name))
		fieldValue = Array.isArray(fieldValue) ? fieldValue.map(value => Number(value)) : Number(fieldValue);

	if (BOOLEAN_VALUES.includes(name))
		fieldValue = fieldValue === 'true';

	return fieldValue;
}

export const getSearchFilterFieldsAsObject = (reportFilterField: TReportFilterField[]) => {
	return reportFilterField
		.filter(field => field.filterType === TFilterType.SEARCH)
		.reduce((acc, field) => ({ ...acc, [field.fieldName]: normalizeValue(field.fieldName, field.value) }), {})
}