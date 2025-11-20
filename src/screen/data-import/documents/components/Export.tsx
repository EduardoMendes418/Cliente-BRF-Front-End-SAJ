import moment from "moment";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import { Button, Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import FileSaver from "file-saver";

import { Submit } from "src/components/button";
import { SelectField } from "src/components/form";
import Panel from "src/components/Panel";
import { useTranslation } from "src/locale/i18n";

import {
	TYPE_DOCUMENTS,
	TDataImportDocuments,
	RADIO_OPTIONS,
	FOLDER_OPTIONS,
} from "src/core/models/data-import";
import { fetchDocuments } from "src/core/store/modules/data-import/thunk";
import { convertToBlob, convertToBlobCSV } from "src/core/utils/func";

import { typeOptions } from "../constants";
import FiltersExport from "./FiltersExport";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	button: {
		marginRight: theme.spacing(1),
	},
}));

const validate = ({ foldersNumber }: any) => {
	if (foldersNumber === "" || !!foldersNumber.match(/(^\d)+(;?\d)+$/)  || foldersNumber.includes('/'))
		return {};
	return { foldersNumber: "Deve seguir esse padrão {999;999}" };
};

type Props = {
	formRef: any;
	setIsImportScreen: any;
	isImportScreen: boolean;
};

const Export = ({ formRef, setIsImportScreen, isImportScreen }: Props) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const [requesting, setRequesting] = useState<boolean>(false);

	const handleExport = async (values: TDataImportDocuments) => {
		
		setRequesting(true)
		let foldersNumber: string[] = [];
		if (
			values.foldersNumber &&
			values.foldersNumber !== "" &&
			typeof values.foldersNumber === "string"
		)
			foldersNumber = values.foldersNumber.split(";");

		const { payload, error } = (await dispatch(
			fetchDocuments({ ...values, foldersNumber })
		)) as any;
		if (error) {
			enqueueSnackbar(payload.error.message, {
				variant: "error",
			});
			setRequesting(false)
			return;
		}

		FileSaver.saveAs(
			convertToBlob(payload),
			`documentos-${moment().format()}`
		);
		enqueueSnackbar(t("dataImport:common.exportSuccess"), {
			variant: "success",
		});
		setRequesting(false);
		/* history.push(`/carga-de-dados/monitor-de-execucao`); */
	};

	const titleFilter = (type: TYPE_DOCUMENTS) => {
		switch (type) {
			case TYPE_DOCUMENTS.PAYMENT:
				return "paymentFilter";
			case TYPE_DOCUMENTS.PENSION:
				return "pensionFilter";
			case TYPE_DOCUMENTS.ACCOUNTABILITY:
				return "accountabilityFilter";
			case TYPE_DOCUMENTS.OTHER_LEGAL_ONE_DOCUMENTS:
				return "legalOneDocumentFilter";
		 	case TYPE_DOCUMENTS.REQUEST:
				return "requestFilter"
			default:
				return "panelTypeDocuments";
		}
	};

	const initialValues: TDataImportDocuments = {
		type: null,
		paymentStartDate: null,
		paymentEndDate: null,
		paymentReceipt: RADIO_OPTIONS.NO,
		pensionStartDate: null,
		pensionEndDate: null,
		pensionReceipt: RADIO_OPTIONS.NO,
		accountabilityAccountabilityStartDate: null,
		accountabilityAccountabilityEndDate: null,
		accountabilityBearishReasons: "",
		accountabilityApprovalStartDate: null,
		accountabilityApprovalEndDate: null,
		accountabilityStatusFlowId: "",
		accountabilityBankId: "",
		foldersNumber: "",
		folderOptions: FOLDER_OPTIONS.MAIN,
		file: {} as FileList,
		areasId: [],
		folderStatus: []
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleExport}
			enableReinitialize
			innerRef={formRef}
			validate={validate}
		>
			{({ handleSubmit, values }) => {
				const type = values.type as TYPE_DOCUMENTS;
				return (
					<form noValidate onSubmit={handleSubmit}>
						{!isImportScreen && (
							<>
								<Panel
									title={t("dataImport:documents.panelTypeDocuments")}
									withPadding
								>
									<Grid container spacing={2}>
										<Grid item md={3} xs={12}>
											<SelectField
												options={typeOptions}
												label={t("dataImport:documents.form.type")}
												name="type"
												required
											/>
										</Grid>
									</Grid>
								</Panel>
								<Panel
									title={t(`dataImport:documents.${titleFilter(type)}`)}
									withPadding
								>
									<FiltersExport type={type} />
								</Panel>
								<Box
									sx={{ marginTop: 20, flexDirection: "row-reverse" }}
									display="flex"
								>
									<Submit disabled={requesting}  text={t("dataImport:common.generateSpreadsheet")} />
									<Button
										className={classes.button}
										color="primary"
										variant="contained"
										onClick={() => setIsImportScreen(true)}
									>
										{t("dataImport:common.importSpreadsheet")}
									</Button>
								</Box>
							</>
						)}
					</form>
				);
			}}
		</Formik>
	);
};
export default Export;
