import { TReportComponent } from 'src/core/models/reports'
import { useReport } from 'src/screen/reports/hooks/useReport';

import JudicialBlocksAndTransfersFilter from '../../../components/JudicialBlocksAndTransfersFilter';
import FormCore from '../../commom/FormCore';
import { Clean } from "src/components/button";

const initialValues = {
	bankId: [],
	blockOrTransfDateInitial: null,
	blockOrTransfDateFinal: null,
	completionDateInitial: null,
	completionDateFinal: null,
	requestDateInitial: null,
	requestDateFinal: null,
	occurrenceType: [],
	occurrenceReason: [],
	judicialBlockStatus: [],
	judicialTransferStatus: [],
	companies: [], 
	statusApprovalId: "",
	contabilizationDateStart: null,
	contabilizationDateEnd: null
};

const FormJudicialBlocksAndTransfers = () => {
	const {
		item,
		hasItem,
		isSaving,
		customFields,
		setCustomFields,
		initialFormValues,
		customFieldsDictionary,
	} = useReport({ initialValues, reportComponent: TReportComponent.JUDICIAL_BLOCKS_AND_TRANSFERS })

	return (
		<FormCore
			item={item}
			hasItem={hasItem}
			reportComponent={TReportComponent.JUDICIAL_BLOCKS_AND_TRANSFERS}
			initialValues={initialFormValues}
			setCustomFields={setCustomFields}
			customFields={customFields}
			customFieldsDictionary={customFieldsDictionary}
		>
			<JudicialBlocksAndTransfersFilter hasItem={hasItem} submitting={isSaving} customFields={customFields} />
			<Clean action="reportConfiguration" style={{ marginTop: "-35px" }} />
		</FormCore>
	);
};

export default FormJudicialBlocksAndTransfers;
