import { useDispatch, useSelector } from "react-redux";
import Attachments from "src/components/Attachments";
import { Button, Submit } from "src/components/button";
import {
	OfficeManagementPaymentStatus,
	TLegalResponsibleGiveBack,
	TOfficeManagementPayment,
} from "src/core/models/office-management-payment";
import {
	getItemOfficeManagementPayment,
	getLoadingOfficeManagementPayment,
	getLoadingSavingOfficeManagementPayment,
} from "src/core/store/modules/office-management-payment/selectors";
import RequestPaymentSection from "../sections/request-payment-section";
import Form, {
	SelectField,
	TextField,
	TOptionsSelect,
} from "src/components/form";
import { useEffect, useMemo, useState } from "react";
import Logs from "src/components/Logs";
import Panel from "src/components/Panel";
import { Grid } from "@material-ui/core";
import { useTranslation } from "src/locale/i18n";
import LawyerReviewSection from "../sections/lawyer-review-section";
import InvoicePostingSection from "../sections/invoice-posting-section";
import {
	useAreasDEJUR,
	useOfficeManagementInvoices,
	useOfficeManagementResponsible,
} from "src/hooks/fetchLists";
import { addOfficeManagementPaymentLegalResponsible, sendLegalResponsibleGiveBack } from "src/core/store/modules/office-management-payment/thunks";
import { toNumber } from "src/core/utils/func";
import { getHierarchyList } from "src/core/store/modules/hierarchy/selectors";
import { fetchHierarchy } from "src/core/store/modules/hierarchy/thunks";
import GetCostCenterField from "src/components/form/GetCostCenterField";
import { fetchOfficeManagementResponsible } from "src/core/store/modules/office-management-responsible/thunks";
import JustificationModal from 'src/components/JustificationModal';
import { modal } from "src/components/modals";
import { useHistory } from "react-router-dom";

const EvaluationJuridicalStep = () => {
	const item = useSelector(getItemOfficeManagementPayment);
	const hierarchy = useSelector(getHierarchyList);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { allowedAreasAsOptions: areasDEJUROptions } = useAreasDEJUR();
	const { natureInvoicesAsOptions } = useOfficeManagementInvoices();
	const [selectedAreaDejur, setSelectedAreaDejur] = useState();
	const loading = useSelector(getLoadingOfficeManagementPayment);
	const loadingSaving = useSelector(getLoadingSavingOfficeManagementPayment);
	const { responsiblesAsOptions } = useOfficeManagementResponsible();
	const history = useHistory();

	useEffect(() => {
		const dejur = areasDEJUROptions.find(
			(el) => el.value === selectedAreaDejur
		);
		dispatch(fetchHierarchy({ juridicalArea: dejur?.label }));
		dispatch(fetchOfficeManagementResponsible({ areaId: dejur?.value }));
	}, [selectedAreaDejur, dispatch, areasDEJUROptions]);

	const hierarchyOptions: TOptionsSelect[] = useMemo(() => {
		return hierarchy.map((el) => ({
			label: el.approverName!,
			value: el.approver!,
		}));
	}, [hierarchy]);

	const natureInvoices: TOptionsSelect[] = useMemo(() => {
		return natureInvoicesAsOptions
			.filter((el) => toNumber(el.group) === selectedAreaDejur)
			.map((el) => ({ label: el.label!, value: el.value! }));
	}, [selectedAreaDejur, natureInvoicesAsOptions]);

	const initialValues: TOfficeManagementPayment = useMemo(() => {
		const initialValues = {
			cliforSAP: "",
			contractSAP: "",
			centroSAP: "",
			contaRazao: "",
			approverIdSAP: "",
			legalResponsibleObservation: "",
			areaDejurId: "",
			natureInvoiceId: "",
			costCenterId: "",
			legalResponsibleId: "",

			filesSolicitation: item ? item.filesSolicitation : [],
			filesExternalOffice: item ? item.filesExternalOffice : [],
		} as TOfficeManagementPayment;
		return initialValues;
	}, [item]);

	const onSubmit = (values: TOfficeManagementPayment, actions: any) => {
		const newValues = {
			...item,
			cliforSAP: values.cliforSAP,
			contractSAP: values.contractSAP,
			centroSAP: toNumber(values.centroSAP),
			contaRazao: values.contaRazao,
			approverIdSAP: toNumber(values.approverIdSAP),
			areaDejurId: toNumber(values.areaDejurId),
			natureInvoiceId: toNumber(values.natureInvoiceId),
			costCenterId: toNumber(values.costCenterId),
			legalResponsibleId: toNumber(values.legalResponsibleId),
			legalResponsibleObservation: values.legalResponsibleObservation,
		} as TOfficeManagementPayment;

		dispatch(addOfficeManagementPaymentLegalResponsible(newValues));
		actions.setSubmitting(false);
	};

	const onSubmitJustification = (value: TLegalResponsibleGiveBack) => {
		dispatch(sendLegalResponsibleGiveBack({id: item?.id, justification: value.justification}));
		history.goBack()
	  }

	  const onJustify = () => {
		const component = (
			<JustificationModal
				onSubmitJustification={(observation: TLegalResponsibleGiveBack) => onSubmitJustification(observation)}
				moduloId={11}
			/>
		)
	
		 modal({
			title: "Justificativa",
			component,
			buttons: [],
			dialogProps: { maxWidth: 'md', showCloseButton: true, fullWidth: true },
		}) 
	}

	return (
		<Form enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
			{({
				handleSubmit,
				isSubmitting,
				dirty,
				setFieldValue,
			}) => (
				<form noValidate onSubmit={handleSubmit}>
					<RequestPaymentSection />

					<Attachments
						disabled
						label=""
						name="filesSolicitation"
						id="filesSolicitation"
						multiple
					/>

					<LawyerReviewSection />

					<InvoicePostingSection />

					<Attachments
						disabled
						label=""
						name="filesExternalOffice"
						id="filesExternalOffice"
						multiple
					/>

					<Logs
						logs={item?.treatedLogs}
						statuses={OfficeManagementPaymentStatus}
						statusOrder={["flow", "approvalCenter"]}
					/>

					<Panel
						title={t("officeManagement:evaluationJuridical.title")}
						withPadding
						loading={loading}
						slotBottomRight={
					<>
			  			<Button
						color='primary'
						variant='contained'
						onClick={onJustify}
						text={"Devolver"}
						/>
			  			<Submit
                			submitting={isSubmitting || loadingSaving}
                			disabled={!dirty}
              			/>
			  		</>
						}
						slotBottonRightPermission={true}
					>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<TextField
									label={t("officeManagement:cliforSAP")}
									required
									name="cliforSAP"
									maxLength={10}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("officeManagement:areaDejurId")}
									name="areaDejurId"
									required
									options={areasDEJUROptions}
									onChange={(e: any) => {
										setSelectedAreaDejur(e.target.value);
										setFieldValue("natureInvoiceId", "");
									}}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("officeManagement:natureInvoiceId")}
									name="natureInvoiceId"
									required
									options={natureInvoices}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									label={t("officeManagement:contractSAP")}
									name="contractSAP"
									maxLength={10}
									required
								/>
							</Grid>
						</Grid>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<TextField
									label={t("officeManagement:centroSAP")}
									name="centroSAP"
									maxLength={4}
									required
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									label={t("officeManagement:contaRazao")}
									name="contaRazao"
									maxLength={10}
									required
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<GetCostCenterField
									label={t("officeManagement:costCenterId")}
									name="costCenterId"
									required
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("officeManagement:approverIdSAP")}
									name="approverIdSAP"
									required
									options={hierarchyOptions}
									disabled={selectedAreaDejur == null}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("officeManagement:legalRepresentative")}
									name="legalResponsibleId"
									options={responsiblesAsOptions}
									disabled={selectedAreaDejur == null}
									required
								/>
							</Grid>
						</Grid>
						<Grid container spacing={3}>
							<Grid item md={12} xs={12}>
								<TextField
									required
									label={t("officeManagement:obs")}
									name="legalResponsibleObservation"
								/>
							</Grid>
						</Grid>
					</Panel>
				</form>
			)}
		</Form>
	);
};

export default EvaluationJuridicalStep;
