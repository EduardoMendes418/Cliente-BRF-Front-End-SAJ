import { TReportComponent } from 'src/core/models/reports'
import { useReport } from 'src/screen/reports/hooks/useReport';
import { useLocation } from 'react-router-dom';

import GuaranteesFilter from '../../../components/GuaranteesFilter';
import FormCore from '../../commom/FormCore';
import { Clean } from "src/components/button";

const initialValues = {
	guaranteeModeId: [],
	requestTypeId: [],
	statusBem: [],
	paymentTypeId: [],
	bankId: [],
	insuranceCompanyIds: [],
	guaranteeDateInitial: null,
	guaranteeDateFinal: null,
	emissionDateInitial: null,
	emissionDateFinal: null,
	effectiveDateInitial: null,
	effectiveDateFinal: null,
	writeOffDateInitial: null,
	writeOffDateFinal: null,
	paymentDateInitial: null,
	paymentDateFinal: null,
	accountabilityDateInitial: null,
	accountabilityDateFinal: null,
	accountabilityWriteOffDateInitial: null,
	accountabilityWriteOffDateFinal: null,
	submissionDateInitial: null,
	submissionDateFinal: null,
	accountabilityBankId: [],
	pendingTime: '',
	status: [],
	accountabilityStatusFlowId: [],
	bearishReasons: [],
	valuationDateInitial: null,
	valuationDateFinal: null,
	note: [],
	rejectionReasonsId: [],
	returnReasonsId: [],
	startRequestDate: null,
	endRequestDate: null,
	statusFlowId: [],
	RequesterIds: [],
	releaseDateInitial: null,
	releaseDateFinal: null,
	guaranteeStatusApprovalId: null
};

const FormGuarantees = () => {
	const { pathname } = useLocation()

	const isGoodsAndGuarantees = pathname.includes("relatorios/bens-e-garantias")
	const {
		item,
		hasItem,
		isSaving,
		customFields,
		setCustomFields,
		initialFormValues,
		customFieldsDictionary,
	} = useReport({ initialValues, reportComponent: isGoodsAndGuarantees ? TReportComponent.GOODS_GUARANTEES : TReportComponent.ACCOUNTABILITYR })

	return (
		<FormCore
			item={item}
			hasItem={hasItem}
			reportComponent={isGoodsAndGuarantees ? TReportComponent.GOODS_GUARANTEES : TReportComponent.ACCOUNTABILITYR}
			initialValues={initialFormValues}
			setCustomFields={setCustomFields}
			customFields={customFields}
			customFieldsDictionary={customFieldsDictionary}
		>
			<GuaranteesFilter hasItem={hasItem} submitting={isSaving} customFields={customFields} isGoodsAndGuarantees={isGoodsAndGuarantees} />
			<Clean action="reportConfiguration" style={{ marginTop: "-35px" }} />

		</FormCore>
	);
};

export default FormGuarantees;
