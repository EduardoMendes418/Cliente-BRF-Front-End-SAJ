import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { partition } from "ramda";
import { Box, Typography, Grid } from "@material-ui/core";
import moment from "moment";
import { useMsal } from "@azure/msal-react";

import Panel from "src/components/Panel";
import Form, {
	CurrencyField,
	DateField,
	SelectField,
	TextField,
	Upload,
} from "src/components/form";
import { modal } from "src/components/modals";
import Logs from "src/components/Logs";
import ActionButtons from "src/components/ActionButtons";
import JustificationModal, { TForm } from "src/components/JustificationModal";
import FieldColumn from "src/components/FieldColumn";
import JustificationDisplay from "src/components/JustificationDisplay";
import { t } from "src/locale/i18n";

import { TAddFiles, TBudget } from "src/core/models/goods-guarantee-estimates";
import {
	TGoodsGuaranteesRequest,
	TGuaranteeFlowInsurance,
} from "src/core/models/goods-guarantee";
import {
	addGoodsGuaranteesEstimates,
	addGoodsGuaranteesEstimatesFiles,
	deleteGoodsGuaranteesEstimatesFile,
	editGoodsGuaranteesEstimates,
} from "src/core/store/modules/goods-guarantee-estimates/thunks";
import { TActors } from "src/core/models/profiles";
import { getEnvironment, valuesToNumber } from "src/core/utils/func";
import {
	editGoodsGuaranteesRequest,
	editGoodsGuaranteesRequestWithouUpdateStatus,
	fetchGoodsGuaranteesRequestById,
	saveAndSendEmail,
	updateGoodsGuaranteesStatusFlow,
	updateGoodsGuaranteesStatusFlowWhenEqualsTwo,
	uploadGoodsGuaranteesFile,
} from "src/core/store/modules/goods-guarantee/thunks";
import { useGuaranteeType } from "src/hooks/fetchLists";

import { getEmailGoodsGuaranteesRequest, getItemGoodsGuaranteesRequest, getSavingGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors";
import { useGoodsAndGuaranteesBudgetsRequestResult } from "src/hooks/goodsAndGuaranteesBudgets";
import { TUpdateStatus } from "src/core/models";
import goodsGuaranteesEstimatesApi from "src/core/api/goods-guarantee-estimates";

import { ACTIONS, ACTIONS_TO_STATUS, customTaskTitleStyle } from "../constants";
import { RECORD_TYPE, statusTextInsurance, STATUS_FLOW } from "../../constants";
import { useGoodsAndGuaranteesBudgets } from "./hooks/goodsAndGuaranteesBudgets";
import { approverScope, requesterScope } from "../../func";
import { useSnackbar } from "notistack";

import FormInsurance from "./Form";
import List from "./List";
import FormEditModal from "./FormEditModal";
import Attachments from "./Attachments";
import { AppDispatch } from "src/core/store";
import { useGoodsAndGuaranteesInsurer } from "src/hooks/goodsAndGuarantees";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { useHistory } from "react-router-dom";

const validate = (values: any) => {
	const { startEffective, endEffective } = values;
	const initialDate = moment(startEffective).startOf("day");
	const finalDate = moment(endEffective).startOf("day");
	if (initialDate.isAfter(finalDate))
		return { endEffective: t("validations.finalDate") };
};

type TTasks = {
	item: TGoodsGuaranteesRequest & TGuaranteeFlowInsurance;
} & TActors;

const isApproved = ({ isApproved }: any) => isApproved;
const fileNotUploaded = ({ file }: any) => !file.id;

const splitListBasedOnAttachments = (list: TBudget[]) => {
	return list.reduce(
		(acc, current) => {
			const [main, secundary] = partition(
				({ isMainFile }) => isMainFile,
				current.files
			);

			acc[0].push({ ...current, files: main });
			acc[1].push({ ...current, files: secundary });
			return acc;
		},
		[[], []] as TBudget[][]
	);
};

const getFilesNotUploaded = (list: TBudget[], isMainFile: boolean) => {
	return list.reduce((acc, current) => {
		const files = current.files
			.filter(fileNotUploaded)
			.map(({ file }) => file) as any;

		if (files.length) acc.push({ id: Number(current.id), isMainFile, files });

		return acc;
	}, [] as TAddFiles[]);
};

const GuaranteeInsuranceBudgets = ({
	item: { statusFlowId, estimates, process, ...item },
	isRequester,
	isApprover,
}: TTasks) => {
	const dispatch = useDispatch<AppDispatch>();

	const {
		budgetList,
		onAddBudget,
		onEditBudget,
		onDeleteBudget,
		onAddAttachment,
		onSelectBudget,
		editDescription,
	} = useGoodsAndGuaranteesBudgets(estimates);

	const { enqueueSnackbar } = useSnackbar();
	const { companiesOptions } = useGoodsAndGuaranteesInsurer();
 	const [valuesToSendOnSave, setValuesToSendOnSave] = useState<any>();
	const emailsGoodsGuaranteesRequest = useSelector(getEmailGoodsGuaranteesRequest);
	const [hasAttachedMainFile, setHasAttachedMainFile] = useState<boolean>(false);
	const data = useSelector(getItemGoodsGuaranteesRequest);
	useGoodsAndGuaranteesBudgetsRequestResult("/bens-e-garantias/fluxo");
	const { guaranteeTypeAsOptions } = useGuaranteeType();
	const guaranteeMethodIdsFiltred = [] as number[];
	const { isAdmin, profileId } = useSelector(getDataCurrentUser);
	const environment = getEnvironment();
	const history = useHistory();

	guaranteeTypeAsOptions.forEach(({ value, label }) => {
		if (
			[
				"RECURSO ORDINÁRIO",
				"RECURSO DA REVISTA",
				"AGRAVO DE INSTRUMENTO",
				"EMBARGOS A SDI"
			].includes(label)
		)
			guaranteeMethodIdsFiltred.push(Number(value));
	});

	const { accounts } = useMsal();

	const isSaving = useSelector(getSavingGoodsGuaranteesRequest);
	const id = Number(item.id);
	const pending =
		statusFlowId === STATUS_FLOW.NONE || (!statusFlowId && statusFlowId !== 0);
	const cancelled = statusFlowId === STATUS_FLOW.REJECTED_DEFINITIVE;
	const finished =
		cancelled || STATUS_FLOW.APPROVED_DEFINITIVE === statusFlowId;
	const returned = [STATUS_FLOW.RETURNED, STATUS_FLOW.RETURNED_DRAFT].includes(
		statusFlowId
	);

	const isSkippable = guaranteeMethodIdsFiltred.includes(
		Number(item.guaranteeTypeId)
	) as boolean;

	const isBudgetApproved =
		finished ||
		[
			STATUS_FLOW.APPROVED_DRAFT,
			STATUS_FLOW.RETURNED_DRAFT,
			STATUS_FLOW.IN_REVIEW_DRAFT,
		].includes(statusFlowId);
	const isBudgetApprovedShowAttachments =
		finished ||
		[
			STATUS_FLOW.APPROVED_DRAFT,
			STATUS_FLOW.RETURNED_DRAFT,
			STATUS_FLOW.IN_REVIEW_DRAFT,
			STATUS_FLOW.IN_REVIEW,
		].includes(statusFlowId);

	if (!isRequester && (pending || statusFlowId === STATUS_FLOW.REQUESTED))
		return null;

	const actionButtons = [
		{
			label: t("goodsAndGuarantees:tasks.cancelRequest"), //Cancelar solicitação
			onClick: () => onJustify(ACTIONS.REJECT_DEFINITIVE, "cancelled"),
			disabled: environment === 'QAS' ? !(isAdmin === true || profileId === 14 || profileId === 15) : !(isAdmin === true || profileId === 7 || profileId === 8),
		},
		{
			label: t("btnSalvarEdicao"),//Salvar
			statuses: [
				STATUS_FLOW.REQUESTED, 
				STATUS_FLOW.RETURNED, 
				STATUS_FLOW.IN_REVIEW, 
				STATUS_FLOW.RETURNED_DRAFT, 
				STATUS_FLOW.IN_REVIEW_DRAFT],
			onClick: !pending ? () => onSaveBudgetAttachments() : null,
			disabled: !budgetList || !budgetList.length,
		},
		{
			label: t("btnRequest"),
			statuses: [STATUS_FLOW.NONE],
			onClick: !pending ? () => onSaveBudgetAttachments() : null,
			disabled: !budgetList || !budgetList.length,
		},
		{
			label: "Salvar",
			statuses: [STATUS_FLOW.APPROVED_DRAFT],
			onClick: !pending ? () => onSaveBudgetAttachmentsWhenStatusFlowIdEqualsFive() : null,
		},
		{
			label: t("goodsAndGuarantees:tasks.submitForReview"), //Submeter para análise
			statuses: [
				STATUS_FLOW.REQUESTED,
				/* STATUS_FLOW.RETURNED, */
				STATUS_FLOW.APPROVED_DRAFT,
				STATUS_FLOW.RETURNED_DRAFT,
			],
		},
		{
			label: t("btnRequest"),
			statuses: [STATUS_FLOW.RETURNED]
		},
		{
			label: t("goodsAndGuarantees:tasks.return"),//Devolver
			statuses: [STATUS_FLOW.IN_REVIEW],
			onClick: () => onJustify(ACTIONS.RETURN, "returned"),
		},
		{
			label: t("goodsAndGuarantees:approve"),//Aprovar
			statuses: [STATUS_FLOW.IN_REVIEW],
			onClick: () => onSaveNewStatusFlow(ACTIONS.APPROVE_DRAFT),
			disabled: !budgetList || !budgetList.find(({ isSelected }) => isSelected),
		},
		{
			label: t("goodsAndGuarantees:tasks.returnDraft"),//Devolver minuta
			statuses: [STATUS_FLOW.IN_REVIEW_DRAFT],
			onClick: () => onJustify(ACTIONS.RETURN_DRAFT, "returned"),
		},
		{
			label: t("goodsAndGuarantees:tasks.approveDraft"),//Aprovar minuta
			statuses: [STATUS_FLOW.IN_REVIEW_DRAFT],
		},
	];

	const validActionButtons = actionButtons.filter(
		({ statuses }) => !statuses || statuses.includes(statusFlowId)
	);

	const validItems = isBudgetApproved
		? budgetList.filter(isApproved)
		: budgetList;

	const [budgetsWithMainAttachments, budgetsWithSecundaryAttachments] =
		splitListBasedOnAttachments(validItems);

	const onEdit = (values: TBudget) => {
		const component = (
			<FormEditModal initialValues={values} onSubmitEdit={onEditBudget} />
		);

		openModal(t("goodsAndGuarantees:tasks.editBudget"), component);
	};

	const onJustify = (
		action: ACTIONS,
		reason: "rejected" | "returned" | "reversed" | "cancelled"
	) => {
		const component = (
			<JustificationModal
				reason={reason}
				onSubmitJustification={(values: TForm) =>
					onSaveNewStatusFlow(action, values)
				}
				moduloId={5}
				reasonType={action === ACTIONS.REJECT_DEFINITIVE ? 1 : 2}
			/>
		);
		let title = t("goodsAndGuarantees:tasks.justificationForCancelRequest");
		if (action === ACTIONS.RETURN)
			title = t("goodsAndGuarantees:tasks.justificationForReturning");
		else if (action === ACTIONS.RETURN_DRAFT)
			title = t("goodsAndGuarantees:tasks.justificationForFinalDraftReturning");

		openModal(title, component);
	};

	const openModal = (title: string, component: React.ReactElement) => {
		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true, fullWidth: true },
		});
	};

	const onSaveBudget = async (
		values: TGuaranteeFlowInsurance,
		action: ACTIONS
	) => {
		const payload = {
			goodsGuaranteesRequestId: id,
			statusFlowId: isSkippable
				? ACTIONS_TO_STATUS.APPROVE_DRAFT
				: ACTIONS_TO_STATUS[action],
			estimates: budgetList
		};

		

		const observationToSend = payload?.estimates?.filter((x: any) => {return x.isApproved === true})

		await dispatch(
			saveAndSendEmail({
				emails: values.emails,
				id,
				statusFlowId: payload.statusFlowId,
			})
		);	
		 await dispatch(addGoodsGuaranteesEstimates({...payload, observation: observationToSend, guaranteeModalityId: data.guaranteeModalityId}));  
	};

	const onDeleteFile = (budgetId: number, file: any) => {
		const fileDoDeleteName = file.name.substring(0, file.name.indexOf('.'))
		const normalizedArray = data.estimates![0].files.map((x) => ({name: x.file.documentName, id: x.file.id}))
		const fileToDeleteId: number = normalizedArray.filter((x) => x.name.includes(fileDoDeleteName) === true)[0].id
		dispatch(deleteGoodsGuaranteesEstimatesFile(fileToDeleteId)); 
	};

	const onSaveSelectedBudget = async () => {
		const selectedBudget = budgetList.find(isApproved);

		if (selectedBudget) {
			const payload = {
				goodsGuaranteesRequestId: id,
				budget: selectedBudget,
			};

			await dispatch(editGoodsGuaranteesEstimates(payload));
		}
	};

	const SaveBudgetEdit = async () => {
		const selectedBudget = budgetList.find(isApproved);
		if (selectedBudget) {
			const { files, ...data } = selectedBudget; 
			await goodsGuaranteesEstimatesApi.edit(data as any); 
		}
	};

	const onSaveBudgetAttachments = async (main = false) => {
		const budgetsFiles = getFilesNotUploaded(budgetList, main);
		if (budgetsFiles.length){
			await dispatch(
				uploadGoodsGuaranteesFile({
					files: budgetsFiles[0].files as any,
					goodsAndGuaranteesId: id,
					isMainFile: isSkippable,
				})
			); 
		}
			const normalizedValues = valuesToNumber<TGuaranteeFlowInsurance>(
				["valueGuarantee"],
				item
			);
			const normalizedToSendOnSave = valuesToNumber<TGuaranteeFlowInsurance>(
				["valueGuarantee"],
				valuesToSendOnSave
			);

			await dispatch(editGoodsGuaranteesRequest({
				  ...normalizedValues,
				  ...valuesToSendOnSave,
				  ...normalizedToSendOnSave,  
			   }))
	};

	const onSaveBudgetAttachmentsWhenStatusFlowIdEqualsFive = async (main = false) => {
		const budgetsFiles = getFilesNotUploaded(budgetList, main);
		if (budgetsFiles.length){
			await dispatch(
				uploadGoodsGuaranteesFile({
					files: budgetsFiles[0].files as any,
					goodsAndGuaranteesId: id,
					isMainFile: isSkippable,
				})
			); 
		}
			const normalizedValues = valuesToNumber<TGuaranteeFlowInsurance>(
				["valueGuarantee"],
				item
			);
			const normalizedToSendOnSave = valuesToNumber<TGuaranteeFlowInsurance>(
				["valueGuarantee"],
				valuesToSendOnSave
			);

			const {type} = await dispatch(editGoodsGuaranteesRequestWithouUpdateStatus({
				  ...normalizedValues,
				  ...valuesToSendOnSave,
				  ...normalizedToSendOnSave,  
			   })) as any;

			   if(type === "goodsGuaranteesRequest/editGoodsGuaranteesRequestWithoutUpdateStatus/fulfilled"){
					history.goBack();
					return enqueueSnackbar("Edição realizada com sucesso!", {
						variant: "success",
			});
			   } else {
					return enqueueSnackbar("Erro ao editar solicitação!", {
						variant: "error",
					})
			   }

	};

	const onSaveNewStatusFlow = async (action: ACTIONS, values?: TForm) => {
		const newStatusFlowId = ACTIONS_TO_STATUS[action];

		 await SaveBudgetEdit();
		let data = { id, statusFlowId: newStatusFlowId } as TUpdateStatus;

		if(statusFlowId === 2){
			const logs = item?.logs !== undefined ? item.logs : []
			if (!logs.length) return null;

	const selectedLog = [...logs]
		.sort(
			(item1, item2) =>
				new Date(item1.occurrenceDate).getTime() -
				new Date(item2.occurrenceDate).getTime()
		)
		.reverse()
		.filter(x => x.rejectionAndReturnReasonsId)
		.find((log) => log.statusFlowId === statusFlowId);

	if (!selectedLog) return null;

		data = {
			...data,
			observation: selectedLog?.observation,
			rejectionAndReturnReasonsId: selectedLog?.rejectionAndReturnReasonsId,
			flowEmails: emailsGoodsGuaranteesRequest
		}
		
		await dispatch(updateGoodsGuaranteesStatusFlowWhenEqualsTwo({...data, statusFlowId: values?.statusApprovalId === 1 && values?.statusFlowId === 2 ? 3 : newStatusFlowId}));
			return
		}

		if (values)
			data = {
				...data,
				observation: values.justification,
				rejectionAndReturnReasonsId: values.rejectionAndReturnReasonsId,
			};
			await dispatch(updateGoodsGuaranteesStatusFlow({...data, statusFlowId: values?.statusApprovalId === 1 && values?.statusFlowId === 2 ? 3 : newStatusFlowId}));
	};

	if (
		statusFlowId === STATUS_FLOW.REJECTED_DEFINITIVE &&
		(!estimates || estimates.length === 0)
	)
		return null;

	const saveAndEnsureFavoriteLogChange = async () => {
	 	await onSaveBudgetAttachments();
		await onSaveNewStatusFlow(ACTIONS.APPROVE_DRAFT, data as any);
		await onSaveSelectedBudget();
	};

	const handleStatusFlow = ({ 
		statusFlowId, 
		isApprovedDraft, 
		isReturnedDraft,
	}: {
		statusFlowId: number, 
		isApprovedDraft: boolean, 
		isReturnedDraft: boolean
	}) => {
		let newStatusFlow: number = -1;

		if (!isSkippable) {
			switch (statusFlowId) {
				case ACTIONS_TO_STATUS.REQUEST:
					newStatusFlow = ACTIONS_TO_STATUS.SUBMIT_REVIEW
				break;
				case ACTIONS_TO_STATUS.SUBMIT_REVIEW: 
					newStatusFlow = ACTIONS_TO_STATUS.APPROVE_DRAFT
				break;
				case ACTIONS_TO_STATUS.APPROVE_DRAFT:
					newStatusFlow = ACTIONS_TO_STATUS.SUBMIT_REVIEW_DRAFT
				break;
				case ACTIONS_TO_STATUS.SUBMIT_REVIEW_DRAFT:
					newStatusFlow = ACTIONS_TO_STATUS.APPROVE_DEFINITIVE
				break;
				default:
			}
	
			if (isApprovedDraft || isReturnedDraft) {

				newStatusFlow = ACTIONS_TO_STATUS.SUBMIT_REVIEW_DRAFT;
			}
		} else {
			if (statusFlowId === -1) 
				newStatusFlow = ACTIONS_TO_STATUS.APPROVE_DRAFT;
			if (statusFlowId === ACTIONS_TO_STATUS.APPROVE_DRAFT) 
				newStatusFlow = ACTIONS_TO_STATUS.APPROVE_DEFINITIVE; 
		} 

		return newStatusFlow;
	}
	
	const onSubmit = async (values: TGuaranteeFlowInsurance, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void } ) => {
		setSubmitting(true)
		const isApprovedDraft = statusFlowId === STATUS_FLOW.APPROVED_DRAFT || isSkippable;
		const isReturnedDraft = statusFlowId === STATUS_FLOW.RETURNED_DRAFT; 

		if (statusFlowId === STATUS_FLOW.APPROVED_DRAFT && hasAttachedMainFile === false && estimates[0]?.files.length === 0) {
			enqueueSnackbar(`Minuta final não anexada. Verifique!`, {
				variant: "error",
			});
			return;
		}

		const normalizedValues = valuesToNumber<TGuaranteeFlowInsurance>(
			["valueGuarantee"],
			values
		);

		if (pending) {
			await onSaveBudget(normalizedValues, ACTIONS.REQUEST as ACTIONS);
		}	else if ([STATUS_FLOW.RETURNED].includes(statusFlowId)) {
			await saveAndEnsureFavoriteLogChange();
		}	else {
			const newStatusFlow = handleStatusFlow({ statusFlowId, isApprovedDraft, isReturnedDraft });			

			const additionalPayload =
				(!isApprovedDraft && !isReturnedDraft) || isSkippable
					? {
							effectiveDate: moment(),
							recordType: values?.statusFlowId ===  1 || newStatusFlow === 1 ? RECORD_TYPE.EFFECTIVE : RECORD_TYPE.REQUEST,
					  }
					: {};

			if (isApprovedDraft) await onSaveBudgetAttachments(true); 
			
			await SaveBudgetEdit();


			const budgetFiles = budgetList?.map((x) => x.files.map((x)=> x.file)).flat(1)

			const payloadToSend = {
				...item,
				...normalizedValues,
				...additionalPayload,
				observation:
					isApprovedDraft ||
					isReturnedDraft ||
					statusFlowId === STATUS_FLOW.IN_REVIEW_DRAFT
						? normalizedValues.observation
						: "",
				id,
				generateLog: {
					id,
					statusFlowId: newStatusFlow,
					observation:
						isApprovedDraft ||
						isReturnedDraft ||
						statusFlowId === STATUS_FLOW.IN_REVIEW_DRAFT
							? normalizedValues.observation
							: "",
				},
				files: budgetFiles ?? item.files
			} 
			await dispatch(
				editGoodsGuaranteesRequest(payloadToSend)
			);   
		}
		setSubmitting(false)
	};

	const handleUpload = async  (event: ChangeEvent) => {
		const { files } = event.target as HTMLInputElement
		if (!item.id || !files)
			return

		const {meta, status} = await goodsGuaranteesEstimatesApi.uploadFiles(estimates![0].id, true, files) as any
		dispatch(fetchGoodsGuaranteesRequestById(Number(item.id))); 
		if(status === 200){
			setHasAttachedMainFile(true)
		}
		if (meta.requestStatus === "rejected")
			enqueueSnackbar(t('uploadError'), { variant: 'error' })
	};

	const initialValues = {
		id,
		statusFlowId,
		insuranceCompanyId: item.insuranceCompanyId || "",
		policyNumber: item.policyNumber || "",
		endorsementNumber: item.endorsementNumber || "",
		emissionDate: item.emissionDate || null,
		startEffective: item.startEffective || null,
		endEffective: item.endEffective || null,
		valueGuarantee: item.valueGuarantee || "",
		emails: item.emails ?? "",
		observation: item.observation || "",
	};

	let budgetApprover =
		item.logs
			?.slice()
			?.reverse()
			.find(({ statusFlowId }) => statusFlowId === STATUS_FLOW.APPROVED_DRAFT)
			?.userName ?? "";
	if (statusFlowId === STATUS_FLOW.IN_REVIEW) {
		budgetApprover = accounts[0].name ?? "";
	}

	let finalDraftApprover =
		item.logs
			?.slice()
			?.reverse()
			.find(
				({ statusFlowId }) => statusFlowId === STATUS_FLOW.APPROVED_DEFINITIVE
			)?.userName ?? "";
	if (statusFlowId === STATUS_FLOW.IN_REVIEW_DRAFT) {
		finalDraftApprover = accounts[0].name ?? "";
	}

	return (
		<Form
			initialValues={initialValues}
			onSubmit={onSubmit}
			validate={validate}
			enableReinitialize
			permission={
				!finished &&
				((isRequester && requesterScope(statusFlowId)) ||
					(isApprover && approverScope(statusFlowId)))
			}
		>
			{({ handleSubmit, submitForm, status: statusForm, values}) => (
				<>
					<Panel title={t("goodsAndGuarantees:tasks.title")} withPadding>
						{setValuesToSendOnSave(values)}
						{pending && (
							<Grid container spacing={3}>
								<Grid item md={6} xs={12}>
									<TextField
										name="emails"
										label={t("goodsAndGuarantees:formFlow.emails")}
										helperText={t("goodsAndGuarantees:formFlow.emailsHelperText")}
									/>
								</Grid>
							</Grid>
						)}

						{budgetApprover && (
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<FieldColumn
										label={t("goodsAndGuarantees:formFlow.budgetApprover")}
										value={budgetApprover}
									/>
								</Grid>
								{finalDraftApprover && (
									<Grid item md={3} xs={12}>
										<FieldColumn
											label={t("goodsAndGuarantees:formFlow.finalDraftApprover")}
											value={finalDraftApprover}
										/>
									</Grid>
								)}
							</Grid>
						)}

						<Box mt={2}>
							<Typography variant="h4" style={customTaskTitleStyle}>
								{[
									STATUS_FLOW.APPROVED_DRAFT,
									STATUS_FLOW.IN_REVIEW_DRAFT,
									STATUS_FLOW.APPROVED_DEFINITIVE,
								].includes(statusFlowId)
									? t("goodsAndGuarantees:tasks.draft")
									: t("goodsAndGuarantees:tasks.draftRequest")}
							</Typography>
						</Box>

						{pending && <FormInsurance onAdd={onAddBudget} />}
						<List
							budgetList={validItems}
							onEdit={pending ? onEdit : undefined}
							onDelete={pending ? onDeleteBudget : undefined}
							onAttach={
								isRequester &&
								[STATUS_FLOW.REQUESTED, STATUS_FLOW.RETURNED].includes(
									statusFlowId
								)
									? onAddAttachment
									: undefined
							}
							onSelectRadio={
								isApprover && statusFlowId === STATUS_FLOW.REQUESTED
									? onSelectBudget
									: undefined
							}
							statusFlowId={statusFlowId}
							editDescription={editDescription}
						/>
						{isBudgetApprovedShowAttachments && (
							<Box mt={3}>
								<Formik
									initialValues={{
										attachments: budgetsWithMainAttachments[0]
											? budgetsWithMainAttachments[0].files.map(
													({ file }) => file
											)
											: [],
									}}
									onSubmit={() => {}}
									enableReinitialize
								>
									<Upload
										id="insurence-final-file-upload"
										name="attachments"
										text={t("goodsAndGuarantees:tasks.addFinalDraft")}
										fileNameLengthLimiter={true}
										onUploadAfterChanges={handleUpload}
										onDelete={(file) =>
											onDeleteFile(Number(validItems[0].id), file)
										}
										multiple
										disabled={
											!isRequester ||
											![
												STATUS_FLOW.APPROVED_DRAFT,
												STATUS_FLOW.RETURNED_DRAFT,
											].includes(statusFlowId) ||
											statusForm === "readOnly"
										}
									/>
								</Formik>
							</Box>
						)}
						{isBudgetApproved && (
							<>
								<br />
								<br />
								<form noValidate onSubmit={handleSubmit}>
									<Grid container spacing={3}>
										<Grid item md={3} xs={12}>
											<SelectField
												name="insuranceCompanyId"
												label={"Seguradora"}
												readOnly={
													![
														STATUS_FLOW.APPROVED_DRAFT,
														STATUS_FLOW.RETURNED_DRAFT,
													].includes(statusFlowId)
												}
												options={companiesOptions}
												required
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<TextField
												name="policyNumber"
												label={t("goodsAndGuarantees:formFlow.policyNumber")}
												required
												placeholder={t("form.typeHere")}
												readOnly={
													![
														STATUS_FLOW.APPROVED_DRAFT,
														STATUS_FLOW.RETURNED_DRAFT,
													].includes(statusFlowId)
												}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<TextField
												name="endorsementNumber"
												label={t("goodsAndGuarantees:formFlow.endorsementNumber")}
												required
												placeholder={t("form.typeHere")}
												readOnly={
													![
														STATUS_FLOW.APPROVED_DRAFT,
														STATUS_FLOW.RETURNED_DRAFT,
													].includes(statusFlowId)
												}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<DateField
												name="emissionDate"
												label={t("goodsAndGuarantees:emissionDate")}
												required
												readOnly={
													![
														STATUS_FLOW.APPROVED_DRAFT,
														STATUS_FLOW.RETURNED_DRAFT,
													].includes(statusFlowId)
												}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<DateField
												name="startEffective"
												label={t("goodsAndGuarantees:form.startDate")}
												required
												readOnly={
													![
														STATUS_FLOW.APPROVED_DRAFT,
														STATUS_FLOW.RETURNED_DRAFT,
													].includes(statusFlowId)
												}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<DateField
												name="endEffective"
												label={t("goodsAndGuarantees:form.finishDate")}
												required
												readOnly={
													![
														STATUS_FLOW.APPROVED_DRAFT,
														STATUS_FLOW.RETURNED_DRAFT,
													].includes(statusFlowId)
												}
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<TextField
												name="observation"
												label="Observações"
												placeholder={t("form.typeHere")}
												required
												readOnly={
													![
														STATUS_FLOW.APPROVED_DRAFT,
														STATUS_FLOW.RETURNED_DRAFT,
													].includes(statusFlowId)
												}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<CurrencyField
												name="valueGuarantee"
												required
												label={t("goodsAndGuarantees:formFlow.valueGuarantee")}
												readOnly={statusFlowId === STATUS_FLOW.IN_REVIEW_DRAFT}
											/>
										</Grid>
									</Grid>
								</form>
							</>
						)}
					</Panel>
					{!pending && (
						<Attachments
							budgetList={budgetsWithSecundaryAttachments}
							insurence={item.insuranceCompany}
							onDeleteAttachment={onDeleteFile}
							disabled={
								![STATUS_FLOW.REQUESTED, STATUS_FLOW.RETURNED].includes(
									statusFlowId
								)
							}
						/>
					)}
					{(cancelled || returned) && (
						<JustificationDisplay
							logs={item.logs}
							status={statusFlowId}
							type={cancelled ? "cancelled" : "returned"}
							moduloId={5}
						/>
					)}
					<Logs
						logs={item.logs}
						statuses={statusTextInsurance}
						statusOrder={["flow"]}
					/>
					<ActionButtons
						isSubmitting={isSaving}
						hidden={statusForm === "readOnly" || finished}
						buttons={validActionButtons.map(({ onClick, ...item }) => ({
							...item,
							onClick: onClick ? onClick : submitForm,
						}))}
					/>
				</>
			)}
		</Form>
	);
};

export default GuaranteeInsuranceBudgets;