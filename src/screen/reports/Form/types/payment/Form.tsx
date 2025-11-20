import { TReportComponent } from 'src/core/models/reports'
import { useReport } from 'src/screen/reports/hooks/useReport';

import PaymentFilter from '../../../components/PaymentFilter';
import FormCore from '../../commom/FormCore';
import { Clean } from "src/components/button";

const initialValues = {
	dataSolicitacaoInitial: null,
	dataSolicitacaoFinal: null,
	dataVencimentoInitial: null,
	dataVencimentoFinal: null,
	receiptDateInitial: null,
	receiptDateFinal: null,
	sapEntryDateInitial: null,
	sapEntryDateFinal: null,
	periodoApuracaoInitial: null,
	periodoApuracaoFinal: null,
	tipoPagamentoId: [],
	formaPagamentoId: [],
	bankId: [],
	valorPagamentoJudicialInitial: '',
	valorPagamentoJudicialFinal: ''
};

const FormPayment = () => {
	const {
		item,
		hasItem,
		isSaving,
		customFields,
		setCustomFields,
		initialFormValues,
		customFieldsDictionary,
	} = useReport({ initialValues, reportComponent: TReportComponent.PAYMENTS })

	return (
		<FormCore
			item={item}
			hasItem={hasItem}
			reportComponent={TReportComponent.PAYMENTS}
			initialValues={initialFormValues}
			setCustomFields={setCustomFields}
			customFields={customFields}
			customFieldsDictionary={customFieldsDictionary}
		>
			<PaymentFilter hasItem={hasItem} submitting={isSaving} customFields={customFields} />
			<Clean action="reportConfiguration" style={{ marginTop: "-35px" }} />
		</FormCore>
	);
};

export default FormPayment;
