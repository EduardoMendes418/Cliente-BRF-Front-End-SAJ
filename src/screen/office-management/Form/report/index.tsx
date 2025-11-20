import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Grid, Typography} from "@material-ui/core";

import Form, {DateField, SelectField, TextField, TOptionsSelect,} from "src/components/form";
import Panel from "src/components/Panel";
import {Submit} from "src/components/button";
import CloseIcon from "@material-ui/icons/Close";
import {useTranslation} from "src/locale/i18n";

import {
	OfficeManagementPaymentReportStatus,
	TOfficeManagementPaymentReport,
} from "src/core/models/office-management-payment";
import {AppDispatch} from "src/core/store";
import {
	useAreasDEJUR,
	useAreasResponsible,
	useGroupedAreasById,
	useOfficeManagementControl,
	useOfficeManagementDocuments,
	useOfficeManagementInvoices,
	useOfficeManagementResponsible,
	useUsersActives,
} from "src/hooks/fetchLists";
import {getHierarchyList} from "src/core/store/modules/hierarchy/selectors";
import {fetchHierarchy} from "src/core/store/modules/hierarchy/thunks";
import {fetchExportOfficeManagementFile} from "src/core/store/modules/report/thunks";
import FileSaver from "file-saver";
import {FormikHelpers} from "formik";
import ListBreadcrumbs, {PathProps} from "../../../../components/Breadcrumbs";
import {rejectNoValues} from "../../../../core/utils/func";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const path: PathProps[] = [{label: 'Dashboard', url: '/'}, {label: 'Gestão de escritório'}, {label: 'Relatório'}]

const RequestPaymentStep = () => {
	const {t} = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const {usersActivesAsOptionsById} = useUsersActives();
	const {documentsAsOptions} = useOfficeManagementDocuments();
	const {responsiblesAsOptions} = useOfficeManagementResponsible();
	const {allowedAreasAsOptions: areasDEJUROptions} = useAreasDEJUR();
	const {controlAsOptions} = useOfficeManagementControl();
	const [selectedAreaDejur, setSelectedAreaDejur] = useState<number[]>();
	const {natureInvoicesAsOptions} = useOfficeManagementInvoices(selectedAreaDejur);
	const hierarchy = useSelector(getHierarchyList);
	const { groupedAreasByIdAsOptions } = useGroupedAreasById();
	const statusAsOptions: TOptionsSelect[] = useMemo(
		() =>
			Object.keys(OfficeManagementPaymentReportStatus).map(
				(el) =>
					({
						value: (OfficeManagementPaymentReportStatus as any)[el],
						label: (OfficeManagementPaymentReportStatus as any)[el],
					} as unknown as TOptionsSelect)
			),
		[]
	);
	
	useEffect(() => {
		const dejur = areasDEJUROptions.find(
			(el) => selectedAreaDejur?.includes(el.value)
		)
		dispatch(fetchHierarchy({juridicalArea: dejur?.label}));
	}, [selectedAreaDejur, dispatch, areasDEJUROptions]);
	
	const hierarchyOptions: TOptionsSelect[] = useMemo(() => {
		return hierarchy.map((el) => ({
			label: el.approverName!,
			value: el.approver!,
		}));
	}, [hierarchy]);
	
	
	const initialValues: TOfficeManagementPaymentReport = useMemo(() => {
		const initialValues = {
			legalResponsibleControlId: "",
			areaDejurId: [],
			officeResponsible: "",
			dataSolicitacaoInitial: null,
			dataSolicitacaoFinal: null,
			requestBy: [],
			opposingLawyer: [],
			paymentDateFinal: null,
			paymentDateInitial: null,
			oppositePart: "",
			preInvoiceNumber: "",
			invoiceNumber: "",
			invoiceIssuanceDateInitial: null,
			invoiceIssuanceDateFinal: null,
			docTemp: "",
			statusTemp: "",
			natureInvoice: "",
			contractSAP: "",
			approverIdSAP: "",
			internalLayerAvaliationDateInitial: null,
			internalLayerAvaliationDateFinal: null,
			legalControlAvaliator: "",
			thirdResponsibleId: "",
			legalControlAvaliationDateInitial: null,
			legalControlAvaliationDateFinal: null,
			avaliatorId: "",
			responsavelAreaJuridicaId: []
		} as TOfficeManagementPaymentReport;
		return initialValues;
	}, []);
	
	const onSubmit = async (
		values: TOfficeManagementPaymentReport,
		{resetForm}: FormikHelpers<TOfficeManagementPaymentReport>
	) => {
		const newValues = {
			...values,
			documentTypeId: values.docTemp ? [values.docTemp] : [],
			status: values.statusTemp ? [values.statusTemp] : [],
		};
		
		const filters = rejectNoValues(newValues)
		
		const {payload} = await dispatch(
			fetchExportOfficeManagementFile(filters)
		);
		
		FileSaver.saveAs(
			payload as Blob,
			'relatório-gestão-de-escritório.xlsx'
		);
		
		resetForm();
	};
	
	return (
		<Form
			enableReinitialize
			initialValues={initialValues}
			onSubmit={onSubmit}
		>
			{({
					handleSubmit,
					isSubmitting,
					dirty,
					setSubmitting,
					setFieldValue,
					resetForm,
				}) => (
				<form noValidate onSubmit={handleSubmit}>
					<ListBreadcrumbs paths={path}/>
					<Panel
						title={t("officeManagement:report.title")}
						withPadding
						slotBottomRight={
							<Submit
								submitting={isSubmitting}
								disabled={!dirty}
								text={"Gerar relatório"}
							/>
						}
						slotBottonRightPermission={true}
					>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("officeManagement:report.internalLawyer")}
									name="opposingLawyer"
									multiple
									options={usersActivesAsOptionsById}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									multiple
									label={t("officeManagement:areaDejurId")}
									name="areaDejurId"
									onChange={(e: any) => {
										setSelectedAreaDejur(e.target.value);
										setFieldValue("natureInvoiceId", "");
									}}
									options={areasDEJUROptions.sort((a, b) => a.label.localeCompare(b.label))}
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<TextField
									label={t("officeManagement:contractSAP")}
									name="contractSAP"
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<DateField
									label={t("officeManagement:report.invoiceIssuanceDateInitial")}
									name="invoiceIssuanceDateInitial"
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<DateField
									label={t("officeManagement:report.ate")}
									name="invoiceIssuanceDateFinal"
								/>
							</Grid>
						</Grid>
						
						<Grid container spacing={3}>
							
							<Grid item md={3} xs={12}>
								<DateField
									label={t("officeManagement:report.paymentDateInitial")}
									name="paymentDateInitial"
								/>
							</Grid>
							
							<Grid item md={3} xs={12}>
								<DateField
									label={t("officeManagement:report.ate")}
									name="paymentDateFinal"
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<DateField
									label={t("officeManagement:report.dataSolicitacaoInitial")}
									name="dataSolicitacaoInitial"
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<DateField
									label={t("officeManagement:report.ate")}
									name="dataSolicitacaoFinal"
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<GroupedSelectFiledMultiple
									label={t("officeManagement:report.officeResponsible")}
									name="officeResponsible"
									options={groupedAreasByIdAsOptions}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("officeManagement:approverIdSAP")}
									name="approverIdSAP"
									options={hierarchyOptions.sort((a, b) => a?.label?.localeCompare(b?.label))}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("officeManagement:natureInvoiceId")}
									name="natureInvoice"
									options={natureInvoicesAsOptions?.map((item) => ({label: item.label, value: item.value}))}
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<TextField
									label={t("officeManagement:note")}
									name="invoiceNumber"
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<TextField
									label={t("officeManagement:requestPayment.preInvoiceNumber")}
									name="preInvoiceNumber"
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<SelectField
									label={t("officeManagement:report.legalResponsibleControlId")}
									name="legalResponsibleControlId"
									options={controlAsOptions}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={3}>
							
							<Grid item md={3} xs={12}>
								<SelectField
									multiple
									label={t("officeManagement:report.responsavelAreaJuridicaId")}
									name="responsavelAreaJuridicaId"
									options={responsiblesAsOptions.sort((a, b) => a.label.localeCompare(b.label))}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									multiple
									label={t("officeManagement:report.requestBy")}
									name="requestBy"
									options={usersActivesAsOptionsById}
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<SelectField
									label={t("officeManagement:status")}
									name="statusTemp"
									options={statusAsOptions}
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<SelectField
									label={t("officeManagement:documentType")}
									name="docTemp"
									options={documentsAsOptions}
								/>
							</Grid>
						</Grid>
						<Typography
							variant="h3"
							style={{marginTop: 20, marginBottom: 20}}
						>
							{t("officeManagement:lawyerReview.title")}
						</Typography>
						<Grid container spacing={3}>
							<Grid item md={2} xs={12}>
								<DateField
									label={t("officeManagement:report.evaluationDate")}
									name="internalLayerAvaliationDateInitial"
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<DateField
									label={t("officeManagement:report.ate")}
									name="internalLayerAvaliationDateFinal"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("officeManagement:report.legalControlAvaliator")}
									name="avaliatorId"
									options={usersActivesAsOptionsById}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("officeManagement:report.thirdResponsibleId")}
									name="thirdResponsibleId"
									options={usersActivesAsOptionsById}
								/>
							</Grid>
						</Grid>
						<Typography
							variant="h3"
							style={{marginTop: 20, marginBottom: 20}}
						>
							{t("officeManagement:report.legalControlAvaliatorJuridical")}
						</Typography>
						<Grid container spacing={3}>
							<Grid item md={2} xs={12}>
								<DateField
									label={t("officeManagement:report.evaluationDate"
									)}
									name="legalControlAvaliationDateInitial"
								/>
							</Grid>
							<Grid item md={2} xs={12}>
								<DateField
									label={t("officeManagement:report.ate")}
									name="legalControlAvaliationDateFinal"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("officeManagement:report.legalControlAvaliator")}
									name="legalControlAvaliator"
									options={usersActivesAsOptionsById}
								/>
							</Grid>
						</Grid>
						<Button
							startIcon={<CloseIcon/>}
							variant="outlined"
							style={{marginTop: "15px", marginBottom: "15px"}}
							onClick={() => resetForm()}
						>
							Limpar pesquisa
						</Button>
					</Panel>
				</form>
			)}
		</Form>
	);
};

export default RequestPaymentStep;
