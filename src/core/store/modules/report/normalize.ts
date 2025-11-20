import { TReportFilterField } from "src/core/models/report-configuration";
import { TPaymentReportParams, TReportComponent } from "src/core/models/reports";
import { getDateWithoutDays, rejectNoValues, valuesToNumber } from "src/core/utils/func";
import { REQUEST_PROVISION_OPTION } from "src/screen/reports/Form/constants";
import { treatFormValuesWithOccurrenceReason } from 'src/core/utils/occurence-reason-util'

const normalizePaymentFilters = (values: any) => {
	const params = valuesToNumber<TPaymentReportParams>(['valorPagamentoJudicialInitial', 'valorPagamentoJudicialFinal'], values);
	let { periodoApuracaoInitial, periodoApuracaoFinal, valorPagamentoJudicialInitial, valorPagamentoJudicialFinal, ...rest } = params;

	periodoApuracaoInitial = periodoApuracaoInitial ? getDateWithoutDays(periodoApuracaoInitial) : undefined;
	periodoApuracaoFinal = periodoApuracaoFinal ? getDateWithoutDays(periodoApuracaoFinal) : undefined;
	valorPagamentoJudicialInitial = Number(valorPagamentoJudicialInitial) === 0 ? undefined : valorPagamentoJudicialInitial;
	valorPagamentoJudicialFinal = Number(valorPagamentoJudicialFinal) === 0 ? undefined : valorPagamentoJudicialFinal;

	return {
		...rest,
		periodoApuracaoInitial,
		periodoApuracaoFinal,
		valorPagamentoJudicialInitial,
		valorPagamentoJudicialFinal
	}
}

const normalizePensionFilters = (values: any) => {
	const params = { ...values }
	let { dataPagamentoInitial, dataPagamentoFinal, ...rest } = params;

	dataPagamentoInitial = dataPagamentoInitial ? getDateWithoutDays(dataPagamentoInitial) : undefined;
	dataPagamentoFinal = dataPagamentoFinal ? getDateWithoutDays(dataPagamentoFinal) : undefined;

	return { ...rest, dataPagamentoInitial, dataPagamentoFinal }
}

export const normalizeFilters = (reportComponent: TReportComponent, values: any, customFields: TReportFilterField[]) => {
	let normalizedFilters = { ...values };

	if (reportComponent === TReportComponent.PAYMENTS)
		normalizedFilters = normalizePaymentFilters(values);
	else if (reportComponent === TReportComponent.PENSIONS)
		normalizedFilters = normalizePensionFilters(values);
	else if (reportComponent === TReportComponent.JUDICIAL_BLOCKS_AND_TRANSFERS)
		normalizedFilters = treatFormValuesWithOccurrenceReason(normalizedFilters);

	const { provisionOrderList, ...rest } = normalizedFilters;

	const isProvisionSyntetic = provisionOrderList === REQUEST_PROVISION_OPTION.SYNTHETIC;

	return rejectNoValues({
		...rest,
		listProvisionSyntetic: isProvisionSyntetic,
		listProvisionAnalytical: !isProvisionSyntetic,
		customFields: [...customFields.map(({ fieldName }) => fieldName)]
	})
}