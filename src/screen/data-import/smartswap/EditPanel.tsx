import { useCallback, useMemo } from 'react';
import { Box, Button, Grid, CircularProgress } from '@material-ui/core'
import { Formik, FormikHelpers } from 'formik'
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import FileSaver from 'file-saver';

import Panel from 'src/components/Panel'
import { SelectField, DateField, RadioGroup, CostCenterField } from 'src/components/form'
import ContactField from 'src/components/ContactField';
import { Clean } from 'src/components/button';
import { useTranslation } from 'src/locale/i18n'
import { updateSmartSwap, exportSmartSwap } from 'src/core/store/modules/smart-swap/thunks';
import { getSmartSwapId, getLoadingUpdatingSmartSwap, getEditPanelFormSmartSwap } from 'src/core/store/modules/smart-swap/selectors';
import { confirm } from 'src/components/modals';
import { rejectNoValues } from 'src/core/utils/func';
import { CONTACT_SEARCH, CONTACT_TYPE } from "src/core/utils/constants";
import { processPhasesOptions } from 'src/core/utils/constants';
import useProcessFilterOptions from 'src/hooks/useProcessFilterOptions';
import { TSmartSwapChangingParams, TSmartSwapChangingParamsForm } from 'src/core/models/smart-swap';
import { AppDispatch } from 'src/core/store';
import { actions } from 'src/core/store';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const defaultValues: TSmartSwapChangingParamsForm = {
	agentId: '',
	InternalLawyerId: '',
	legalResponsibleId: '',
	responsibleAreaId: '',
	responsibleOfficeId: '',
	statusId: '',
	terminationDate: null,
	closingDate: null,
	result: '',
	phasesId: '',
	actionClassId: '',
	provisionClass: '',
	businessArea: '',
	categorySpecies: '',
	closure: '',
	valuedProcess: '',
	groupingCostCenterId: '',
	costCenter: ''
}

type TEditPanelProps = {
	options: ReturnType<typeof useProcessFilterOptions>
}

const EditPanel = ({ options }: TEditPanelProps) => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();

	const smartSwapId = useSelector(getSmartSwapId);
	const previewFormValues = useSelector(getEditPanelFormSmartSwap);
	const loading = useSelector(getLoadingUpdatingSmartSwap);

	const initialValues = useMemo(() => ({ ...defaultValues, ...previewFormValues }), [previewFormValues])
	const { groupedAreasAsOptions } = useGroupedAreas();

	const {
		actionClassesOptions,
		groupedAreasByIdAsOptions,
		businessAreasOptions,
		closingOptions,
		provisionClassesOptions,
		resultsAsOptions,
		speciesCategoryOptions,
		statusesOptions,
	} = options;


	const handleNotify = useCallback((notificationType: 'success' | 'error') => {
		enqueueSnackbar(
			t(notificationType === 'success' ? 'successfulOperation' : 'anErrorHasOcurred'),
			{ variant: notificationType }
		)
	}, [enqueueSnackbar, t]);


	const handleExport = useCallback(async () => {
		const { payload, type } = await dispatch(exportSmartSwap({ smartSwapId, handleNotify }));
		if (type === 'smartSwap/export-excel/rejected') return;
		FileSaver.saveAs(payload as Blob, `troca_inteligente.xlsx`)
	}, [dispatch, handleNotify, smartSwapId])


	const onSubmit = useCallback(async (values: TSmartSwapChangingParamsForm, { setSubmitting }: FormikHelpers<TSmartSwapChangingParamsForm>) => {
		const settedValues = rejectNoValues(values) as TSmartSwapChangingParams;
		if (Object.keys(settedValues).length > 0 && (await confirm(t('confirmProceed'), t('dataImport:smartswap.title')))) {
			dispatch(actions.smartSwap.setEditPanel(values));
			dispatch(updateSmartSwap({ smartSwapId, params: settedValues, handleNotify }));
		}
		setSubmitting(false);
	}, [dispatch, handleNotify, smartSwapId, t]);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
		>
			{({ handleSubmit }) => (
				<form noValidate onSubmit={handleSubmit} autoComplete="off">
					<Panel title={t('dataImport:smartswap.edit.title')} withPadding>
						<Grid container spacing={3}>
							<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									label={"Área Dejur"}
									name="legalDepartmentAreaId"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									label={"Área Origem"}
									name="originAreaId"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactField
									label={t('dataImport:smartswap.filter.internalLawyer')}
									name="InternalLawyerId"
									contactType={CONTACT_TYPE.PERSON}
									contactSearch={CONTACT_SEARCH.InternalLawyer}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactField
									label={t('dataImport:smartswap.filter.mainResponsible')}
									name="legalResponsibleId"
									contactType={CONTACT_TYPE.PERSON}
									contactSearch={CONTACT_SEARCH.LegalResponsible}
									disabled
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:smartswap.filter.stage')}
									name="phasesId"
									options={processPhasesOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:smartswap.filter.actionClass')}
									name="actionClassId"
									options={actionClassesOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:smartswap.filter.result')}
									name="result"
									options={resultsAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:smartswap.filter.status')}
									name="statusId"
									options={statusesOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									label={t('dataImport:smartswap.list.dischargeDate')}
									name="terminationDate"
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									label={t('dataImport:smartswap.list.closingDate')}
									name="closingDate"
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<GroupedSelectFiledMultiple
									label={t('dataImport:smartswap.filter.responsibleArea')}
									name="responsibleAreaId"
									options={groupedAreasByIdAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactField
									label={t('dataImport:smartswap.filter.reponsibleAreaResponsible')}
									name="responsibleOfficeId"
									contactType={CONTACT_TYPE.PERSON}
									contactSearch={CONTACT_SEARCH.OfficeResponsible}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<ContactField
									label={t('dataImport:smartswap.filter.agent')}
									name="agentId"
									contactSearch={CONTACT_SEARCH.Agent}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:smartswap.filter.businessArea')}
									name="businessArea"
									options={businessAreasOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:smartswap.filter.provisionClass')}
									name="provisionClass"
									options={provisionClassesOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:smartswap.filter.closing')}
									name="closure"
									options={closingOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('dataImport:smartswap.filter.category')}
									name="categorySpecies"
									options={speciesCategoryOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CostCenterField
									name='groupingCostCenterId'
									label={ t('reports:main.form.costCenter')}
									withDescription
									sendId={true}
									getFromSmartSwap
									groupingCostCenter={true}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CostCenterField
									name='originCostCenterId'
									label={t('dataImport:smartswap.filter.costCenterOrigin')}
									getFromSmartSwap
									sendId={true}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<RadioGroup
									isDeselectable
									label={t('dataImport:smartswap.filter.valuedProcess')}
									name="valuedProcess"
								/>
							</Grid>
							<Grid container spacing={2} alignItems='center'>
								<Grid item md={6} xs={6}>
									<Clean text={t('dataImport:smartswap.edit.clean')}/>
								</Grid>
								<Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
									{loading && <CircularProgress />}
								</Grid>
							</Grid>
						</Grid>
					</Panel>
					<Box display="flex" justifyContent="flex-end" mt={3}>
						<Button
							color="primary"
							variant="contained"
							type="button"
							style={{ marginRight: '24px' }}
							disabled={!smartSwapId}
							onClick={handleExport}
						>
							{t('dataImport:smartswap.buttons.export')}
						</Button>
						<Button
							color="primary"
							variant="contained"
							type="submit"
							disabled={!smartSwapId}
						>
							{t('dataImport:smartswap.buttons.execute')}
						</Button>
					</Box>
				</form>
			)}
		</Formik>
	);
}

export default EditPanel
