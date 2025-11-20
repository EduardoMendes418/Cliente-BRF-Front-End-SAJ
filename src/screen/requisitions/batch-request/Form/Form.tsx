import { useEffect, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { FormHelperText } from "@material-ui/core";
import moment from "moment";
import { omit } from "ramda";
import * as yup from "yup";

import FieldColumn from "src/components/FieldColumn";
import Panel from "src/components/Panel";
import { Submit } from "src/components/button";
import { DateField, TextField } from "src/components/form";
import Form, {
	Upload,
	RadioGroup,
	SelectField,
	CheckboxesAutocompleteField,
} from "src/components/form";
import { t } from "src/locale/i18n";

import {
	getItemRequestParameters,
	getLoadingRequestParameters,
} from "src/core/store/modules/request-parameters/selectors";
import {
	COUNT_DEADLINE,
	RESPONSIBLE_TYPE,
	resposibleAsOptions,
} from "src/screen/settings/general/request-parameters/constants";
import { FolderNumber } from "src/core/models/requisitions";
import {
	getErrorMessageRequisitions,
	getStatusRequisitions,
	getExpectedServiceDateRequisitions,
} from "src/core/store/modules/requisitions/selectors";
import { addRequisitionsBatch } from "src/core/store/modules/requisitions/thunks";
import { useResults, useUsersActives } from "src/hooks/fetchLists";
import { useRegisterDefault } from "src/hooks";
import { STATUS, statusText } from "../../constants";
import { useSnackbar } from "notistack";
import { AppDispatch } from "src/core/store";
import ImportErrors from 'src/screen/data-import/components/ImportErrors';
import { actions } from 'src/core/store';
import handleFileToBase64 from "src/screen/provisions/utils/fileToBase64";


type Props = {
	folderNumbers?: FolderNumber[];
};

const BatchRequestForm = ({ folderNumbers }: Props) => {
	const dispatch = useDispatch<AppDispatch>();

	const [userSelected, setUserSelected] = useState<
		{ value: number; label: string } | undefined
	>();
	const [hasResponse, setHasResponse] = useState(false);
	const [disableButton, setDisableButton] = useState(false);

	const expectedServiceDate = useSelector(getExpectedServiceDateRequisitions);

	useRegisterDefault({
		route: "requisicoes",
		action: "requisitions",
		getStatus: getStatusRequisitions,
		getErrorMessage: getErrorMessageRequisitions,
	});

	const updateSelectedUser = (value: any) => {
		setUserSelected(
			usersActivesAsOptionsById.find(
				(user) => user.value === value.target.value
			)
		);
	};

	const isFetching = useSelector(getLoadingRequestParameters);
	const { usersActivesAsOptionsById } = useUsersActives();
	const { resultsAsOptions } = useResults();
	const { enqueueSnackbar } = useSnackbar();

	const {
		hoursDeadline,
		description,
		id,
		responsibleType,
		resultReport,
		user,
		folderNumberRequired,
		countDeadline,
		administrativeControlResponsiblesIds,
	} = useSelector(getItemRequestParameters);

	const handleSubmitForm = async (values: any) => {
		const arrayOfFiles = []

		if(values.files !== undefined && values.files.length > 0){
		
		const convertedFiles = await handleFileToBase64(values.files) 

			for (const file of values.files){
				const index = values.files.indexOf(file);
				arrayOfFiles.push({documentName: file.name, file: convertedFiles[index]})
			}
		}

		 if (values?.folderNumbers.length === 0) {
			enqueueSnackbar(
				"Necessário Carregar um arquivo e fazer a busca para carregar as pastas contidas no arquivo",
				{ variant: "error" }
			);
		} else {
			values = omit(["administrativeControlResponsiblesIds"], { ...values });
			if (responsibleType === RESPONSIBLE_TYPE.NONE) {
				values["responsibleName"] = userSelected?.label ?? "";
				values["responsibleUserId"] = userSelected?.value ?? "";
			}
			 if(responsibleType === RESPONSIBLE_TYPE.CUSTOM && user?.isActive === false){
				values["responsibleName"] = usersActivesAsOptionsById.filter((x) => x.value === values.responsibleUserId)[0]?.label
			}
			if (responsibleType === RESPONSIBLE_TYPE.CUSTOM && user?.isActive === true) {
				values["responsibleName"] = user?.name ?? "";
				values["responsibleUserId"] = user?.id ?? "";
			}
			const { payload } = await dispatch(addRequisitionsBatch({...values, files: arrayOfFiles, type: 1 }));
			
			const payloadParsed = payload as {status: number | undefined, data: object | undefined};

			if (payloadParsed.status && payloadParsed.status === 200) {
				const message = responsibleType === RESPONSIBLE_TYPE.REQUESTER
					? "Requisições sendo executadas em segundo plano"
					: "Requisições criadas com sucesso"

				enqueueSnackbar(message, {
					variant: "success",
				});
				setDisableButton(true)
			}
			
			dispatch(actions.dataImport.setLineErrorsFeedback(payloadParsed.status === 200 ? payloadParsed.data : payloadParsed));
			setHasResponse(true)
			return
		}
	};

	const initialValues = {
		status: STATUS.REQUESTED,
		requestDate: moment().format("YYYY-MM-DD"),
		forwardAttachmentEmail: false,
		emailsWithInternalCopies: "",
		emailsWithExternallCopies: "",
		requestParameterId: id,
		files: [] as any,
		folderNumbers: folderNumbers ?? [],
		resultReport: "",
		responsibleName: responsibleType === RESPONSIBLE_TYPE.CUSTOM ? user?.name : "",
		description: description,
		administrativeControlResponsiblesIds: administrativeControlResponsiblesIds ?? [],
	};

	const folderNumbersFields =
		folderNumbers?.map((folderNumber) => folderNumber.folderNumber.replace('#', '')) ?? [];

	const formikSchema = yup.object({
		folderNumbers: folderNumberRequired
			? yup.array().required().min(1, t("requisitions:form.folderRequired"))
			: yup.array().notRequired(),
	});

	const isUserActive = () => {
		if(responsibleType === 6 && (user?.isActive === false && user?.isActive !== undefined)){
			enqueueSnackbar("Responsável pelo atendimento não ativo no sistema, favor solicitar alteração do responsável ou indique manualmente nesse andamento", { variant: "warning" });
		}
	}

	useEffect(() => {
		isUserActive();
	
	}, [user])

	if (!id || isFetching) return null;

	return (
		<>
			<Form
				initialValues={initialValues}
				onSubmit={handleSubmitForm}
				validationSchema={formikSchema}
				enableReinitialize
			>
				{(formik) => (
					<form onSubmit={formik.handleSubmit}>
						{folderNumbers?.length !== 0 && (
							<Panel title={t("requisitions:batch.form.CTGFolders")}>
								<div className="panel-content">
									<Grid container spacing={3}>
										<Grid item md={12} xs={12}>
											<Typography variant="body1" data-testid="field-value">
												{folderNumbersFields &&
												folderNumbersFields?.length > 90 ? (
													<>
														{folderNumbersFields?.slice(0, 30).join("; ")}
														<br />
														<b>...</b>
														<br />
														<b>...</b>
														<br />
														<b>...</b>
														<br />
														{folderNumbersFields
															.slice(-30, folderNumbersFields.length)
															.join("; ")}
													</>
												) : (
													folderNumbersFields?.join("; ")
												)}
											</Typography>
											<Typography
												variant="body1"
												data-testid="field-value"
												style={{ marginTop: 16 }}
											>
												<b>Número de pastas: </b> {folderNumbers?.length}
											</Typography>
										</Grid>
									</Grid>
								</div>
							</Panel>
						)}
						<Panel title={t("requisitions:form.requisitionData")}>
							<div className="panel-content">
								<Grid container spacing={3}>
									<Grid item container spacing={3}>
										<Grid item md={3} xs={12}>
											<DateField
												name="requestDate"
												label={t("requisitions:form.requisitionDate")}
												readOnly
											/>
										</Grid>
										<Grid item md={3} xs={12} sm={6}>
											<FieldColumn
												label={t("requisitions:form.attendanceDeadline")}
												value={`${hoursDeadline} horas`}
											/>
										</Grid>
										<Grid item md={3} xs={12} sm={6}>
											{countDeadline === COUNT_DEADLINE.MANUAL ? (
												<DateField
													name="expectedServiceDate"
													label={t("requisitions:form.expectedServiceDate")}
												/>
											) : (
												<FieldColumn
													label={t("requisitions:form.expectedServiceDate")}
													value={expectedServiceDate}
													type={"date"}
												/>
											)}
										</Grid>
										<Grid item md={3} xs={12} sm={6}>
											<FieldColumn
												label={t("requisitions:form.status")}
												value={statusText[formik.values.status]}
											/>
										</Grid>
									</Grid>
									<Grid item md={3} xs={12} sm={6}>
										<FieldColumn
											label={t("requisitions:form.serviceResponsible")}
											value={(resposibleAsOptions as any)[responsibleType].label}
										/>
									</Grid>
									<Grid item md={resultReport ? 6 : 9} xs={12} sm={12}>
										{responsibleType === RESPONSIBLE_TYPE.NONE ? (
											<SelectField
												label={t("settings:requestParameters.form.responsibleName")}
												name="responsibleUserId"
												options={usersActivesAsOptionsById}
												onChange={updateSelectedUser}
											/>
										) : responsibleType ===
										RESPONSIBLE_TYPE.ADMINISTRATIVE_CONTROL ? (
											<CheckboxesAutocompleteField
												options={usersActivesAsOptionsById}
												readOnly
												label={t("settings:requestParameters.form.administrativeControl")}
												name="administrativeControlResponsiblesIds"
											/>
										) : (
											responsibleType === RESPONSIBLE_TYPE.CUSTOM && user?.isActive === false ?
											<SelectField
											label={t("settings:requestParameters.form.responsibleName")}
											name="responsibleUserId"
											options={usersActivesAsOptionsById}
											required
										/>: 
											<TextField
												name="responsibleName"
												label={t("requisitions:form.responsibleName")}
												readOnly
											/>
										)}
									</Grid>
									{resultReport && (
										<Grid item md={3} xs={12} sm={12}>
											<SelectField
												name="resultReport"
												label={t("requisitions:form.informResult")}
												options={resultsAsOptions}
												required
											/>
										</Grid>
									)}
									<Grid item md={12} xs={12} sm={12}>
										<TextField
											multiline
											rows={8}
											name="description"
											label={t("requisitions:form.description")}
										/>
									</Grid>
									<Grid item md={6} xs={12} sm={6}>
										<TextField
											name="emailsWithInternalCopies"
											label={t("requisitions:form.emailsWithInternalCopies")}
											placeholder={t("requisitions:form.emailsPlaceholder")}
											helperText={t("requisitions:form.emailsHelperText")}
										/>
									</Grid>
									<Grid item md={6} xs={12} sm={6}>
										<TextField
											name="emailsWithExternallCopies"
											label={t("requisitions:form.emailsWithExternallCopies")}
											placeholder={t("requisitions:form.emailsPlaceholder")}
											helperText={t("requisitions:form.emailsHelperText")}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t("requisitions:form.forwardAttachmentEmail")}
											name="forwardAttachmentEmail"
											required
										/>
										<FormHelperText>
											{t("requisitions:form.forwardAtachmentEmailHelperText")}
										</FormHelperText>
									</Grid>
								</Grid>
							</div>
						</Panel>
						<Panel
							title={t("form.attachments")}
							slotBottomRight={
								<Submit
									text={t("btnSalvarEdicao")}
									submitting={formik.isSubmitting}
									disabled={disableButton}
								/>
							}
							slotBottonRightPermission="add"
						>
							<div className="panel-content">
								<Upload id="attachments" multiple name="files" />
							</div>
						</Panel>
					</form>
				)}
			</Form>
			{hasResponse && <ImportErrors />}
		</>
	);
};

export default BatchRequestForm;
