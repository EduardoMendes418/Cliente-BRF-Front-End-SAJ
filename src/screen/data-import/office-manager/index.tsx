import { Box } from "@material-ui/core";
import { Formik, FormikHelpers } from "formik";
import { Submit } from "src/components/button";
import UploadFileButton from "src/components/form/Upload/UploadButton";
import ScreenTemplate from "src/components/Screen";
import { TReportFilters } from "src/core/models/office-management-data-import";
import { t } from "src/locale/i18n";
import ReportFilters from "./forms/report-filters";
import ImportErrorsList from "../components/ImportErrors";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/core/store";
import {
	generateOfficeManager,
	importSingleFile,
} from "src/core/store/modules/data-import/thunk";
import { useSnackbar } from "notistack";
import FileSaver from "file-saver";
import { convertToBlob, convertToBlobCSV } from "src/core/utils/func";
import { SINGLE_FILE_TYPE } from "src/core/models/data-import";
import { useHistory } from "react-router-dom";

const reportFiltersInitialValues: TReportFilters = {
	startRequestDate: null,
	endRequestDate: null,
	externalCompanyId: "",
	createdBy: "",
	aprovalStatus: "",
	preInvoiceNumber: "",
	invoiceNumber: "",
	startInvoiceIssuanceDate: null,
	endInvoiceIssuanceDate: null,
	documentTypeId: "",
	legalResponsibleId: "",
	natureInvoiceId: "",
	contractSap: "",
	approverIdSAP: "",
	legalResponsibleControlId: "",
	startPaymentDate: null,
	endPaymentDate: null,
	startAnalysisDate: null,
	endAnalysisDate: null,
	internalLawyerId: "",
	externalOfficeId: "",
	startEvaluationDateLegalControl: null,
	endEvaluationDateLegalControl: null,
	approverLegalControl: "",
};

const isValidFile = (files: FileList | null): boolean => {
	return !!files?.length && files[0].name.split(".").pop() === "csv";
};

const OfficeManagerDataImport: React.FC = () => {
	const uploadRef = useRef<HTMLInputElement>(null);
	const [isLoading, setLoading] = useState(false);
	const history = useHistory();
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();

	const handleSubmit = useCallback(
		async (
			form: TReportFilters,
			{ setSubmitting }: FormikHelpers<TReportFilters>
		) => {
			setLoading(true)
			const { type, payload } = await dispatch(generateOfficeManager(form));

			if (type === "data-import-office-manager/csv/rejected") {
				setSubmitting(false);
				setLoading(false)
				enqueueSnackbar(t("anErrorHasOcurred"), { variant: "error" });
				return;
			}

			FileSaver.saveAs(
				convertToBlob(payload),
				"gestao_de_escritorio_template"
			);
			setSubmitting(false);
			setLoading(false)
			/* history.push(`/carga-de-dados/monitor-de-execucao`); */
		},
		[dispatch, enqueueSnackbar]
	);

	const handleUploadChange = useCallback(
		(e: ChangeEvent) => {
			setLoading(true)
			const { files } = e.target as HTMLInputElement;
			if (isValidFile(files) && files) {
				dispatch(
					importSingleFile({
						file: files,
						type: SINGLE_FILE_TYPE.OFFICE_MANAGER,
					})
				);

				if (uploadRef.current) {
					uploadRef.current.value = "";
				}

				setLoading(false)
			}
		},
		[dispatch]
	);

	return (
		<ScreenTemplate>
			<Formik
				initialValues={reportFiltersInitialValues}
				onSubmit={handleSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit} autoComplete="off">
						<ReportFilters />
						<Box display="flex" justifyContent="flex-end" mt={3}>
							<UploadFileButton
								variant="contained"
								color="primary"
								text={t("dataImport:officeManager.buttons.importCsv")}
								onChange={handleUploadChange}
								inputRef={uploadRef}
								disabled={isLoading}
								style={{ marginRight: "24px" }}
								clearInputFilesOnChange={false}
							/>
							<Submit
								submitting={isSubmitting}
								disabled={isLoading}
								text={t("dataImport:officeManager.buttons.generateCsv")}
							/>
						</Box>
					</form>
				)}
			</Formik>
			<ImportErrorsList />
		</ScreenTemplate>
	);
};

export default OfficeManagerDataImport;
