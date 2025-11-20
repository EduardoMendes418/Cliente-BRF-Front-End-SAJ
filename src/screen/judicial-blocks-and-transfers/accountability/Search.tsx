import { useEffect, MutableRefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik'
import { Grid } from '@material-ui/core'
import { SelectField, DateField, TextField } from 'src/components/form'
import Panel from 'src/components/Panel'
import { useTranslation } from 'src/locale/i18n'
import { Clean, Submit } from 'src/components/button'
import { usePagination } from 'src/hooks/pagination';
import { useGroupedAreas } from "src/hooks/fetchLists";
import { fetchProcessSheet} from 'src/core/store/modules/data-import/thunk';
import { actions } from 'src/core/store';
import { getDataImportFilters } from 'src/core/store/modules/data-import/selectors';
import { optionsFolderStatus } from "src/screen/settings/constants";
import { fetchGuaranteeModality } from 'src/core/store/modules/guarantee-modality/thunks';
import { usePaymentType } from "src/hooks/fetchLists";
import { Modulos } from "src/core/models/modules";
import {accountabilityStatusOptions} from "../../../core/utils/constants";
import * as yup from 'yup';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';


const initialValues: any = {
	folderNumbers: '',
	originAreaIds: [],
	legalDepartmentAreaIds: [],
	processStatus: [],
	occurrenceTypes: [],
	occurrenceReasons: [],
	statusFlowIds: [],
	startBlockOrTransfDate: null,
	endBlockOrTransfDate: null,
	startCreatedDate: null,
	endCreatedDate: null,
	ids: ""
};

const validate = ({ folderNumbers }: any) => {
	if (folderNumbers === "" || !!folderNumbers.match(/(^\d)+(;?\d)+$/)) return {}
	return { folderNumbers: "Deve seguir esse padrão {999;999}" }
}

const validationSchema = yup.object({
	ids: yup.string().matches(
		/^\d+(?:;?\d+)*$/, "A pesquisa deve seguir o padrão de ID's separados por ponto-e-vírgula").notRequired()});

type TProcessSheetForm = {
	loading?: boolean;
	formRef?: MutableRefObject<any>;
	options: any;
	setRequest: any;
	clearListData: any;
	setPageCount: any;
}

const ProcessSheetForm = ({ loading, formRef, setRequest, clearListData, setPageCount }: TProcessSheetForm) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();
	const { location: { pathname } } = useHistory();
	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento);
	const filters = useSelector(getDataImportFilters);
	
	const occurrenceTypesAsOptions = [
		{label: "Bloqueio Judicial", value: 1 },
		{label: "Transferência Judicial", value: 2 },
	];

	const blockAndTransfersAsOptions = [
		{label: "Devolvido", value: 4},
		{label: "Desbloqueado", value: 7},
		{label: "Finalizado", value: 5},
		{label: "Cancelado", value: 1},
		{label: "Em validação" , value: 2},
		{label: "Em desbloqueio", value: 6},
		{label: "Pendente", value: 0},
	];

	const { groupedAreasAsOptions } = useGroupedAreas();

	const clearList = () => {
	  dispatch(actions.dataImport.clear());
	  clearListData([]);
	  setPageCount(0);
	};

	useEffect(() => {
		if (Object.keys((filters as any)[pathname] || {}).length > 0)
			dispatch(fetchProcessSheet({ ...(filters as any)[pathname], pageSize, page }));
	}, [dispatch, filters, page, pageSize, pathname]);

	useEffect(() => {
		dispatch(fetchGuaranteeModality({ pageSize: 100, notPaginate: true }));
	
	}, [])

	return (
		<Formik
			innerRef={formRef}
			initialValues={initialValues}
			onSubmit={setRequest}
			validate={validate}
			validationSchema={validationSchema}
			enableReinitialize
		>
			{({ handleSubmit, isSubmitting, dirty}) => (
				<form noValidate onSubmit={handleSubmit} autoComplete="off">
					<Panel title={"Filtro de bloqueios e transferências"} withPadding>
						<Grid container spacing={3}>
						<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									multiple
									label={t('dataImport:accountability.form.originArea')}
									name="originAreaIds"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									multiple
									label={t('dataImport:accountability.form.dejurArea')}
									name="legalDepartmentAreaIds"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<TextField
									label={t('dataImport:accountability.form.ctgFolder')}
									name="folderNumbers"
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:accountability.form.ctgFolderStatus')}
									name="processStatus"
									options={optionsFolderStatus}
									multiple
								/>
							</Grid>

							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:accountability.form.blockOrTransfDate')}
											name="startBlockOrTransfDate"
										/>
								</Grid>
								<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:accountability.form.endGuaranteeDate')}
											name="endBlockOrTransfDate"
										/>
								</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:accountability.form.occurrenceTypeDescription')}
									name="occurrenceTypes"
									options={occurrenceTypesAsOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:accountability.form.occurrenceReasonDescription')}
									name="occurrenceReasons"
									options={paymentTypeAsOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:accountability.form.statusFlowDescription')}
									name="statusFlowIds"
									options={blockAndTransfersAsOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:accountability.form.startCreatedDate')}
											name="startCreatedDate"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:accountability.form.endGuaranteeDate')}
											name="endCreatedDate"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t("judicialBlocksAndTransfers:form.statusApprovalId")}
									name="statusApprovalId"
									options={accountabilityStatusOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
									<TextField
										name="ids"
										label={"ID de bloqueios e transferências"}
										helperText={t("dataImport:goodsAndGuarantees.search.idHelperText")}
									/>
								</Grid>
							<Grid container spacing={2} alignItems='center'>
								<Grid item md={6} xs={6}>
									<Clean onClick={clearList} action='dataImport' page={pathname} />
								</Grid>
								<Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
									<Submit
										type="search"
										disabled={!dirty || loading}
										submitting={loading || isSubmitting}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Panel>
				</form >
			)}
		</Formik>
	)
};

export default ProcessSheetForm;
