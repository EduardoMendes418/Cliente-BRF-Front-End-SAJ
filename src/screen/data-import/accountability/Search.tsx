import { useEffect, MutableRefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik'
import { Grid } from '@material-ui/core'
import { SelectField, DateField, NumericField, TOptionsSelect, TextField } from 'src/components/form'
import Panel from 'src/components/Panel'
import { useTranslation } from 'src/locale/i18n'
import { Clean, Submit } from 'src/components/button'
import { usePagination } from 'src/hooks/pagination';
import { useGroupedAreas } from "src/hooks/fetchLists";
import { fetchProcessSheet} from 'src/core/store/modules/data-import/thunk';
import { actions } from 'src/core/store';
import { getDataImportFilters } from 'src/core/store/modules/data-import/selectors';
import { optionsFolderStatus } from "src/screen/settings/constants";
import { getListGuaranteeModality } from 'src/core/store/modules/guarantee-modality/selectors';
import { accountabilityStatusOptions, situationStatusOptions } from 'src/screen/goods-and-guarantees/accountability/constants';
import { bearishReasonsOptionsList } from 'src/screen/goods-and-guarantees/constants';
import { fetchGuaranteeModality } from 'src/core/store/modules/guarantee-modality/thunks';
import * as yup from 'yup';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const initialValues: any = {
	folderNumbers: [],
	originAreaIds: [],
	legalDepartmentAreaIds: [],
	processStatus: [],
	statusGuarantees: [],
	modalitiesIds: [],
	statusFlowIds: [],
	status: [],
	bearishReasons: [],
	startGuaranteeDate: null,
	endGuaranteeDate: null,
	startAccountabilityDate: null,
	endAccountabilityDate: null,
	valuationDateStart: null,
	valuationDateEnd: null,
	ids: ""
	};

type TProcessSheetForm = {
	loading?: boolean;
	formRef?: MutableRefObject<any>;
	options: any;
	setRequest: any;
	clearListData: any;
	setPageCount: any;
}

const validationSchema = yup.object({
	ids: yup.string().matches(
		/^\d+(?:;?\d+)*$/, "A pesquisa deve seguir o padrão de ID's separados por ponto-e-vírgula").notRequired()});

const ProcessSheetForm = ({ loading, formRef, setRequest, clearListData, setPageCount }: TProcessSheetForm) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();
	const { location: { pathname } } = useHistory();
	

	const filters = useSelector(getDataImportFilters);
	const GuaranteeModality = useSelector(getListGuaranteeModality);
	
	const statusOptions = [
		{ label: 'Ativo', value: 1 },
		{ label: 'Morto', value: 4 }
	]

	const { groupedAreasAsOptions } = useGroupedAreas();

	const clearList = () => {
	dispatch(actions.dataImport.clear());
	clearListData([]);
	setPageCount(0);
	};

	const sortedBearishReasonsOptionsList = bearishReasonsOptionsList.sort((a, b) => {
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
    });

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
			validationSchema={validationSchema}
			enableReinitialize
		>
			{({ handleSubmit, isSubmitting, dirty}) => (
				<form noValidate onSubmit={handleSubmit} autoComplete="off">
					<Panel title={"Filtro da prestação de conta"} withPadding>
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
								<NumericField
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
								<SelectField
									label={t('dataImport:accountability.form.status')}
									name="statusGuarantees"
									options={statusOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:accountability.form.startGuaranteeDate')}
											name="startGuaranteeDate"
										/>
								</Grid>
								<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:accountability.form.endGuaranteeDate')}
											name="endGuaranteeDate"
										/>
								</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={"Data da prestação de contas (de)"}
											name="startAccountabilityDate"
										/>
								</Grid>
								<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:accountability.form.endGuaranteeDate')}
											name="endAccountabilityDate"
										/>
								</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:accountability.form.guaranteeModality')}
									name="modalitiesIds"
									options={GuaranteeModality.map(({description, id}) => ({label:description, value: id ?? 0}))}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:accountability.form.accountabilityStatus')}
									name="statusFlowIds"
									options={accountabilityStatusOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:accountability.form.situation')}
									name="status"
									options={situationStatusOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:accountability.form.dischargeReason')}
									name="bearishReasons"
									options={sortedBearishReasonsOptionsList}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:accountability.form.valuationDateStart')}
											name="valuationDateStart"
										/>
								</Grid>
								<Grid item xs={6} md={6}>
										<DateField
											label={t('dataImport:accountability.form.endGuaranteeDate')}
											name="valuationDateEnd"
										/>
								</Grid>
								</Grid>
							</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										name="ids"
										label={"ID da prestação de conta"}
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
