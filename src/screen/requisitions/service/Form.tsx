import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { omit } from "ramda";
import { CircularProgress, Grid } from "@material-ui/core";
import Logs from "src/components/Logs";

import Form, {
	DateField,
	NumericField,
	RadioGroup,
	SelectField,
	TextField,
	UserField,
} from "src/components/form";
import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import { Submit } from "src/components/button";
import Attachments from "src/components/Attachments";
import FieldColumn from "src/components/FieldColumn";

import { useTranslation } from "src/locale/i18n";
import {
	deleteFilesRequisition,
	editRequisitions,
	getRequisitionForServiceById,
} from "src/core/store/modules/requisitions/thunks";
import {
	getErrorMessageRequisitions as getErrorMessage,
	getHasItemRequisitions,
	getItemRequisitions,
	getStatusRequisitions as getStatus,
	getStatusRequisitions,
} from "src/core/store/modules/requisitions/selectors";
import {
	RESPONSIBLE_TYPE,
	resposibleAsOptions,
} from "src/screen/settings/general/request-parameters/constants";
import { TRequisitionService } from "src/core/models/requisitions";
import { useRegisterDefault } from "src/hooks";
import { fillIfValue, valuesToNumber } from "src/core/utils/func";
import { useCurrentUser } from "src/config/permissions";
import { useResults, useUsersActives } from "src/hooks/fetchLists";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";

import ServiceRequestForm from "../components/ServiceRequestForm";
import { ATTACHMENT_TYPE, STATUS, statusText, statusTextAsOptions } from "../constants";
import { handleAdministrativeControl } from "../utils";
import { cloneDeep } from "lodash";
import { TOptions } from "src/components/form/AutocompleteField";
import { getProcessFormData, getProcessIsFetching } from "src/core/store/modules/process/selectors";
import ProcessFormData from 'src/components/ProcessFormData';
import { fetchProcessFolder } from "src/core/store/modules/process/thunks";
import * as yup from "yup";
import { useSnackbar } from "notistack";



const RequisitionsForm = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const { name } = useSelector(getDataCurrentUser);
	const wrapperRef = useRef<null | HTMLInputElement>(null);
	const { location: { pathname } } = useHistory();
	const [hasSaved, setHasSaved] = useState<boolean>(false);

	const [selectedResponsible, setSelectedResponsible] = useState<TOptions | null>(null);

	const isService = pathname.startsWith("/requisicoes/atendimento");
	const status = useSelector(getStatusRequisitions);
	const item = useSelector(getItemRequisitions) as TRequisitionService;
	const hasItem = useSelector(getHasItemRequisitions);
	const { isAdmin } = useCurrentUser("");
	const isSaving = status === "saving";
	const isLoading = status === "fetching";

	const isNew = id === "novo";

	const extensibleObj = cloneDeep(item);
	extensibleObj["sigthObservation"] = "";

	const { userId = 0 } = useCurrentUser("");
	const { usersActivesAsOptionsById } = useUsersActives();
	const { resultsAsOptions } = useResults();
	const processFolderData = useSelector(getProcessFormData);
	const loading = useSelector(getProcessIsFetching);

	const FormSchema = yup.object({
		
		serviceFiles: item?.requestParameter?.processComplement
			? yup.array().required().min(1, t("required"))
			: yup.array().notRequired(),
	});


	useEffect(() => {
		if (id && !isNew)
			dispatch(
				getRequisitionForServiceById({
					id,
					responsibleUserId: userId,
					serviceRequisition: isService,
				})
			);
	}, [dispatch, id, isNew, userId, isService]);

	useRegisterDefault({
		action: "requisitions",
		getStatus,
		getErrorMessage,
	});

	const notAllowedToEdit = [
		STATUS.APPROVED_DEFINITIVE,
		STATUS.REJECTED_DEFINITIVE,
		STATUS.CANCELLED,
	].includes(item.status);

	const isValid =
		item.logs?.filter((x: { statusFlowId: number }) => x.statusFlowId === 3)[0]
			?.observation === item.observation;

	const initialValues: TRequisitionService = useMemo(() => {
		const initialValues = {
			...item,
			conclusionDate: null,
			isAttachmentLegalOne: "",
			emailsWithInternalCopiesMultiple: [],
			status: -1,
			observation: "",
			files: [] as any,
			serviceFiles: [] as any ,
			initialStatus: item.status,
			serviceUserName: item?.serviceUser?.name ?? null,
			description: item?.description,
		} as TRequisitionService;
		return { ...fillIfValue<TRequisitionService>(item, initialValues) };
	}, [item]);

	const closeWindow = () => {
		return close();
	}

	const handleDelete = (file: any) => {
        file?.id && dispatch(deleteFilesRequisition(file.id));
    };

	const onSubmit = async (values: TRequisitionService) => {
		setHasSaved(true);
		if (values.responsibleUserId !== item.responsibleUserId) {
			values.status = STATUS.REQUESTED;
			values.initialStatus = STATUS.REQUESTED;
		}

		if (selectedResponsible) values.responsibleName = selectedResponsible.label;
		
		if (values.emailsWithInternalCopiesMultiple?.length) {
			values.emailsWithInternalCopies = values.emailsWithInternalCopies + values.emailsWithInternalCopiesMultiple.join(";");
		}

		delete values.emailsWithInternalCopiesMultiple;

		values.isService = true;

		const normalizedValues = {
			...(valuesToNumber(
				[
					"salary",
				],
				values
			) as TRequisitionService),
		};

		if(normalizedValues.complainant && normalizedValues.salary === 0){
			return enqueueSnackbar("O valor do campo Salário deve ser maior que zero", {
				variant: "error",
			})
		}

		const {type} = await dispatch(
			editRequisitions(
				omit(["conclusionDate"], {
					...normalizedValues,
					files: values.serviceFiles,
					serviceUserId: userId,
					serviceUserName: name,
					type: ATTACHMENT_TYPE.SERVICE,
					status: values.status,
					id: Number(id),
				}) as TRequisitionService
			)
		) as any;

		if(type === "requisitions/edit/fulfilled") {
			setTimeout(closeWindow, 2000);
		}
	};

	const validate = useCallback(
		(values: TRequisitionService) => {
			const errors: Record<string, string> = {};
			if (values.responsibleUserId === item.responsibleUserId) {
				if (isValid) {
					if (!values.sigthObservation)
						errors.sigthObservation = "Campo obrigatório";
				} else {
					if (!values.observation) errors.observation = "Campo obrigatório";
				}
				const status = values.status as STATUS;
				if (
					status !== STATUS.REJECTED_DEFINITIVE &&
					status !== STATUS.APPROVED_DEFINITIVE &&
					status !== STATUS.IN_REVIEW &&
					status !== STATUS.REQUESTED &&
					status !== STATUS.CANCELLED &&
					status !== STATUS.RETURNED
				)
					errors.status = "Campo obrigatório";

				if (values.isAttachmentLegalOne === "")
					errors.isAttachmentLegalOne = "Campo obrigatório";
			} else {
				if (
					!values.sigthObservation !== !item.sigthObservation ||
					values.observation !== item.observation ||
					values.status !== item.status ||
					values.isAttachmentLegalOne !== item.isAttachmentLegalOne
				) {
					if (isValid) {
						if (!values.sigthObservation)
							errors.sigthObservation = "Campo obrigatório";
					} else {
						if (
							!values.observation &&
							(values.status === 1 ||
								values.status === 0 ||
								values.status === 6)
						) {
							errors.observation = "Campo obrigatório";
						}
					}

					const status = (values.status as STATUS) || "";
					if (status === "") errors.status = "Campo obrigatório";

					if (values.isAttachmentLegalOne === "")
						errors.isAttachmentLegalOne = "Campo obrigatório";
				}
			}
			return errors;
		},
		[
			isValid,
			item.isAttachmentLegalOne,
			item.observation,
			item.responsibleUserId,
			item.sigthObservation,
			item.status,
		]
	);

	useEffect(() => {
			item?.folderNumber && dispatch(fetchProcessFolder({ folderNumber: item.folderNumber }))
		}, [dispatch, item?.folderNumber])

	if (!hasItem && !isLoading) return null;
	return (
		<ScreenTemplate>
			{isLoading ? (
				<CircularProgress className="margin-top-16 align-center" />
			) : (
				<div ref={wrapperRef}>
					<Form
						enableReinitialize
						initialValues={initialValues}
						onSubmit={onSubmit}
						validate={validate}
						permission={isLoading || notAllowedToEdit ? false : "edit"}
						validationSchema={FormSchema}

					>
						{({ handleSubmit, isSubmitting, dirty, values, setSubmitting }) => {
							const { requestType, hoursDeadline, responsibleType } =
								values?.requestParameter ?? {};

							const inEmail = values.emailsWithInternalCopies
								? values.emailsWithInternalCopies.split(";")
								: [];

							const inEmailOptions = inEmail.map((item) => ({
								value: item,
								label: item,
							}));

							const exEmail = values.emailsWithExternallCopies
								? values.emailsWithExternallCopies.split(";")
								: [];
							const exEmailOptions = exEmail.map((item) => ({
								value: item,
								label: item,
							}));
							return (
								<form noValidate onSubmit={handleSubmit}>
									<Panel
										title={t('requisitions:form.newRequisition')}
										withPadding
									>
										<Grid container spacing={3}>
											<Grid item md={3} xs={12}>
												<NumericField
													name="folderNumber"
													label={t("requisitions:CTGFolder")}
													readOnly
												/>
											</Grid>
											<Grid item md={9} xs={12}>
												<FieldColumn
													label={t("requisitions:form.requisitionType")}
													value={requestType}
												/>
											</Grid>
												</Grid>
									</Panel>
										<ProcessFormData processData={processFolderData} loading={loading} full />
									<Panel
										title={t("requisitions:form.requisitionData")}
										withPadding
									>
										<Grid container spacing={3}>
											<Grid item md={3} xs={12}>
												<DateField
													name="requestDate"
													label={t("requisitions:form.requisitionDate")}
													readOnly
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<FieldColumn
													label={t("requisitions:form.attendanceDeadline")}
													value={`${hoursDeadline} horas`}
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<DateField
													name="expectedServiceDate"
													label={t("requisitions:form.expectedServiceDate")}
													readOnly
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<SelectField
													name="initialStatus"
													label={t("status")}
													options={statusTextAsOptions}
													readOnly
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<FieldColumn
													label={"Solicitante"}
													value={initialValues.createdBy}
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<FieldColumn
													label={t("requisitions:form.serviceResponsible")}
													options={resposibleAsOptions}
													type="list"
													value={responsibleType}
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												{responsibleType ===
												RESPONSIBLE_TYPE.ADMINISTRATIVE_CONTROL ? (
													<FieldColumn
														label={t("settings:requestParameters.form.administrativeControl")}
														value={handleAdministrativeControl(
															values.status,
															values.administrativeControlResponsiblesIds,
															values.responsiblesInService,
															usersActivesAsOptionsById,
															"|"
														)}
													/>
												) : !isAdmin ? (
													<TextField
														label={t("requisitions:form.responsibleName")}
														name="responsibleName"
														readOnly
													/>
												) : item?.status === STATUS.IN_REVIEW ||
												  item?.status === STATUS.REQUESTED ? (
													<UserField
														label={t("requisitions:form.responsibleName")}
														name="responsibleUserId"
														onlyActive
														onChange={setSelectedResponsible}
													/>
												) : (
													<UserField
														label={t("requisitions:form.responsibleName")}
														name="responsibleName"
														onlyActive
														onChange={setSelectedResponsible}
													/>
												)}
											</Grid>
											<Grid
												item
												md={responsibleType !== RESPONSIBLE_TYPE.NONE ? 3 : 6}
												xs={12}
											>
												<SelectField
													name="resultReport"
													label={t("requisitions:form.informResult")}
													options={resultsAsOptions}
													readOnly
												/>
											</Grid>
											<Grid item md={12} xs={12}>
												<FieldColumn
													multiline
													label={t("requisitions:form.description")}
													value={values.description}
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<FieldColumn
													label={t("requisitions:form.emailsWithInternalCopies")}
													options={inEmailOptions}
													value={inEmail}
													type="list"
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<FieldColumn
													label={t("requisitions:form.emailsWithExternallCopies")}
													options={exEmailOptions}
													value={exEmail}
													type="list"
												/>
											</Grid>
											<Grid item md={3} xs={12}>
												<RadioGroup
													label={t("requisitions:form.forwardAttachmentEmail")}
													name="forwardAttachmentEmail"
													readOnly
												/>
											</Grid>
										</Grid>
									</Panel>
									<Attachments
										disabled={true}
										name="files"

									/>
									<ServiceRequestForm
										item={{ ...extensibleObj }}
										serviceName={name}
										hasSaved={hasSaved}								
									/>
									<Attachments 
									name="serviceFiles"
									label="Anexos atendimento"
									onDelete={handleDelete} 
									panelConfig={{
										slotBottomRight: notAllowedToEdit ? (
											false
										) : (
											<Submit
												isNew={isNew}
												submitting={isSubmitting || isSaving}
												disabled={!dirty}
											/>
										),
										slotBottonRightPermission: "edit",
									}}
									onClickCancel={() => {}}
									/>							
									<Logs
										logs={item.logs}
										statuses={statusText}
										statusOrder={["flow"]}
									/>
									{status === "failure" && isSubmitting && setSubmitting(false)}
								</form>
							);
						}}
					</Form>
				</div>
			)}
		</ScreenTemplate>
	);
};

export default RequisitionsForm;
