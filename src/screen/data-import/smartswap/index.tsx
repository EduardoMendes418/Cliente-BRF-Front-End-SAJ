import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, FormikHelpers } from 'formik'

import ScreenTemplate from 'src/components/Screen';
import { alert } from 'src/components/modals';
import useProcessFilterOptions from 'src/hooks/useProcessFilterOptions';
import { TSmartSwapFilterForm } from 'src/core/models/smart-swap';
import { fetchSmartSwap } from 'src/core/store/modules/smart-swap/thunks';
import { getFiltersSmartSwap } from 'src/core/store/modules/smart-swap/selectors';
import { usePagination } from 'src/hooks/pagination';
import { actions } from 'src/core/store';
import { rejectNoValues, checkLimitSmartSwapRequisition } from 'src/core/utils/func';
import { t } from 'src/locale/i18n';

import Search from './Search';
import List from './List';
import EditPanel from './EditPanel';
import { ATIVO } from './constants';
import { FOLDER_OPTIONS } from 'src/core/models/data-import';
import {
	Button,
} from '@material-ui/core';
import { Grid } from '@mui/material';
import { MainDiv } from './styled';

const validate = ({ foldersNumber }: any) => {

	if (foldersNumber === "" || !!foldersNumber.match(/^\d{7}(\/\d{3})?$/))
		return {};
	return { foldersNumber: "Deve seguir esse padrão {9999999/999} ou {9999999}" };
}

const defaultValues: TSmartSwapFilterForm = {
	originAreaId: [],
	legalDepartmentAreaId: [],
	foldersNumber: "",
	distributionDateStart: null,
	distributionDateEnd: null,
	creationDateStart: null,
	creationDateEnd: null,
	closingDateStart: null,
	closingDateEnd: null,
	terminationDateStart: null,
	terminationDateEnd: null,
	registrationComplementDateStart: null,
	registrationComplementDateEnd: null,
	result: [],
	contingency: [],
	statusId: [ATIVO],
	type: [],
	stateId: null,
	cityId: '',
	JurisdictionsIds: [],
	LocationIds: [],
	AgentIds: [],
	InternalLawyerIds: [],
	LegalResponsibleIds: [],
	responsibleAreaId: [],
	ResponsibleOfficeIds: [],
	phasesId: [],
	actionClassId: [],
	provisionClassId: [],
	closureId: [],
	CostCenters: [],
	OriginCostCenterIds: [],
	sphere: [],
	businessAreaId: [],
	categorySpeciesId: [],
	valuedProcess: '',
	litigationRelationship: FOLDER_OPTIONS.MAIN,
	justiceIds: null,
}

const SmartSwap = () => {
	const dispatch = useDispatch();

	const options = useProcessFilterOptions();
	const { page, pageSize } = usePagination();

	const filters = useSelector(getFiltersSmartSwap);
	const initialValues = useMemo(() => ({ ...defaultValues, ...filters }), [filters])

	useEffect(() => () => {
		dispatch(actions.smartSwap.clear())
		dispatch(actions.smartSwap.clearFilters())
	}, [dispatch])

	useEffect(() => {
		const settedValues = rejectNoValues(filters);
		if (Object.keys(settedValues).length === 0) return;

		const res = checkLimitSmartSwapRequisition(settedValues);
		if (res.isLimited) {
			if (!(
				alert(
					res.msg,
					t('dataImport:smartswap.filter.modal.title'),
					'Favor remover alguns itens'
				)
			)) return;
		} else {
			dispatch(fetchSmartSwap({ ...settedValues, page, pageSize }));
		}
	}, [dispatch, filters, page, pageSize])

	const onSubmit = async (values: any, { setSubmitting }: FormikHelpers<TSmartSwapFilterForm>) => {
		dispatch(actions.smartSwap.setFilters({ ...values }));
		dispatch(actions.pagination.clear())
		setSubmitting(false);
	}

	return (
		<ScreenTemplate slotTopRithtPermission={"view"} slotTopRight={<Button
			onClick={() => window.open('/carga-de-dados/troca-inteligente/execucao', '_blank')}
			variant="contained"
			color="primary"
		>
			{'Execução da troca inteligente'}
		</Button>}>

			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validate={validate}
			>
				<Search options={options} />
			</Formik>
			<List options={options} />
			<EditPanel options={options} />
		</ScreenTemplate>
	);
};

export default SmartSwap;
