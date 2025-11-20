import { TReportComponent } from "src/core/models/reports";
import CreditReceiptFilter from "src/screen/reports/components/CreditReceiptFilter";
import { useReport } from "src/screen/reports/hooks/useReport";
import FormCore from "../../commom/FormCore";
import { Clean } from "src/components/button";

const initialValues = {
	paymentTypes: [],
	evaluatorObservation: "",
	requestDateInitial: null,
	requestDateFinal: null,
	statuses: [],
	evaluatorBankId: null,
	evaluatorDateInitial: null,
	evaluatorDateFinal: null,
	evaluatorWriteOffDateInitial: null,
	evaluatorWriteOffDateFinal: null,
	evaluatorSendBankDateInitial: null,
	evaluatorSendBankDateFinal: null,
	sapRequestDateStart: null,
	sapRequestDateEnd: null,
	statusApprovalIds: []
}

const FormCreditReceipt = () => {
	const {
		item,
		hasItem,
		isSaving,
		customFields,
		setCustomFields,
		initialFormValues,
		customFieldsDictionary,
	} = useReport({ initialValues, reportComponent: TReportComponent.CREDIT_RECEIPT })
	if (initialFormValues) {
		initialFormValues.statuses = typeof initialFormValues.statuses === 'string' ? [Number(initialFormValues.statuses.split(','))] : initialFormValues.statuses  
	}
	return (
		<FormCore
			item={item}
			hasItem={hasItem}
			reportComponent={TReportComponent.CREDIT_RECEIPT}
			initialValues={initialFormValues}
			setCustomFields={setCustomFields}
			customFields={customFields}
			customFieldsDictionary={customFieldsDictionary}
		>
			<CreditReceiptFilter hasItem={hasItem} submitting={isSaving} customFields={customFields} />
			<Clean action="reportConfiguration" style={{ marginTop: "-35px" }} />
		</FormCore>
	);
};

export default FormCreditReceipt;