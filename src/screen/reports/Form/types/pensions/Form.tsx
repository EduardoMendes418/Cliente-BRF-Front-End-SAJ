import { TReportComponent } from 'src/core/models/reports'
import { useReport } from 'src/screen/reports/hooks/useReport';

import PensionFilter from '../../../components/PensionFilter';
import FormCore from '../../commom/FormCore';
import { Clean } from "src/components/button";

const initialValues = {
	dataSolicitacaoInitial: null,
	dataSolicitacaoFinal: null,
	dataPagamentoInitial: null,
	dataPagamentoFinal: null,
	dataBaseCorrecaoInitial: null,
	dataBaseCorrecaoFinal: null,
	tipoPagamentoId: [],
	formaPagamentoId: [],
	favorecido: '',
	bankId: [],
	pensionCategoryId: [],
	statusPensionId: [],
	sapEntryDateInitial: null,
	sapEntryDateFinal: null,
	receiptDateInitial: null,
	receiptDateFinal: null,
};

const FormPensions = () => {
	const {
		item,
		hasItem,
		isSaving,
		customFields,
		setCustomFields,
		initialFormValues,
		customFieldsDictionary,
	} = useReport({ initialValues, reportComponent: TReportComponent.PENSIONS })

	return (
		<FormCore
			item={item}
			hasItem={hasItem}
			reportComponent={TReportComponent.PENSIONS}
			initialValues={initialFormValues}
			setCustomFields={setCustomFields}
			customFields={customFields}
			customFieldsDictionary={customFieldsDictionary}
		>
			<PensionFilter hasItem={hasItem} submitting={isSaving} customFields={customFields} />
			<Clean action="reportConfiguration" style={{ marginTop: "-35px" }} />
		</FormCore>
	);
};

export default FormPensions;
