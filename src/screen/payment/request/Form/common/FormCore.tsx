import moment from "moment";
import { t } from "src/locale/i18n";
import { FormikProps } from "formik";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgress, Grid } from "@material-ui/core";
import { ReactNode, useMemo, useEffect, useRef, useState } from "react";

import {
	getPaymentSearch,
	getFolderInfoPayment,
	getStatusPayment,
	getPaymentAccounting,
	getItemPayment,
	getErrorMessage,
	getListPayment,
	getModalEsocialLinkId
} from "src/core/store/modules/payment/selectors";
import {
	TPaymentFavoredData,
	TPaymentDataGuides,
	TTypeForm,
	TPaymentDataFGTS,
	TPaymentDataGPS,
	TPaymentDataIRRF,
	TPaymentDatasDefault,
	TComplementData,
	TPaymentGenerateReversalRecords,
} from "src/core/models/payment";
import {
	getOrdersFiltred,
	getPaymentOrders,
} from "src/core/store/modules/provision-order/selectors";
import {
	statusTextApprovalsFlow,
	STATUS_APPROVALS_FLOW,
} from "src/core/utils/constants";
import {
	addGuaranteeCreditReceipReverse,
	deletePaymentRequestFile,
	getPayment,
} from "src/core/store/modules/payment/thunks";

import Form, { SelectField, RadioGroup } from "src/components/form";

import Logs from "src/components/Logs";
import { actions } from "src/core/store";
import apiPayment from "src/core/api/payment";
import { useRegisterDefault } from "src/hooks";
import { Submit } from "src/components/button";
import { Modulos } from "src/core/models/modules";
import { convertToBlob, deepCopy, getEnvironment, modifyProperty, numberToCurrency, toNumber, valuesToNumber } from "src/core/utils/func";

import Attachments from "src/components/Attachments";
import api from 'src/core/api/process';
import { useGuaranteeModality, usePaymentType } from "src/hooks/fetchLists";
import CancelButton from "src/components/button/Cancel";
import AccountingData from "src/components/AccountingData";
import { formatTo, getFullDate } from "src/core/utils/func";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { fetchProvisionsProcess } from "src/core/store/modules/provision-order/thunks";
import { getLoadingParameterization } from "src/core/store/modules/parameterization/selectors";
import { associatePaymentOrdersWithOrder } from "src/components/AccountabilityModal/OrderTable";
import AccountabilityModalPayment from "src/screen/payment/request/Form/common/AccountabilityModalPayment";

import Panel from "src/components/Panel";

import { getListGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors";
import { fetchESocialAreasGridList } from "src/core/store/modules/e-social-areas/thunks";
import { getProcessFolder } from "src/core/store/modules/process/selectors";
import { getListESocialAreas } from "src/core/store/modules/e-social-areas/selectors";
import { fetchGoodsGuaranteesRequestListSimplify } from "src/core/store/modules/goods-guarantee/thunks";
import { RECORD_TYPE } from "src/screen/goods-and-guarantees/constants";

import ESocialForm from "./ESocialForm";
import JustificationModal from "src/components/JustificationModal";
import { modal } from "src/components/modals";

type TItem = (
	| TPaymentFavoredData
	| TPaymentDataGuides
	| TPaymentDataFGTS
	| TPaymentDataGPS
	| TPaymentDataIRRF
) &
	TComplementData & {
		statusApprovalId?: number;
		statusFlowId?: number;
		goodsGuaranteesRequestId?: string;
		policyNumber?: string;
		endorsementNumber?: string;
	};

type Props = {
	hasItem: boolean;
	showEmptyForm?: boolean;
	form: TTypeForm;
	onSubmit: any;
	validationSchema?: any;
	children: ReactNode;
	item?: TItem;
	customInitialValues:
		| TPaymentDatasDefault
		| TPaymentDataFGTS
		| TPaymentDataGPS
		| TPaymentDataGuides
		| TPaymentDataIRRF;
	isApprovalLegalControl: boolean;
	isApprovalInternalLawyer: boolean;
	eSocialFormVisibility?: boolean;
	uploadESocialPJC?: boolean;
	isFormGuia?: boolean;
};

interface StringToObjectResult {
	goodsGuaranteesRequestId: string | null;
	policyNumber: string | null;
	endorsementNumber: string | null;
}

type orderRatingDescription = {
	descripiton: string;
	valueDescripiton: string;
	orderRatingProbababilityId: number;
	sum?: number;
	somaAllOrdesRatingsProvavel?: number;
};

interface StringToObjectResult {
	goodsGuaranteesRequestId: string | null;
	policyNumber: string | null;
	endorsementNumber: string | null;
}

const orderRatingDescriptions = [
	{
		descripiton: "Principal",
		valueDescripiton: "valorPrincipal",
		orderRatingProbababilityId: 1,
	},
	{
		descripiton: "Multa",
		valueDescripiton: "valorMulta",
		orderRatingProbababilityId: 2,
	},
	{
		descripiton: "Juros Históricos",
		valueDescripiton: "valorJurosHistorico",
		orderRatingProbababilityId: 3,
	},
	{
		descripiton: "Encargos",
		valueDescripiton: "encargo",
		orderRatingProbababilityId: 4,
	},
	{
		descripiton: "Sucumbência",
		valueDescripiton: "sucumbencia",
		orderRatingProbababilityId: 5,
	},
] as orderRatingDescription[];



const replacementGoodGuaranteeAsOption = [
	{label: "Sim", value: true}, 
	{label: "Não", value: false}
]

const FormCore = ({
	hasItem,
	item,
	showEmptyForm,
	form,
	onSubmit,
	validationSchema,
	customInitialValues,
	isApprovalLegalControl,
	isApprovalInternalLawyer,
	children,
	isFormGuia = false,
	...props
}: Props) => {
	const dispatch = useDispatch();
	const { pathname } = useLocation();
	const history = useHistory(); 

	const { enqueueSnackbar } = useSnackbar();

	const folder = useSelector(getFolderInfoPayment);
	const paymentOrders = useSelector(getPaymentOrders);
	const accounting = useSelector(getPaymentAccounting);
	let { id } = useParams<{ id: string }>();

	const isLoadingParametrization = useSelector(getLoadingParameterization);
	const listGoodsGuaranteesRequest = useSelector(getListGoodsGuaranteesRequest);
	const { guaranteeModalityAsOptions } = useGuaranteeModality();
	const { folderNumber, formaPagamentoId, tipoPagamentoId } = useSelector(getPaymentSearch);
	const [originAreaId, setOriginAreaId] = useState<number>();

	const itemPay = useSelector(getItemPayment) as any;
	const status = useSelector(getStatusPayment);
	const orders = useSelector(getOrdersFiltred);
	const { id: userId } = useSelector(getDataCurrentUser);
	const process = useSelector(getProcessFolder)
	const { paymentType } = usePaymentType(Modulos.Pagamento);
	const listESocialAreas = useSelector(getListESocialAreas);
	const eSocialID = useSelector(getModalEsocialLinkId);
	const formFinal = useRef<FormikProps<any>>(null);
	const environment = getEnvironment();
	const isNew = pathname === "/pagamentos/solicitacao/novo"
	const [isLoadingGenerate, setLoadingGenerate]= useState(false);
	const [submitting, setIsSubmitting] = useState(false);
	const [enableButton, setEnableButton] = useState<boolean>(true);
	const isRequest = pathname.includes("/pagamentos/solicitacao");

	let isReversal = false
	if (id.includes(";")) {
		id = id.split(";")[0];
		isReversal = true
	}

	const filtredOrders = orders;
	const isSaving = status === "saving";
	const requesterId = useMemo(() => itemPay?.requesterId, [itemPay]) as any;
	const isReadOnlyRequester = isRequest && requesterId !== userId;

	const tipoPagamento = paymentType.find(({ id }) => id === tipoPagamentoId);
	const isSolicitation = pathname.startsWith("/pagamentos/solicitacao");
	const fileGuideCheck = environment === "PRD" ? 1 : 7;
	
	const goodGuaranteesListAsOptions = listGoodsGuaranteesRequest?.map((x: any) => ({
		label: `Id Garantia: ${x.id}; Modalidade: ${guaranteeModalityAsOptions?.filter((guarantee: any) => guarantee.value === x?.guaranteeModalityId).map((x: any) => x.label)[0]}; Valor: ${numberToCurrency(x.valueGuarantee)}; Saldo contábil: ${numberToCurrency(x.accountingBalance)}`,
		value: x.id,
	}))

	const formatarIdentificacao = (item: any): string => {
		let resultado = `ID da garantia: ${item.id}`;
	
		if (item.policyNumber) {
		resultado += `; Apólice: ${item.policyNumber}`;
		}
	
		if (item.endorsementNumber) {
		resultado += `; Endosso: ${item.endorsementNumber}`;
		}
	
		return resultado;
	}

	const mergePolicyOptions = listGoodsGuaranteesRequest?.filter((item: any) => !!item?.policyNumber).map((item: any) => ({
		label: formatarIdentificacao(item), 
		value: `${item.id}/${item.policyNumber}/${item.endorsementNumber}`
	})) 

	useRegisterDefault({
		action: "paymentRequest",
		getStatus: getStatusPayment,
		getErrorMessage,
	});

	const onSubmitReject = async (values: TPaymentGenerateReversalRecords) => {
		setIsSubmitting(true)
		const {type} = await dispatch(addGuaranteeCreditReceipReverse({
			paymentIds: [itemPay?.id],
			rejectionAndReturnReasonsId: values.rejectionAndReturnReasonsId,
			justification: values.justification
		})) as any;
		if(type === 'paymentRequest/Reverse/fulfilled'){
			history.goBack();
			setIsSubmitting(false)
			return enqueueSnackbar("Justificativa de estorno enviada com sucesso", {
				variant: 'success',
			});
		}
		setIsSubmitting(false)
	}

	const onReversal = () => {
		const component = (
			<JustificationModal
				reason={"reversed"}
				onSubmitJustification={async (values: TPaymentGenerateReversalRecords) =>
					onSubmitReject(values)

				}
				moduloId={6}
				reasonType={3}
			/>
		);

		const title = t("approval.justificationReversed");
				
		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true, fullWidth: true },
		});
	};

	const editable =
		(!isApprovalLegalControl &&
			!isApprovalInternalLawyer &&
			(userId === requesterId || requesterId === undefined) &&
			(!hasItem ||
				item?.statusFlowId === STATUS_APPROVALS_FLOW.RETURNED ||
				item?.statusApprovalId === STATUS_APPROVALS_FLOW.RETURNED)) ||
		(hasItem &&
			item?.statusApprovalId === 1 &&
			item.statusFlowId === 1 &&
			isApprovalLegalControl) ||
		(hasItem &&
			item?.statusFlowId === STATUS_APPROVALS_FLOW.RECEIPT_AVALIABLE &&
			isApprovalLegalControl) || item?.statusFlowId == STATUS_APPROVALS_FLOW.RETURNED && (id !== "novo" ? !isReadOnlyRequester : undefined)	|| isSolicitation && item?.statusFlowId === 2

	const initialValues = {
		form,
		folderNumber,
		formaPagamentoId,
		tipoPagamentoId,
		dataSolicitacao: showEmptyForm ? null : moment().format("YYYY-MM-DD"),
		dataPagamento: null,
		advogadoInterno: folder.internalLawyer,
		advogadoInternoId: folder.internalLawyerId,
		replacementGoodGuarantee: false,
		goodsGuaranteesRequestId: '',
		observacao: "",
		files: [] as any[],
		eSocialAttachments: [] as any,
		filesEsocial: [] as any,
		filesGuide: [] as any,
		eSocialCalcFile: [] as any,
		mergePolicy: `${item?.goodsGuaranteesRequestId ?? null}/${item?.policyNumber ?? null}/${item?.endorsementNumber ?? null}`,
		...customInitialValues,
		...item,
		cep: (item as TPaymentFavoredData)?.cep
			? formatTo("cep", (item as TPaymentFavoredData).cep)
			: "",
		periodoApuracao: getFullDate((item as any)?.periodoApuracao),
		newStatusFlowId: item?.statusFlowId,
		eSocialRestriction: !isSolicitation,
		eSocialLinkedPaymentId: eSocialID
	};


	const getFolderData = async () => {
		
		const { data } = await api.getFolder(folderNumber);
		setOriginAreaId(data?.originAreaId)
	} 

	const isDejurAreaPaymentListed = listESocialAreas?.find(area => area.areaId ===  originAreaId);

	const transformStringToObject = (value: string): StringToObjectResult => {
		const parts = value.split('/');
	
		return {
			goodsGuaranteesRequestId: parts[0] ?? null,
			policyNumber: parts[1] ?? null,
			endorsementNumber: parts[2] ?? null,
		};
	}

	const convertToBase64 = async (file: File): Promise<string> => {
		return new Promise(async (resolve, reject) => {
			const fileReader = new FileReader();
			const fileToBlob = await convertToBlob(file)
			fileReader.readAsDataURL(fileToBlob);

			fileReader.onload = () => {
				const result = fileReader.result as string;
				const base64Data = result.split(',')[1];
				resolve(base64Data);
			};

			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	};

	const sendPayment = async (values: any, form: any) => {
		const verifyESocialFile = () => {
			return values?.files.some((e: { isESocialFile: boolean; }) => e.isESocialFile === true)
		}

		const hasFile = verifyESocialFile();

		if(tipoPagamento?.generateGuideFiles === 4 && JSON.stringify(values?.filesEsocial) === "{}" && (values?.pagamentosESocial?.remunerationAmount?.length > 0 && values?.pagamentosESocial?.remunerationAmount !== "R$ 0,00" && hasFile === false)){
			return enqueueSnackbar(`Pagamento com verba remuneratória exige arquivo para cálculo`, {variant: "error"})
		}
		
		const filesEsocialnames = Object.keys(values?.filesEsocial);
		const arrayOfEsocialFilesLength: number[] = [] 
		
		filesEsocialnames.forEach((fileName: string) => {
			arrayOfEsocialFilesLength.push(fileName?.length)
		})

		if(arrayOfEsocialFilesLength.some(number => number > 119))
			return enqueueSnackbar( "O nome do arquivo adicionado (Anexos eSocial) ultrapassou o limite permitido (119 caracteres)",
				{ variant: "error" }
			);

		const arrayOfFilesLength: number[] = [];	

		values?.files.forEach((file: any) => {
			arrayOfFilesLength.push(file?.name?.length)
		});

		if(arrayOfFilesLength.some(number => number > 119))
			return enqueueSnackbar( t("goodsAndGuarantees:characterLimiterWarningMessage"),
				{ variant: "error" }
			);

		if (!values.advogadoInterno && tipoPagamento?.retificacaoESocial !== true) 
			return enqueueSnackbar("Advogado interno não indicado", { variant: "error" });
		
		if (!values.fornecedor && tipoPagamento?.retificacaoESocial !== true) 
			return enqueueSnackbar("Fornecedor não indicado", { variant: "error" });
		values.pagamentosESocial = listESocialAreas?.length === 0 ? null : values.pagamentosESocial
		
		const dataPagamento = moment(values.dataPagamento, "YYYY-MM-DD");
		const dataAtual = moment().startOf('day');
		const normalizedValues = deepCopy(values);

		modifyProperty(normalizedValues, [
			"valorPagamentoJudicial",
			"valorPrincipal",
			"encargo",
			"sucumbencia",
			"valorJurosHistorico",
			"valorMulta",
			"valorPrincipal",
			"compensationAmount",
			"remunerationAmount"
		], toNumber);

		
		if (tipoPagamento?.processType === "SE" && values.mergePolicy) {
			values = {...values, ...transformStringToObject(values.mergePolicy)}
		}
		delete values.mergePolicy;
		if (isSolicitation && !dataPagamento.isSameOrAfter(dataAtual) && tipoPagamento?.retificacaoESocial !== true) 
			return enqueueSnackbar("A data do pagamento não pode ser menor que a data de hoje", { variant: "error" });
		
		if (
			tipoPagamento?.abaterSaldoProvisao === 1 &&
			initialValues.folderNumber &&
			filtredOrders?.length > 1
		) {

			const paymentOrdersWithOrder = associatePaymentOrdersWithOrder(
				paymentOrders,
				filtredOrders
			);

			const filtredOrderRatingDescriptions = [] as orderRatingDescription[];
			
			orderRatingDescriptions.forEach((orderRatingDescription) => {
				const filterPaymentOrdersWithOrder = paymentOrdersWithOrder.filter(
					(item) =>
						item.orderRatingDescription?.name ===
						orderRatingDescription.descripiton
				);

				if (filterPaymentOrdersWithOrder?.length !== 0) {
					const sumFilterPaymentOrdersWithOrder =
						filterPaymentOrdersWithOrder.reduce(
							(sum, item) => sum + Number(item.value),
							0
						);
					
					const allOrdesRatings = filtredOrders
						.map(({ orderRatings }) => orderRatings)
						.flat(1)
						.filter(
							({ orderRatingProbababilityId, value, orderRatingDescriptionId }) =>
								value !== 0 && orderRatingDescriptionId === 1 && 
								orderRatingProbababilityId ===
									orderRatingDescription.orderRatingProbababilityId
						);

					const somaAllOrdesRatingsProvavel = allOrdesRatings.reduce(
						(sum, { value }) => sum + Number(value),
						0
					);

					filtredOrderRatingDescriptions.push({
						...orderRatingDescription,
						sum: sumFilterPaymentOrdersWithOrder,
						somaAllOrdesRatingsProvavel,
					});
				}
			});
			
			if (filtredOrderRatingDescriptions?.length !== 0) {
				for (
					let index = 0;
					index < filtredOrderRatingDescriptions?.length;
					index++
				) {
					const {sum, valueDescripiton, somaAllOrdesRatingsProvavel} = filtredOrderRatingDescriptions[index];
					if (
						Number(sum) < normalizedValues[valueDescripiton] && Number(sum) < Number(somaAllOrdesRatingsProvavel)
					) {
						return enqueueSnackbar(
							`Valor lançado nos pedidos de provisão MENOR do valor da pagamento.`,
							{ variant: "error" }
						);
					}
				}
			}
		}
		if(values.eSocialLinkedPaymentId === 0){
			delete values.eSocialLinkedPaymentId
		}

		const newFilesBase64: { [filename: string]: string } = {};

		if(isNew === false){ 
				const file = values.filesEsocial[0];
				if(file?.name?.length > 119){
					return enqueueSnackbar( "O nome do arquivo adicionado (Anexos eSocial) ultrapassou o limite permitido (119 caracteres)",
				{ variant: "error" }
			);
				}
				const base64 = await convertToBase64(file);
				newFilesBase64[file?.name] = base64;

				delete values.eSocialCalcFile;
			
			await onSubmit({...values, filesEsocial: newFilesBase64}, form); 
			return
		} 

		await onSubmit(values, form);
	};


	const handleDelete = async (file: any) => {
		if (file && file.id ) {
			dispatch(deletePaymentRequestFile(file.id));
	} 
};

	useEffect(() => {
		return () => {
			dispatch(actions.guaranteeAccountability.clear());
			dispatch(actions.goodsGuaranteesRequest.clear());
			dispatch(actions.provisionOrder.clearProvisionProcess());
		};
	}, [dispatch]);

	useEffect(() => {
		if (initialValues.folderNumber){
			dispatch(fetchProvisionsProcess(initialValues.folderNumber));
			dispatch(fetchGoodsGuaranteesRequestListSimplify({statusApprovalId: STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE, recordType: RECORD_TYPE.EFFECTIVE, folderNumber: initialValues.folderNumber, isActive: true}));
		}
			
	}, [initialValues.folderNumber, dispatch]);

	useEffect(() => {
		if (process?.legalDepartmentAreaId){
			dispatch(fetchESocialAreasGridList({areaId: process?.legalDepartmentAreaId}))
		}
	}, [process?.legalDepartmentAreaId, dispatch]);

	useEffect(() => {
		if (initialValues.folderNumber && tipoPagamento?.processType === "SE"){
			dispatch(fetchGoodsGuaranteesRequestListSimplify({
				folderNumber: initialValues.folderNumber,
				guaranteeModeId: 2,
				isActive: true,
				statusApprovalId: 1,
				recordType: 2,
				page: 1,
				pageSize: 20
			}));
		}
	}, [initialValues.folderNumber, dispatch, tipoPagamento?.processType]);

	/* useEffect(() => {
		if (process?.legalDepartmentAreaId){
			dispatch(fetchESocialAreasGridList({areaId: process?.legalDepartmentAreaId}))
		}
	}, [process?.legalDepartmentAreaId, dispatch]); */

	useEffect(() => {
		if (initialValues.folderNumber && tipoPagamento?.processType === "SE"){
			dispatch(fetchGoodsGuaranteesRequestListSimplify({
				folderNumber: initialValues.folderNumber,
				guaranteeModeId: 2,
				isActive: true,
				statusApprovalId: 1,
				recordType: 2,
				page: 1,
				pageSize: 20
			}));
		}
	}, [initialValues.folderNumber, dispatch, tipoPagamento?.processType]);

	const setESocialValues = () => {
			formFinal.current?.setFieldValue('pagamentosESocial.agreementApprovalDate', itemPay?.pagamentosESocial?.agreementApprovalDate)
			formFinal.current?.setFieldValue("pagamentosESocial.startDateForESocialCalculation", itemPay?.pagamentosESocial?.startDateForESocialCalculation)
			formFinal.current?.setFieldValue("pagamentosESocial.endDateForESocialCalculation", itemPay?.pagamentosESocial?.endDateForESocialCalculation) 
			formFinal.current?.setFieldValue("files", initialValues.files.filter((x: any) => x.isESocialFile === false && x.isGuideFile === false && x.isESocialCalcFile === false))
			formFinal.current?.setFieldValue("filesEsocial", initialValues.files.filter((x: any) => x.isESocialFile === true))
			formFinal.current?.setFieldValue("filesGuide", initialValues.files.filter((x: any) => x.isGuideFile === true))
			formFinal.current?.setFieldValue('eSocialCalcFile', initialValues.files.filter((x: any) => x.isESocialCalcFile === true))
			formFinal.current?.setFieldValue('pagamentosESocial.Observation', itemPay?.pagamentosESocial?.observation)
			formFinal.current?.setFieldValue('pagamentosESocial.ESocialEvent', itemPay?.pagamentosESocial?.eSocialEvent)
			formFinal.current?.setFieldValue('pagamentosESocial.cprb', itemPay?.pagamentosESocial?.cprb === true ? 1 : 0)
	}

	useEffect(() => { 
		if(isNew === false && enableButton === true){
			setESocialValues();
		}
	}, [initialValues, isNew])

	useEffect(() => {
		getFolderData();
	}, [folderNumber])
	
	if (isLoadingParametrization)
		return <CircularProgress className="margin-top-16 align-center" />;

	return (
		<>
			{tipoPagamento?.abaterSaldoProvisao === 1 &&
				initialValues.folderNumber &&
				filtredOrders.length > 1 && (
					<AccountabilityModalPayment
						folderNumber={initialValues.folderNumber}
						paymentTypeId={tipoPagamentoId}
						paymentMethodId={formaPagamentoId}
						isEditable={editable}
						form={formFinal}
						isSpecialSetFormValues={true}
						dictionary={{
							1: "valorPrincipal",
							2: "valorMulta",
							3: "valorJuros",
							4: "encargo",
							5: "sucumbencia",
						}}
					/>
				)}
			<Form
				enableReinitialize
				innerRef={formFinal}
				onSubmit={(values, form) => sendPayment(values, form)}
				initialValues={initialValues}
				permission={editable ? undefined : false}
			>
				{({ handleSubmit, values, isSubmitting }) => (
					<form onSubmit={handleSubmit} noValidate>
						{children}
						{
							tipoPagamento?.gerarBensGarantias === true ? <>
							<Panel
								withPadding
								title={"Dados de Bens e Garantias"}
							>
							<Grid container spacing={2}>
								<Grid item md={2} xs={12} style={{ display: "flex" }}>
									<RadioGroup
										name='replacementGoodGuarantee'
										label={t('goodsAndGuarantees:management.replacementGoodGuarantee')}
										options={replacementGoodGuaranteeAsOption}
									/>
								</Grid>
								{	values?.replacementGoodGuarantee === true ?
									<Grid item md={3} xs={12} style={{marginTop: '6px'}}>
									<SelectField
										label={t('goodsAndGuarantees:management.goodsGuaranteesRequestId')}
										name='goodsGuaranteesRequestId'
										options={goodGuaranteesListAsOptions}
										required
									/> 
								</Grid> : null}
								</Grid>
							</Panel>
							
							</> : null
						}	
						{
							/* props.uploadESocialPJC === false && */ /* formaPagamentoId === fileGuideCheck || */ isFormGuia === true ?  <>
							<Attachments
								name="filesGuide"
								label={"Anexo guia"}
								onDelete={handleDelete}
								disabled={!editable}
								id="filesGuide"
								accept=".pdf"
							/>
							</>
							: null
						}
						{
							tipoPagamento?.retificacaoESocial === true ? null :
								<Attachments 
									onDelete={handleDelete}
							confirmDeletionGoodsAndGuarantees
							sideButton={[1, 2, 3].includes(tipoPagamento?.generateGuideFiles ?? 0) && values?.statusApprovalId === 1 && (
								<div>
									{isLoadingGenerate && <CircularProgress />}
									{!isLoadingGenerate && <Button
										variant="outlined"
										color="secondary"
										startIcon={<AddIcon />}
										onClick={async () => {
											setLoadingGenerate(true);
											if (values.id) {
												try {
													switch (tipoPagamento?.generateGuideFiles) {
														case 3:
															await apiPayment.doSefip(Number(values.id));
															break;

														case 2:
															await apiPayment.doGps({
																status: 1,
																numeroSolicitacao: Number(values.id),
																aprovador: values?.possibleApprovers[0].id
															});
															break;

														case 1:
															await apiPayment.doGps({
																status: 1,
																numeroSolicitacao: Number(values.id),
																aprovador: values?.possibleApprovers[0].id
															});
															await apiPayment.doSefip(Number(values.id));
															break;
													
														default:
															break;
													}

													dispatch(getPayment(Number(values.id)));
												} catch (error) {
													enqueueSnackbar(t("anErrorHasOcurred"), { variant: "error" });
						
												}
						
											}
											setLoadingGenerate(false);
						
										} }
									>
										{"Gerar arquivos"}
									</Button>}
								</div>)} 
							name="files" 
									disabled={!editable} 
								/> 
						}
						{props?.eSocialFormVisibility && (
							<ESocialForm
								uploadESocialPJC={props.uploadESocialPJC ?? false}
								setEnableButton={setEnableButton}
								attachEditable={!editable}
							/>
						)}

						{/* {isNew === false && tipoPagamento?.generateGuideFiles === 4 ? 
						<Attachments
								name="filesEsocial"
								label={"Anexos eSocial (Arquivo PJE-CALC/ Planilha de cáculo"}
								onDelete={handleDelete}
								disabled={!editable}
								id="filesEsocial"
								accept=".xlsx"
									/> : null}	 */} 					
						{tipoPagamento?.processType === "SE" && 
							<Panel title={"Dados de Bens e Garantia - Apólice(s)"} withPadding>
								<Grid container spacing={3}>
									<Grid item xs={12} md={12}>
									<SelectField
										options={mergePolicyOptions}
										label={"Apólices vinculadas a Pasta/CTG"}
										name="mergePolicy"
										required
									/>
									</Grid>
								</Grid>
							</Panel>
						}
						{hasItem && <AccountingData accountingData={accounting?.[0]} title={t("accounting.title")}  />}
						{hasItem && accounting?.length > 1 === true ? <AccountingData accountingData={accounting?.[1]} title={t("accounting.reversalTitle")}  /> : null}
						{hasItem && accounting?.length > 2 === true ? <AccountingData accountingData={accounting?.[2]} title={t("accounting.reclassification")}  /> : null}
							<Logs
								logs={item?.logs}
								possibleApprovers={item?.possibleApprovers}
								statuses={statusTextApprovalsFlow}
								statusOrder={["flow", "approvalCenter"]}
							/>
						{editable && (
							<Grid
								container
								justifyContent="flex-end"
								className="margin-top-16"
								spacing={2}
							>
								<Grid item>{<CancelButton />}</Grid>
								{
									isReversal ===true ? 
									<Grid item>
									<Button
										variant="contained"
										color='primary'
										onClick={() => onReversal()}
										disabled={submitting}
								    >
									{"Estornar"}
									</Button>
								</Grid> : null
								}
								<Grid item>
									<Submit submitting={isSaving || isSubmitting} 
									disabled={props?.eSocialFormVisibility === true && isDejurAreaPaymentListed !== undefined ? enableButton : false}
									/* click={() => sendPayment(formFinal.current?.values, formFinal.current)} */
									/>
									
								</Grid>
							</Grid>
						)}
					</form>
				)}
			</Form>
		</>
	);
};

export default FormCore;
