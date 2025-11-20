import { TReportComponent } from "src/core/models/reports"
import { useReport } from 'src/screen/reports/hooks/useReport'

import NoticeInspectionPaymentFilter from 'src/screen/reports/components/NoticeInspectionPaymentFilter'
import FormCore from 'src/screen/reports/Form/commom/FormCore'
import { Clean } from "src/components/button";

const initialValues = {
	tipoPagamentoId: [],
	formaPagamentoId: [],
	receiptStatus: [],
	receiptDateInitial: null,
	receiptDateFinal: null,
	valorPagamentoJudicialInitial: '',
	valorPagamentoJudicialFinal: '',
	bankId: [],
	closingDateInitial: null,
	closingDateFina: null,
	internalLawyer: [],
	favorecidoId: [],
	dataPagamentoInitial: null,
	dataPagamentoFinal: null
};

const FormNoticeInspectionPayment = () => {
	const {
		item,
		hasItem,
		isSaving,
		customFields,
		setCustomFields,
		initialFormValues,
		customFieldsDictionary
	} = useReport({ initialValues, reportComponent: TReportComponent.NOTICE_INSPECTION_PAYMENT })

	return (
		<FormCore
			item={item}
			hasItem={hasItem}
			reportComponent={TReportComponent.NOTICE_INSPECTION_PAYMENT}
			initialValues={initialFormValues}
			setCustomFields={setCustomFields}
			customFieldsDictionary={customFieldsDictionary}
		>
			<NoticeInspectionPaymentFilter
				hasItem={hasItem}
				submitting={isSaving}
				customFields={customFields}
			/>
			<Clean action="reportConfiguration" style={{ marginTop: "-35px" }} />
		</FormCore>
	)
}

export default FormNoticeInspectionPayment