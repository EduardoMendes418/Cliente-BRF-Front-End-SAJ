import { useMemo, useCallback, useState, useEffect } from "react";
import { Box, Grid } from "@material-ui/core";
import { omit } from "ramda";
import { useSelector, useDispatch } from "react-redux";
import FieldColumn from "src/components/FieldColumn";
import Panel from "src/components/Panel";
import { getItemRequestParameters } from "src/core/store/modules/request-parameters/selectors";
import { t } from "src/locale/i18n";
import * as yup from "yup";
import { useHistory, useParams } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { FormHelperText } from "@material-ui/core";
import moment from "moment";

import { DateField, TextField } from "src/components/form";

import { Button, Submit } from "src/components/button";
import Logs from "src/components/Logs";
import uniqBy from "lodash/uniqBy";

import Form, {
	Upload,
	RadioGroup,
	SelectField,
	CheckboxesAutocompleteField,
} from "src/components/form";
import {
	COUNT_DEADLINE,
	RESPONSIBLE_TYPE,
	resposibleAsOptions,
} from "src/screen/settings/general/request-parameters/constants";
import {
	FolderNumber,
	TRequisitionForm,
	TRequisitionService,
} from "src/core/models/requisitions";
import { useResults, useUsersActives } from "src/hooks/fetchLists";
import {
	addRequisitions,
	cancelRequisition,
	editRequisitions,
	getResponsibleEmails,

} from "src/core/store/modules/requisitions/thunks";
import { fillIfValue } from "src/core/utils/func";
import {
	getErrorMessageRequisitions,
	getHasItemRequisitions,
	getItemRequisitions,
	getStatusRequisitions,
	getExpectedServiceDateRequisitions,
} from "src/core/store/modules/requisitions/selectors";
import { useRegisterDefault } from "src/hooks";
import {
	getHasFolder,
	getProcessFolder,
} from "src/core/store/modules/process/selectors";
import { useCurrentUser } from "src/config/permissions";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { STATUS_FOLDER_NUMBER } from "src/screen/settings/general/request-parameters/constants";

import ServiceRequestForm from "../../components/ServiceRequestForm";
import { ATTACHMENT_TYPE, STATUS, statusText } from "../../constants";
import { useSnackbar } from "notistack";
import api from "src/core/api/non-working-days";
import { handleAdministrativeControl } from "../../utils";
import { FormikHelpers } from "formik";
import ResponsibleBlock from "./ResponsibleBlock";

type Props = {
	folderNumber?: FolderNumber;
	loading: boolean;
	isNew: boolean;
};

const RequisitionForm = ({ isNew, folderNumber, loading }: Props) => {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	
	const {
		location: { pathname },
	} = useHistory();

	const { id: userLoggedId, name: userLoggedName } =
		useSelector(getDataCurrentUser);
	const item = useSelector(getItemRequisitions);
	const hasItem = useSelector(getHasItemRequisitions);
	const statusSubmit = useSelector(getStatusRequisitions);
	const hasFolder = useSelector(getHasFolder);
	
	const [showActiveMsg, setShowActiveMsg] = useState<boolean>();
	const isRequest = pathname.startsWith("/requisicoes/requisicoes");
	
	const isRequester = item?.requesterName === userLoggedName;
	const isReturned = item?.status === STATUS.RETURNED
	const allowEdit = isRequester && isRequest && isReturned; 

	const editOrCreate = hasItem && !allowEdit;

	const {
		agent,
		agentId,
		internalLawyer,
		internalLawyerId,
		officeResponsible,
		officeResponsibleId,
		processParties,
		juridicalResponsible,
		officeResponsibleIsActive,
		id: processId,
	} = useSelector(getProcessFolder);
	const expectedServiceDate = useSelector(getExpectedServiceDateRequisitions);

	const {
		usersActivesAsOptionsByEmail,
		usersActivesAsOptionsById,
		usersActivesAsOptionsByBrfId,
	} = useUsersActives();
	const { userId, currentScreenPermissions } = useCurrentUser(id);
	const { accounts } = useMsal();
	const { resultsAsOptions } = useResults();
	const { enqueueSnackbar } = useSnackbar();
	const [nonWorkingDays, setNonWorkingDays] = useState<string[]>();
	const [userVerifiedName, setUserVerifiedName] = useState<string[]>();
	const [emails, setEmails] = useState<string[]>();
	const requestParameter = useSelector(getItemRequestParameters);
	const { isAdmin } = useCurrentUser("");

	const emailOptions = useMemo(
		() => uniqBy(usersActivesAsOptionsByEmail, "value"),
		[usersActivesAsOptionsByEmail]
	);

	const isWorkingDay = async () => {
		const response = await api.list({ notPaginate: true });
		setNonWorkingDays(response.data.items.map((x: any) => x.date.slice(0, 10)));
	};

	const whenResponsibleIsInactive =
		usersActivesAsOptionsById.filter((x) => x.value === item.responsibleUserId)
			.length === 0
			? usersActivesAsOptionsById.concat({
					label: item.responsibleName,
					value: item.responsibleUserId,
			})
			: null;

	useRegisterDefault({
		action: "requisitions",
		getStatus: getStatusRequisitions,
		getErrorMessage: getErrorMessageRequisitions,
	});

	const {
		hoursDeadline,
		description,
		id: requestParameterId,
		responsibleType,
		resultReport,
		folderNumberRequired,
		countDeadline,
		administrativeControlResponsiblesIds,
		attachmentRequired,
	} = item.requestParameter || requestParameter;

	const getEmails = async () => {
		if(folderNumber?.folderNumber === undefined || processId === undefined || requestParameterId === undefined){ 
			
		return
	
	} else {
		const { payload } = await dispatch(getResponsibleEmails({ processId: processId, requestParameterId: Number(requestParameterId)})) as any;
		setEmails(payload)
		return 

	}
	} 

	useEffect(() => {
		getEmails()
	}, [folderNumber, requestParameterId, processId]);  

	useEffect(() => {
		getEmails()
	}, [folderNumber, requestParameterId, processId]); 

	const validate = ({ folderNumbers }: any) => {
		if (folderNumberRequired && folderNumbers.length === 0)
			return {
				folderNumbers: t("requisitions:form.folderRequired"),
			};
	};

	const verifyUserIsActive = useCallback(
		(userId: number | string | null): number => {
			const activeUser = userId === null ? undefined : usersActivesAsOptionsByBrfId.find(
				(el) => el.value === Number(userId) || el.group === Number(userId)
			);
			const show =
				Boolean(activeUser === undefined) &&
				Boolean(
					folderNumberRequired !== false
						? officeResponsibleIsActive !== undefined
						: true
				) &&
				Boolean(usersActivesAsOptionsByBrfId.length > 0);
			setShowActiveMsg(!show);

			if (id === "novo") {
				show &&
					enqueueSnackbar(
						"Responsável pelo atendimento não ativo no sistema, favor solicitar alteração do responsável ou indique manualmente nesse andamento",
						{ variant: "warning" }
					);
			}
			return activeUser ? activeUser.group : 0;
		},
		
		[
			usersActivesAsOptionsByBrfId,
			officeResponsibleIsActive,
			id,
			enqueueSnackbar,
		]
	);

	const verifyUserId = useMemo(() => {
		const userIdVerified: number[] = [];
		const userVerifiedName: string[] = [];
		if (responsibleType === RESPONSIBLE_TYPE.NONE) {
			return userIdVerified;
		}

		if (responsibleType === RESPONSIBLE_TYPE.INTERNAL_LAWYER) {
			const validadeId = verifyUserIsActive(internalLawyerId);
			if (validadeId) userIdVerified.push(validadeId);
		}
		if (responsibleType === RESPONSIBLE_TYPE.OFFICE_MANAGER) {
			const validadeId = verifyUserIsActive(officeResponsibleId);
			if (validadeId) userIdVerified.push(validadeId);
		}
		if (responsibleType === RESPONSIBLE_TYPE.AGENT) {
			const validadeId = verifyUserIsActive(agentId);
			if (validadeId) userIdVerified.push(validadeId);
		}

if (
	(responsibleType === RESPONSIBLE_TYPE.ADMINISTRATIVE_CONTROL ||
		responsibleType === RESPONSIBLE_TYPE.REQUESTER) &&
	requestParameter.administrativeControlResponsiblesIds
) {
	const filteredArray = usersActivesAsOptionsById.filter((object) => {
		const propertyValue = object.value;
	
		return requestParameter.administrativeControlResponsiblesIds?.includes(propertyValue);
	}); 

	const filteredIds = filteredArray.map((x) => x.value)

	for(const id of filteredIds){
		userIdVerified.push(id)
	}
}

		if (responsibleType === RESPONSIBLE_TYPE.CUSTOM) {
			const validadeId = verifyUserIsActive(
				Number(requestParameter!.responsibleUserId!)
			);
			if (validadeId) userIdVerified.push(validadeId);
		}

		if (responsibleType === RESPONSIBLE_TYPE.LEGAL_RESPONSIBLE) {
			const responsible = processParties?.find(
				(el) => el.situation === "Responsável"
			);

			if (responsible) {
				const validadeId = verifyUserIsActive(responsible.contactId);
				if (validadeId) userIdVerified.push(validadeId);
			}
		}

		setUserVerifiedName(userVerifiedName);

		return userIdVerified;
	}, [
		responsibleType,
		verifyUserIsActive,
		internalLawyerId,
		officeResponsibleId,
		agentId,
		requestParameter,
		processParties,
		usersActivesAsOptionsById,
	]);

	const responsibleTypeCustom = usersActivesAsOptionsById.filter(
		(x) => x.value === verifyUserId[0]
	)[0]?.label;

	const getResponsibleName = useCallback(() => {
		switch (responsibleType) {
			case RESPONSIBLE_TYPE.INTERNAL_LAWYER:
				return internalLawyer;
			case RESPONSIBLE_TYPE.LEGAL_RESPONSIBLE:
				return juridicalResponsible;
			case RESPONSIBLE_TYPE.OFFICE_MANAGER:
				return officeResponsible;
			case RESPONSIBLE_TYPE.AGENT:
				return agent;
			case RESPONSIBLE_TYPE.REQUESTER:
				return userLoggedName;
			case RESPONSIBLE_TYPE.CUSTOM:
				return responsibleTypeCustom;
			default:
				return "";
		}
	}, [
		agent,
		internalLawyer,
		juridicalResponsible,
		officeResponsible,
		responsibleType,
		responsibleTypeCustom,
		userLoggedName,
	]);

	const closeWindow = () => {
		return close();
	}

	const cancelRequest = async () => {
		const {payload, type} = await dispatch(cancelRequisition(Number(item.id))) as any;
	
		if(payload[0].status === 200) {
			setTimeout(closeWindow, 2000);
		}
	};

	useEffect(() => {
		isWorkingDay();
	}, []);

	const initialValues = useMemo(() => {
		let defaultInitialValues = {
			status: STATUS.REQUESTED,
			requestDate: moment().format("YYYY-MM-DD"),
			forwardAttachmentEmail: false,
			emailsWithInternalCopies: isNew === true ? emails : "",
			emailsWithExternallCopies: "",
			requestParameterId,
			files: [] as any,
			serviceFiles: [] as any, 
			folderNumbers: folderNumber ? [folderNumber] : [],
			resultReport: "",
			complainant: null,
			observation: "",
			serviceUserName: "",
			responsibleName: !editOrCreate
				? getResponsibleName()
				: responsibleType === RESPONSIBLE_TYPE.ADMINISTRATIVE_CONTROL
				? userVerifiedName?.sort()?.toString()?.replaceAll(",", ", ")
				: item.responsibleName,
			description: description,
			expectedServiceDate: countDeadline === COUNT_DEADLINE.MANUAL ? "" : expectedServiceDate,
			administrativeControlResponsiblesIds: responsibleType === RESPONSIBLE_TYPE.NONE,
			responsibleUserId: "",
		} as unknown as TRequisitionForm;

		if (editOrCreate && item.status !== STATUS.REQUESTED) {
			const {
				isAttachmentLegalOne,
				observation,
				serviceUser,
				conclusionDate,
				sigthObservation,
			} = item as any;
			defaultInitialValues = {
				...defaultInitialValues,
				sigthObservation,
				observation,
				conclusionDate,
				isAttachmentLegalOne,
				serviceUserName: serviceUser?.name ?? "",
			} as any;
		}

		if (
			usersActivesAsOptionsByBrfId.length &&
			usersActivesAsOptionsById.length
		) {
			const userIds = verifyUserId;

			if (responsibleType === RESPONSIBLE_TYPE.NONE) {
				(defaultInitialValues as any)["responsibleUserId"] = userId;
			} else if (
				userIds.length &&
				responsibleType !== RESPONSIBLE_TYPE.ADMINISTRATIVE_CONTROL
			) {
				(defaultInitialValues as any)["responsibleUserId"] = userIds[0];
			} else {
				defaultInitialValues["administrativeControlResponsiblesIds"] = [
					...userIds,
				];
			}
		}

		return {
			...fillIfValue<TRequisitionForm>(
				{
					...item,
					folderNumbers: item?.folderNumber
						? [{ folderNumber: item.folderNumber }]
						: [],
					requestParameterId: item?.requestParameter?.id,
					resultReport: item?.resultReport === 0 ? "" : item?.resultReport,
					responsibleName:
						id !== "novo" ? item.responsibleName : item?.serviceUser?.name,
				},
				defaultInitialValues
			),
		};
	}, [
		requestParameterId,
		folderNumber,
		editOrCreate,
		getResponsibleName,
		responsibleType,
		userVerifiedName,
		item,
		description,
		countDeadline,
		expectedServiceDate,
		administrativeControlResponsiblesIds,
		usersActivesAsOptionsByBrfId.length,
		usersActivesAsOptionsById.length,
		id,
		verifyUserId,
		userId,
		emails,
	]);

	let isResponsibleFieldBlocked = false;
	if (
		(responsibleType === RESPONSIBLE_TYPE.NONE &&
			RESPONSIBLE_TYPE.INTERNAL_LAWYER &&
			RESPONSIBLE_TYPE.LEGAL_RESPONSIBLE &&
			RESPONSIBLE_TYPE.OFFICE_MANAGER &&
			RESPONSIBLE_TYPE.AGENT) ||
		(responsibleType === RESPONSIBLE_TYPE.CUSTOM &&
			(initialValues as any)["responsibleUserId"])
	)
		isResponsibleFieldBlocked = true;

	if (
		!requestParameterId ||
		loading ||
		(isNew && folderNumberRequired && !hasFolder)
	)
		return null;

	const RequisitionFormSchema = yup.object({
		expectedServiceDate: yup
			.string()
			.required(t("requisitions:form.expectedServiceDateRequired"))
			.nullable(),
		files: attachmentRequired
			? yup.array().required().min(1, t("required"))
			: yup.array(),
	});

	const showServiceRequestForm = !isNew && item.status !== STATUS.REQUESTED;

	const showCancelRequestButton =
		editOrCreate &&
		item.status === STATUS.REQUESTED &&
		currentScreenPermissions.edit &&
		(isAdmin || accounts[0].username === item.requesterEmail);

	const disableDays = (date: Date) => {
		const dayOfWeek = moment(date).day();
		const formattedDay = moment(date).format("YYYY-MM-DD");
		const isWeekend =
			dayOfWeek === 0 ||
			dayOfWeek === 6 ||
			nonWorkingDays?.includes(formattedDay);

		return isWeekend;
	};

	const sendResponsibleUserIdNull = isResponsibleFieldBlocked || showServiceRequestForm || showActiveMsg || showActiveMsg !== false;

	const handleSubmitForm = (values: any, 
		{ setSubmitting }: FormikHelpers<any>) => {

		if(sendResponsibleUserIdNull === true){
			values["responsibleUserId"] = null
		}

		const arrayOfFilesLength: number[] = [];
			values?.files.forEach((file: any) => {
				arrayOfFilesLength.push(file?.name.length)
			})
			if(arrayOfFilesLength.some(number => number > 119)){
				setSubmitting(false)
				enqueueSnackbar(
					t("goodsAndGuarantees:characterLimiterWarningMessage"),
					{ variant: "error" }
				);
				return
			}

		if (responsibleType === RESPONSIBLE_TYPE.NONE) {
			const selectedUser = usersActivesAsOptionsById.filter(
				(user) => user.value === values.administrativeControlResponsiblesIds
			)[0]?.label;

			values["responsibleName"] = selectedUser;
		}

		if (values?.emailsWithInternalCopies !== "" || undefined)
			values["emailsWithInternalCopies"] =
				values?.emailsWithInternalCopies?.join(";");

		if (values.resultReport === "") values.resultReport = 0; 


		if (!officeResponsibleIsActive) { 
			// eslint-disable-next-line array-callback-return
			// eslint-disable-next-line array-callback-return
			values["folderNumbers"].map((x: any) => {
				if (x.folderNumber.includes("-")) {
					x.folderNumber = x.folderNumber.replace("-", "/");
				}
			});
			const selectedUserId = usersActivesAsOptionsById.filter(
				(user) => user.label === values.responsibleName
			)[0]?.value;

			if (responsibleType === 0) values["responsibleUserId"] = selectedUserId;{
				if(isNew === true){
					dispatch(addRequisitions({...values, status: isRequest === true && values.status === 7 ? 3 : values.status, type: ATTACHMENT_TYPE.REQUEST})); 
					return;
				}
				dispatch(editRequisitions({
					...item,
					status: isRequest === true && values.status === 7 ? 3 : values.status,
					type: ATTACHMENT_TYPE.REQUEST,
					conclusionDate: values.conclusionDate,
					observation: values.observation,
					isAttachmentLegalOne: values.isAttachmentLegalOne,
					serviceUser: values.serviceUser,
					serviceUserName: values.serviceUserName,
					responsiblesInService: values.responsiblesInService,
					description: values?.description,
					emailsWithExternallCopies: values?.emailsWithExternallCopies,
					emailsWithInternalCopies: values?.emailsWithInternalCopies,
					files: values.files,
					resultReport: values.resultReport,
				}));
			
				return;
		
		}
		}
		values = omit(["administrativeControlResponsiblesIds"], { ...values });
		if (responsibleType === RESPONSIBLE_TYPE.NONE && !editOrCreate) {
			const selectedUserId = usersActivesAsOptionsById.filter(
				(user) => user.label === values.responsibleName
			)[0]?.value;

			values["responsibleUserId"] = selectedUserId;
		}

		if (responsibleType === RESPONSIBLE_TYPE.CUSTOM && !editOrCreate) {
			const selectedUserName = usersActivesAsOptionsById.filter(
				(user) => user.value === values.responsibleUserId
			)[0]?.label;
			values["responsibleName"] = selectedUserName;
		}
		if (
			responsibleType === RESPONSIBLE_TYPE.NONE &&
			(requestParameterId === STATUS_FOLDER_NUMBER.TEMPORARY_DISCHARGE ||
				requestParameterId === STATUS_FOLDER_NUMBER.DIED)
		) {
			values["responsibleName"] = userLoggedName;
			values["responsibleUserId"] = userLoggedId;
		}
		// eslint-disable-next-line array-callback-return
		values["folderNumbers"].map((x: any) => {
			if (x.folderNumber.includes("-")) {
				x.folderNumber = x.folderNumber.replace("-", "/");
			}
		});
		if(allowEdit === true){
				dispatch(editRequisitions({...values, type: ATTACHMENT_TYPE.REQUEST}));
					return
		}else{
			dispatch(addRequisitions({...values, status: isRequest === true && values.status === 7 ? 3 : values.status, type: ATTACHMENT_TYPE.REQUEST})); 
		}
		
	};

	return (
		<Form
			enableReinitialize
			initialValues={initialValues}
			validate={validate}
			validationSchema={RequisitionFormSchema}
			onSubmit={handleSubmitForm}
		>
			{({ handleSubmit, values, isSubmitting, setSubmitting }) => (
				<form onSubmit={handleSubmit} noValidate autoComplete="off">
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
										{countDeadline === COUNT_DEADLINE.MANUAL &&
										!editOrCreate /* !hasItem */ ? (
											<DateField
												name="expectedServiceDate"
												label={t("requisitions:form.expectedServiceDate")}
												disableDateFunc={disableDays}
											/>
										) : (
											<FieldColumn
												label={t("requisitions:form.expectedServiceDate")}
												value={
													editOrCreate
														? item.expectedServiceDate
														: expectedServiceDate
												}
												type={"date"}
											/>
										)}
									</Grid>
									<Grid item md={3} xs={12} sm={6}>
										<FieldColumn
											label={t("requisitions:form.status")}
											value={statusText[values.status]}
										/>
									</Grid>
								</Grid>
								{responsibleType !== 7 && (
									<Grid item md={3} xs={12} sm={6}>
										<FieldColumn label={"Solicitante"} value={item.createdBy} />
									</Grid>
								)}
								<Grid item md={3} xs={12} sm={6}>
									<FieldColumn
										label={t("requisitions:form.serviceResponsible")}
										value={resposibleAsOptions[responsibleType].label}
									/>
								</Grid>
								<Grid
									item
									md={
										responsibleType !== 7
											? 3
											: resultReport && item.resultReport !== 0
											? 6
											: 9
									}
									xs={12}
									sm={12}
								>
										{isRequest &&
									responsibleType ===
										RESPONSIBLE_TYPE.ADMINISTRATIVE_CONTROL ? null : (
										<ResponsibleBlock
											responsibleType={responsibleType}
											id={id}
											item={item}
											usersActivesAsOptionsById={usersActivesAsOptionsById}
											showActiveMsg={showActiveMsg}
											isResponsibleFieldBlocked={isResponsibleFieldBlocked}
											showServiceRequestForm={showServiceRequestForm}
											whenResponsibleIsInactive={whenResponsibleIsInactive}
											allowEdit={allowEdit}
										/>
									)}
								</Grid>
								{resultReport && item.resultReport !== 0 && (
									<Grid item md={3} xs={12} sm={12}>
										<SelectField
											name="resultReport"
											label={t("requisitions:form.informResult")}
											options={resultsAsOptions}
											required
											readOnly={
												!!item.resultReport &&
												!(
													isNew === false &&
													item?.requestParameter?.responsibleType === 0 &&
													allowEdit === true
												)
											}
										/>
									</Grid>
								)}
								<Grid item md={12} xs={12} sm={12}>
									<TextField
										multiline
										minRows={8}
										name="description"
										label={t("requisitions:form.description")}
										readOnly={editOrCreate}
										maxLength={2500}
									/>
								</Grid>
								<Grid item xs={12} md={editOrCreate ? 12 : 6}>
									{editOrCreate ? (
										<FieldColumn
											label={t("requisitions:form.emailsWithInternalCopies")}
											value={values?.emailsWithInternalCopies?.replaceAll(
												";",
												", "
											)}
											
										/>
									) : (
										<CheckboxesAutocompleteField
											options={emailOptions}
											label={t("requisitions:form.emailsWithInternalCopies")}
											name="emailsWithInternalCopies"
										/>
									)}
								</Grid>
								<Grid item xs={12} md={editOrCreate ? 12 : 6}>
									<TextField
										name="emailsWithExternallCopies"
										label={t("requisitions:form.emailsWithExternallCopies")}
										placeholder={t("requisitions:form.emailsPlaceholder")}
										helperText={t("requisitions:form.emailsHelperText")}
										readOnly={editOrCreate}
										className={"overrideHelperText-red"}
									/>
								</Grid>
								<Grid item xs={12} md={editOrCreate ? 12 : 6}>
									<RadioGroup
										label={t("requisitions:form.forwardAttachmentEmail")}
										name="forwardAttachmentEmail"
										required
										row
										readOnly={editOrCreate}
									/>
									<FormHelperText style={{ color: "red" }}>
										{t("requisitions:form.forwardAtachmentEmailHelperText")}
									</FormHelperText>
								</Grid>
							</Grid>
						</div>
					</Panel>
					<Panel
						title={t("form.attachments")}
						slotBottomRight={
							!editOrCreate && (
								<Submit text={t("btnSalvarEdicao")} submitting={isSubmitting} />
							)
						}
						slotBottonRightPermission="add"
					>
						<div className="panel-content">
							<Upload
								id="attachments"
								multiple
								name="files"
								disabled={editOrCreate}
							/>
						</div>
					</Panel>
					
					{showServiceRequestForm && (
						<ServiceRequestForm editOrCreate={editOrCreate} item={item as TRequisitionService} readOnly={!item.requestParameter.processComplement} />
					)}
					{
						id !== "novo" === true ? (
							<Panel
						title={"Anexos atendimento"}
					>
						<div className="panel-content">
							<Upload
								id="serviceFiles"
								multiple
								name="serviceFiles"
								disabled={editOrCreate}
							/>
						</div> 
					</Panel>
						) : null
					}
					<Logs
						logs={item.logs ?? []}
						statusOrder={["flow"]}
						statuses={statusText}
					/>
					
					{showCancelRequestButton && (
						<Box display="flex" justifyContent="flex-end" paddingTop={3}>
							<Button
								text={t("requisitions:form.cancelRequest")}
								onClick={cancelRequest}
								submitting={statusSubmit === "saving"}
							/>
						</Box>
					)}
					{statusSubmit === "failure" && isSubmitting && setSubmitting(false)}
				</form>
			)}
		</Form>
	);
};

export default RequisitionForm;
