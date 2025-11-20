import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import Form from 'src/components/form';
import { TReportComponent } from 'src/core/models/reports'
import { TReportDictionary } from 'src/core/models/report-dictionary';
import { TReportConfiguration, TReportFilterField } from 'src/core/models/report-configuration';
import { useRegisterDefault } from 'src/hooks'
import {
	getStatusReportConfiguration,
	getErrorReportConfiguration,
} from 'src/core/store/modules/report-configuration/selectors';
import { fillIfValue } from 'src/core/utils/func';

import { getSearchFilterFieldsAsObject } from '../utils';
import { REQUEST_PROVISION_OPTION } from '../constants';
import MainFilter from '../../components/MainFilter'
import { useSaveReportConfiguration } from '../../hooks/useSaveReportConfiguration';
import { EnvolvedTypeEnum } from 'src/core/models/contacts';

type Props = {
	hasItem: boolean;
	item?: TReportConfiguration;
	validationSchema?: any;
	children: ReactNode;
	initialValues: any;
	reportComponent: TReportComponent;
	customFieldsDictionary: TReportDictionary[];
	setCustomFields?: any;
	customFields?: TReportFilterField[];
};

const FormCore = ({
	customFieldsDictionary,
	validationSchema,
	setCustomFields,
	reportComponent,
	initialValues,
	customFields,
	children,
	hasItem,
	item,
}: Props) => {

	const statusSubmit = useSelector(getStatusReportConfiguration);
	const { onSaveConfigurationModal } = useSaveReportConfiguration({ reportComponent });

	useRegisterDefault({
		action: 'reportConfiguration',
		getStatus: getStatusReportConfiguration,
		getErrorMessage: getErrorReportConfiguration,
		route: 'noRedirect'
	})

	let initialValuesMainFilter = {
		folderNumberOption: '',
		originAreaId: [],
		legalDepartmentAreaId: [],
		empresa: [],
		empresaInvolved: EnvolvedTypeEnum.Main,
		oppositePart: [],
		oppositePartInvolved: EnvolvedTypeEnum.Main,
		identifierNumber: '',
		oldNumber: '',
		otherNumber: '',
		opposingLawyer: [],
		folderNumber: '',
		contingency: [],
		sphere: [],
		statusId: [],
		result: [],
		distributionDateInitial: null,
		distributionDateFinal: null,
		creationDateInitial: null,
		creationDateFinal: null,
		dataComplementoCadastroInitial: null,
		dataComplementoCadastroFinal: null,
		terminationDateInitial: null,
		terminationDateFinal: null,
		closingDateInitial: null,
		closingDateFinal: null,
		comarca: '',
		city: '',
		internalLawyer: [],
		agent: [],
		mainResponsible: [],
		responsibleAreaId: [],
		officeResponsible: [],
		actionType: [],
		provisionClass: [],
		originCostCenter: '',
		costCenter: '',
		closure: '',
		businessArea: '',
		categoria: [],
		listObjects: false,
		listInvolved: false,
		provisionOrderList: REQUEST_PROVISION_OPTION.SYNTHETIC,
		devolution: [],
		disapproval: [],
		rejectionAndReturnReasons: [],
		statusApprovalId: [],
		statusFlowId: []
	}

	if (hasItem && item) {
		const initialReportFilterFields = getSearchFilterFieldsAsObject(item.reportFilterFields)
		initialValuesMainFilter = { ...fillIfValue<any>(initialReportFilterFields, initialValuesMainFilter) }
	}

	return (
		<Form
			enableReinitialize
			onSubmit={(values, formikHelpers) => onSaveConfigurationModal(values, formikHelpers, customFields ?? [])}
			initialValues={{ ...initialValuesMainFilter, ...initialValues }}
			validationSchema={validationSchema}
			permission={true}
		>
			{({ handleSubmit, setSubmitting, isSubmitting }) => (
				<form onSubmit={handleSubmit} noValidate>
					<MainFilter customFieldsDictionary={customFieldsDictionary} setCustomFields={setCustomFields} customFields={customFields ?? []} />
					{children}
					{['failure', 'added', 'edited'].includes(statusSubmit) && isSubmitting && setSubmitting(false)}
				</form>
			)}
		</Form>
	);
};

export default FormCore;
