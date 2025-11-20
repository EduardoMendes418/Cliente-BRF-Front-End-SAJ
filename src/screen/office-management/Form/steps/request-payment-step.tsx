import {useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Grid} from "@material-ui/core";
import Form, {
	CurrencyField,
	SelectField,
	TextField,
} from "src/components/form";
import Panel from "src/components/Panel";
import {Submit} from "src/components/button";
import {useTranslation} from "src/locale/i18n";
import {
	addOfficeManagementPayment,
	editOfficeManagementPayment,
} from "src/core/store/modules/office-management-payment/thunks";
import {
	OfficeManagementPaymentStatus,
	TOfficeManagementPayment,
} from "src/core/models/office-management-payment";
import moment from "moment";
import Attachments from "src/components/Attachments";
import {toNumber} from "src/core/utils/func";
import {
	getItemOfficeManagementPayment,
	getLoadingOfficeManagementPayment,
} from "src/core/store/modules/office-management-payment/selectors";
import {useAreasResponsible, useUsersActives} from "src/hooks/fetchLists";
import LawyerReviewSection from "../sections/lawyer-review-section";
import {OfficeManagementTypeEnum} from "../../utils/getOfficeManagementType";
import Logs from "src/components/Logs";
import RequestPaymentSection from "../sections/request-payment-section";
import InvoicePostingSection from "../sections/invoice-posting-section";
import EvaluationJuridicalSection from "../sections/evaluation-juridical-section";

const RequestPaymentStep = () => {
	const {t} = useTranslation();
	const dispatch = useDispatch();
	const item = useSelector(getItemOfficeManagementPayment);
	const loading = useSelector(getLoadingOfficeManagementPayment);
	const {allowedAreasAsOptions: areasResponsibleOptions} =
		useAreasResponsible();
	
	const {usersActivesAsOptionsById} = useUsersActives();
	
	const initialValues: TOfficeManagementPayment = useMemo(() => {
		const initialValues = {
			...item,
			companyId: item ? item.companyId : "",
			internalLawyerId: item ? item.internalLawyerId : "",
			preInvoiceNumber: item ? item.preInvoiceNumber : "",
			preInvoiceTotalAmount: item ? item.preInvoiceTotalAmount : "",
			observation: item ? item.observation : "",
			files: item ? item.filesSolicitation : ([] as unknown as FileList),
			requestDate: moment().format("DD/MM/YYYY").toString(),
		} as TOfficeManagementPayment;
		return initialValues;
	}, [item]);
	
	const onSubmit = (values: TOfficeManagementPayment, actions: any) => {
		if (item?.id) {
			dispatch(
				editOfficeManagementPayment({
					...values,
					preInvoiceTotalAmount: toNumber(values.preInvoiceTotalAmount),
					preInvoiceNumber: toNumber(values.preInvoiceNumber),
					internalLawyerId: toNumber(values.internalLawyerId),
				})
			);
		} else {
			dispatch(
				addOfficeManagementPayment({
					...values,
					preInvoiceTotalAmount: toNumber(values.preInvoiceTotalAmount),
					preInvoiceNumber: toNumber(values.preInvoiceNumber),
					internalLawyerId: toNumber(values.internalLawyerId),
				})
			);
		}
		
		actions.setSubmitting(false);
	};
	
	const isEditing =
		!item ||
		(item && item.id && item.stage === OfficeManagementTypeEnum.requestPayment);
	
	return (
		<Form enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
			{({
					handleSubmit,
					isSubmitting,
					dirty,
				}) => (
				<form noValidate onSubmit={handleSubmit}>
					<RequestPaymentSection/>
					
					{item?.stage! > OfficeManagementTypeEnum.requestPayment && (
						<Attachments
							disabled
							label=""
							name="filesSolicitation"
							id="filesSolicitation"
							multiple
						/>
					)}
					
					<LawyerReviewSection/>
					
					<InvoicePostingSection/>
					
					<Attachments
						disabled
						label=""
						name="filesExternalOffice"
						id="filesExternalOffice"
						multiple
					/>
					
					<EvaluationJuridicalSection/>
					
					<Logs
						logs={item?.treatedLogs}
						statuses={OfficeManagementPaymentStatus}
						statusOrder={["flow", "approvalCenter"]}
					/>
					
					{isEditing && (
						<>
							<Panel
								title={t("officeManagement:requestPayment.title")}
								loading={loading}
								withPadding
							>
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<TextField
											label={t("officeManagement:requestPayment.requestData")}
											disabled
											name="requestDate"
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t("officeManagement:requestPayment.socialReason")}
											name="companyId"
											options={areasResponsibleOptions}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											label={t("officeManagement:requestPayment.preInvoiceNumber")}
											name="preInvoiceNumber"
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t(
												"solicitacaoPagamento:dadosPagamento.advogadoInterno"
											)}
											required
											name="internalLawyerId"
											options={usersActivesAsOptionsById}
										/>
									</Grid>
								</Grid>
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<CurrencyField
											required
											label={t("officeManagement:invoiceValue")}
											name="preInvoiceTotalAmount"
										/>
									</Grid>
								</Grid>
								<Grid container spacing={3}>
									<Grid item md={12} xs={12}>
										<TextField
											required
											label={t("officeManagement:obs")}
											name="observation"
										/>
									</Grid>
								</Grid>
							</Panel>
							<Attachments
								label=""
								panelConfig={{
									slotBottomRight: (
										<Submit submitting={isSubmitting} disabled={!dirty}/>
									),
									slotBottonRightPermission: true,
								}}
								name="files"
								id="files"
								multiple
							/>
						</>
					)}
				</form>
			)}
		</Form>
	);
};

export default RequestPaymentStep;
