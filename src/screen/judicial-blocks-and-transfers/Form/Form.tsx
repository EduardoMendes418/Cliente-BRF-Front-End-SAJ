import { useMemo, useEffect, useRef, useCallback, useState } from "react";
import { Checkbox, Grid } from "@material-ui/core";
import moment from "moment";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Submit } from "src/components/button";
import Attachments from "src/components/Attachments";
import FieldColumn from "src/components/FieldColumn";

import Form, {
	CurrencyField,
	DateField,
	NumericField,
	SelectField,
	TextField,
	TOptionsSelect,
} from "src/components/form";
import JustificationModal from "src/components/JustificationModal";
import Logs from "src/components/Logs";
import {
	modal,
	// confirm
} from "src/components/modals";
import Panel from "src/components/Panel";

import { TLogs } from "src/core/models";
import { Modulos } from "src/core/models/modules";
import { treatFormValuesWithOccurrenceReason } from "src/core/utils/occurence-reason-util";
import {
	TJudicialBlocksAndTransfers,
	TJudicialBlocksAndTransfersAcconting,
} from "src/core/models/judicial-blocks-and-transfers";
import {
	getHasItemJudicialBlocksAndTransfers,
	getStatus,
	getErrorMessage,
	getError,
} from "src/core/store/modules/judicial-blocks-and-transfers/selectors";
import {
	addJudicialBlocksAndTransfers,
	deleteJudicialBlocksAndTransfersFile,
	editJudicialBlocksAndTransfers,
} from "src/core/store/modules/judicial-blocks-and-transfers/thunks";
import { valuesToNumber, toNumber } from "src/core/utils/func";
import { useRegisterDefault } from "src/hooks";
import { useBanks } from "src/hooks/fetchLists";
import { useTranslation } from "src/locale/i18n";
import { FormikProps } from "formik";
// import {
// 	getItemPaymentTypeMethod,
// 	getListPaymentTypeMethod,
// } from "src/core/store/modules/payment-type-method/selectors";

import {
	occurrenceTypesOptions,
	OCCURRENCE_TYPE,
	STATUS_FLOW,
	allStatusAsObject,
	// solicitationStatusOptionsBlock,
	allStatusOptionsTransfer,
	solicitationStatusOptionsTransfer,
	evaluationStatusOptions,
	// solicitationStatusOptionsBlockStatus,
	// solicitationStatusOptionsBlockInUnlockAndGenerateGuarantee, solicitationOnlyCanceledStatus,
} from "../constants";
import useFormPermission from "../hooks/useFormPermission";
import CancelButton from "src/components/button/Cancel";
import { TAcconting } from "src/core/models/accountability";
import AccordionPanel from "src/components/AccordionPanel";

import { useSnackbar } from "notistack";
import ProssibleApprovers from "src/components/Logs/PossibleApprovers";
import { isEditable2 } from "src/screen/judicial-blocks-and-transfers/editable";
import { getPermissionsCurrentUser } from "src/core/store/modules/currentUser/selectors";
import TableComponent, { ColumnData } from "src/components/Table";
import JustificationDisplay from "src/components/JustificationDisplay";
import { useCurrentUser } from "src/config/permissions";

import { fetchProvisionsProcess } from "src/core/store/modules/provision-order/thunks";
import {
	getOrders,
	getPaymentOrders,
	getProvisionsProcessLoading,
} from "src/core/store/modules/provision-order/selectors";
import AccountabilityModal from "src/components/AccountabilityModal";
// import { associatePaymentOrdersWithOrder } from "src/components/AccountabilityModal/OrderTable";
import { actions } from "src/core/store";
import { setPaymentOrders } from "src/core/store/modules/provision-order";
import paymentTypeAPI from "src/core/api/payment-type";
import {
	getListAsOptionPaymentTypeAllStatus,
	getListPaymentType,
} from "src/core/store/modules/payment-type/selectors";
import { FormControlLabel } from "@mui/material";
import { associatePaymentOrdersWithOrder } from "src/components/AccountabilityModal/OrderTable";
const finishedStatus = [
	STATUS_FLOW.FINISHED,
	STATUS_FLOW.CANCELLED,
	STATUS_FLOW.UNLOCKED,
];

type TForm = {
	isNew: boolean;
	item: TJudicialBlocksAndTransfers;
	folderNumber: string;
	accounting?: TJudicialBlocksAndTransfersAcconting[];
	unlocks?: TAcconting[];
};

type orderRatingDescription = {
	descripiton: string;
	valueDescripiton: string;
	orderRatingProbababilityId: number;
	sum?: number;
	somaAllOrdesRatingsProvavel?: number;
};

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

const JudicialBlocksAndTransfersForm = ({
	item: { process, ...item },
	isNew,
	folderNumber,
	accounting,
	unlocks,
}: TForm) => {
	const { t } = useTranslation();
	const location = useLocation();
	const dispatch = useDispatch();
	const form = useRef<FormikProps<any>>(null);
	const { enqueueSnackbar } = useSnackbar();
	const { userId } = useCurrentUser("");

	const { isLegal, isCCJ } = useFormPermission();
	const paymentOrders = useSelector(getPaymentOrders);
	const provisionsProcessLoading = useSelector(getProvisionsProcessLoading);
	const permissions = useSelector(getPermissionsCurrentUser);
	const paymentType = useSelector(getListPaymentType);
	const [balanceBlocking, setBalanceBlocking] = useState(false);

	const paymentTypeAsOptions = useSelector(getListAsOptionPaymentTypeAllStatus);
	const permition = permissions.find(
		({ name }) => name === "bloqueios-e-transferencias/avaliacao"
	);

	const status = useSelector(getStatus) as any;
	const error = useSelector(getError) as any;
	const isSolicitacao = location.pathname.includes("solicitacao");
	const orders = useSelector(getOrders);

	const filtredOrders = useMemo(
		() =>
			orders &&
			orders.filter(({ isActive, orderRatings, orderExpectationId }) => {
				if (!isActive) return false;
				if (orderExpectationId !== 1) return false;
				const orderRatingProbabability = orderRatings
					.filter(
						({ orderRatingProbababilityId, value }) =>
							orderRatingProbababilityId === 1 && value !== 0 && value !== null
					)
					.pop();
				if (orderRatingProbabability?.value === undefined) return false;
				return true;
			}),
		[orders]
	);

	useEffect(() => {
		if (folderNumber) dispatch(fetchProvisionsProcess(folderNumber));
	}, [folderNumber, dispatch]);

	useEffect(() => {
		return () => {
			dispatch(actions.guaranteeAccountability.clear());
			dispatch(actions.goodsGuaranteesRequest.clear());
			dispatch(actions.provisionOrder.clearProvisionProcess());
		};
	}, [dispatch]);

	const doRequestPaymentType = useCallback(
		async () => {
			const { data } = await paymentTypeAPI.list({
				modulo: Modulos.Pagamento,
				notPaginate: true,
			});
			const findOccurrenceType = data.items.find(
				({ id }: any) => id === item?.occurrenceReason
			);
			let { judicialBlocksAndTransferOrders } = item;
			if (findOccurrenceType?.abaterSaldoProvisao !== 1) {
				judicialBlocksAndTransferOrders = judicialBlocksAndTransferOrders.map(
					(item: any) => ({ ...item, value: 0 })
				);
			}
			dispatch(
				actions.provisionOrder.setAllPaymentOrders(
					judicialBlocksAndTransferOrders
				)
			);
		},
		[dispatch, item]
	);

	useEffect(() => {
		if (!isNew && !paymentOrders.length && !!item.id) {
			doRequestPaymentType();
		}
		
	}, [isNew, item.id]);

	useEffect(() => {
		if (status === "failure" && error?.detail !== undefined)
			enqueueSnackbar(error?.detail ?? "", { variant: "error" });
	}, [error, status, enqueueSnackbar]);

	useRegisterDefault({
		action: "judicialBlocksAndTransfers",
		getStatus,
		getErrorMessage,
	});

	const { banksAsOptions } = useBanks();
	const statusSubmit = useSelector(getStatus);

	const hasItem = useSelector(getHasItemJudicialBlocksAndTransfers);

	const finished = finishedStatus.includes(Number(item.statusFlowId));

	const isFormReadonly = useMemo(
		() =>
			!isNew &&
			!isEditable2(
				isSolicitacao,
				item.statusFlowId,
				permition?.edit ?? true,
				item.goodsGuaranteesRequestId === null,
				isSolicitacao ? item.statusApprovalId : 1
			),
		[
			isNew,
			isSolicitacao,
			item.statusFlowId,
			permition?.edit,
			item.statusApprovalId,
			item.goodsGuaranteesRequestId,
		]
	);

	const finalInitialValues = useMemo(() => {
		let initialValues: TJudicialBlocksAndTransfers = {
			folderNumber,
			createdDate: moment().format("YYYY-MM-DD"),
			statusFlowId: isFormReadonly
				? item.statusFlowId
				: isSolicitacao
					? STATUS_FLOW.PENDING_CCJ
					: STATUS_FLOW.IN_VALIDATION,
			bankId: "",
			company: "",
			unlockdate: "",
			destinationBankAccountId: "",
			exercise: "",
			companyDocumentUnlock: "",
			unlockDocumentNumber: "",
			exerciseDocumentUnlock: "",
			occurrenceType: "",
			occurrenceReason: "",
			updateMethod: "",
			blockOrTransfDate: null,
			locateDistrict: "",
			accountingDocumentNumber: "",
			bankToSendLicense: "",
			judicialAccountNumber: "",
			value: 0,
			description: "",
			agency: "",
			blockedaccountnumber: "",
			responsiblename: "",
			files: [] as any,
			balanceBlocking: false,
			mainValue: 0,
			fineValue: 0,
			valueCharges: 0,
			succumbingValue: 0,
			historicalInterestValue: 0
		};

		if (hasItem)
			initialValues = {
				...initialValues,
				...item,
			};
		if (!isSolicitacao && !isFormReadonly)
			initialValues.statusFlowId = STATUS_FLOW.IN_VALIDATION;
		if (finished) {
			const end =
				item.logs?.find(({ statusFlowId }) =>
					finishedStatus.includes(statusFlowId as STATUS_FLOW)
				) ?? ({} as TLogs);
			initialValues = { ...initialValues, finishedDate: end.occurrenceDate };
		}
		return initialValues;
	}, [folderNumber, isFormReadonly, item, isSolicitacao, hasItem, finished]);

	const onSubmitReject = (
		values: TJudicialBlocksAndTransfers,
		justification: string,
		rejectionAndReturnReasonsId: number | ""
	) => {
		dispatch(
			editJudicialBlocksAndTransfers({
				...values,
				generateLog: {
					id: item.id,
					observation: justification,
					statusFlowId: values.statusFlowId,
					rejectionAndReturnReasonsId,
				},
			})
		);
	};

	const onJustify = (
		values: TJudicialBlocksAndTransfers,
		isCancelled: boolean
	) => {
		const component = (
			<JustificationModal
				onSubmitJustification={({
					justification,
					rejectionAndReturnReasonsId,
				}: {
					justification: string;
					rejectionAndReturnReasonsId: number | "";
				}) =>
					onSubmitReject(values, justification, rejectionAndReturnReasonsId)
				}
				reason={isCancelled ? "cancelled" : "returned"}
				moduloId={10}
			/>
		);

		const title =
			values.statusFlowId === STATUS_FLOW.CANCELLED
				? t("judicialBlocksAndTransfers:form.justificationForCancel")
				: t("judicialBlocksAndTransfers:form.justificationForReturn");

		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true, fullWidth: true },
		});
	};

	const onSubmit = async (
		inputs: TJudicialBlocksAndTransfers,
		{ setSubmitting }: any
	) => {

		const values = treatFormValuesWithOccurrenceReason(inputs);

		const normalizedValues = valuesToNumber<TJudicialBlocksAndTransfers>(
			["value",
			  "mainValue",
			  "fineValue",
			  "valueCharges",
			  "succumbingValue",
			  "historicalInterestValue"	
			],
			values
		) as any;


		const findOccurrenceType = paymentType.find(
			({ id }) => id === normalizedValues.occurrenceReason
		);

		if (
			findOccurrenceType?.abaterSaldoProvisao === 1 &&
			folderNumber &&
			filtredOrders.length >= 1 &&
			(normalizedValues.statusFlowId === STATUS_FLOW.FINISHED || normalizedValues.statusFlowId === STATUS_FLOW.IN_VALIDATION)
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

			/* const valordaocorrência = normalizedValues.value;

			const somatorioAberturaProvisao = paymentOrders.reduce(
				(sum, { value }) => sum + Number(value),
				0
			);
			const allOrdesRatings = filtredOrders
				.map(({ orderRatings }) => orderRatings)
				.flat(1)
				.filter(
					({ orderRatingProbababilityId, value }) =>
						value !== 0 && orderRatingProbababilityId === 1
				);
			const somaAllOrdesRatingsProvavel = allOrdesRatings.reduce(
				(sum, { value }) => sum + Number(value),
				0
			); */

			/* if (
				somatorioAberturaProvisao < valordaocorrência &&
				somatorioAberturaProvisao < somaAllOrdesRatingsProvavel
			) {

				enqueueSnackbar(
					`Valor lançado nos pedidos de provisão MENOR do valor da lançado.`,
					{ variant: "error" }
				);
				return;
			} */

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
								`Valor lançado nos pedidos de provisão MENOR do valor da lançado.`,
								{ variant: "error" }
							);
						}
					}
				}

			// const paymentOrdersWithOrder = associatePaymentOrdersWithOrder(
			// 	paymentOrders,
			// 	filtredOrders
			// );
			// let filtredOrderRatingDescriptions = [] as orderRatingDescription[];
			// 	orderRatingDescriptions.forEach((orderRatingDescription) => {
			// 		const filterPaymentOrdersWithOrder = paymentOrdersWithOrder.filter(
			// 			(item) =>
			// 				item.orderRatingDescription?.name ===
			// 				orderRatingDescription.descripiton
			// 		);
			// 		if (filterPaymentOrdersWithOrder.length !== 0) {
			// 			const sumFilterPaymentOrdersWithOrder =
			// 				filterPaymentOrdersWithOrder.reduce(
			// 					(sum, item) => sum + Number(item.value),
			// 					0
			// 				);
			// 			filtredOrderRatingDescriptions.push({
			// 				...orderRatingDescription,
			// 				sum: sumFilterPaymentOrdersWithOrder,
			// 			});
			// 		}
			// 	});
			// 	if (filtredOrderRatingDescriptions.length !== 0) {
			// 		for (
			// 			let index = 0;
			// 			index < filtredOrderRatingDescriptions.length;
			// 			index++
			// 		) {
			// 			const element = filtredOrderRatingDescriptions[index];
			// 			if (element.sum !== 0 && element.descripiton !== "Principal") {
			// 				const isConfirmed = await confirm(
			// 					"Deseja corrigir?",
			// 					"Valor do bloqueio e transferência não informado na abertura correta"
			// 				);
			// 				if (isConfirmed) return;
			// 			}
			// 		}
			// 	}
		}

		normalizedValues.evaluatorId = userId;

		if(values.occurrenceType === 2){
			const { mainValue, value, fineValue, valueCharges, succumbingValue, historicalInterestValue } = normalizedValues;
			const sumOfValues = (mainValue + fineValue + valueCharges + succumbingValue + historicalInterestValue).toFixed(2);
		
			if(Number(sumOfValues) !== value && isSolicitacao === false){
				enqueueSnackbar(
					`A somatória dos valores dos campos "Valor principal", "Valor multa", "Valor encargos", "Valor sucumbência", "Valor juros históricos" deve ser igual ao valor informado no campo "Valor"`,
					{ variant: "error" }
				);
				return;
			}
		}

		if (isNew){
			const arrayOfFilesLength: number[] = [];
			normalizedValues?.files?.forEach((file: any) => {
						arrayOfFilesLength.push(file?.name.length)
					})
					if(arrayOfFilesLength.some(number => number > 119)){
						return enqueueSnackbar(
							t("goodsAndGuarantees:characterLimiterWarningMessage"),
							{ variant: "error" }
						);
					}

			dispatch(
				addJudicialBlocksAndTransfers({
					...normalizedValues,
					bankToSendLicense: Number(normalizedValues?.bankToSendLicense),
					abaterSaldoProvisao: findOccurrenceType?.abaterSaldoProvisao,
					balanceBlocking: balanceBlocking,
				})
			);
		}
		else if (
			[STATUS_FLOW.CANCELLED, STATUS_FLOW.RETURNED].includes(
				normalizedValues.statusFlowId
			)
		) {
			if (!isCCJ)
				onJustify(
					normalizedValues,
					normalizedValues.statusFlowId === STATUS_FLOW.CANCELLED
				);
			else {
	
				dispatch(
					editJudicialBlocksAndTransfers({
						...normalizedValues,
						abaterSaldoProvisao: findOccurrenceType?.abaterSaldoProvisao,
						balanceBlocking: balanceBlocking,
						judicialBlocksAndTransferOrders: [
							{	
								id: 0,
								orderRatingId: orders[0].id ?? null,
								value: normalizedValues?.value,
								isDeleted: false
							}
						]
					})
				);
			}
		} else {
			
			const newStatusFlowId =
				isLegal && normalizedValues.statusFlowId === STATUS_FLOW.PENDING_LEGAL
					? STATUS_FLOW.PENDING_CCJ
					: normalizedValues.statusFlowId;

					if(orders.length === 1){
						const filteredOrders = orders[0]?.orderRatings.reduce((acc, item) => {
							const { orderRatingDescriptionId, orderRatingProbababilityId } = item;
		
							if (orderRatingDescriptionId === 1 && orderRatingProbababilityId === 1) {
							acc.mainValue = item;
							} else if (orderRatingDescriptionId === 2 && orderRatingProbababilityId === 1) {
							acc.fineValue = item;
							} else if (orderRatingDescriptionId === 3 && orderRatingProbababilityId === 1) {
							acc.historicalInterestValue = item;
							} else if (orderRatingDescriptionId === 4 && orderRatingProbababilityId === 1) {
							acc.valueCharges = item;
							} else if (orderRatingDescriptionId === 5 && orderRatingProbababilityId === 1) {
							acc.succumbingValue = item; 
							}
							return acc;
						}, {} as any);
	
						const processObject = (obj: any) => {
							return Object.entries(obj).map(([key, value]: any) => ({	
							id: 0,
							isDeleted: value.isDeleted,
							orderRatingId: value.id,
							value: findOccurrenceType?.abaterSaldoProvisao === 2 ? value.value : normalizedValues[key]
							}));
						}
	
						const judicialBlocksAndTransferOrders = await processObject(filteredOrders);

						const isJudicialBlocksAndTransfersOrdersToSend = orders[0]?.orderExpectationId === 1 && orders[0]?.orderStatusId === 2 && orders[0]?.isActive === true && findOccurrenceType?.abaterSaldoProvisao !== 0;
						const judicialBlocksAndTransferOrdersWhenSaldoProvisaoTwo = await processObject(orders[0]?.orderRatings)?.filter((order: any) => order?.value !== 0)
						
						
				dispatch(
					editJudicialBlocksAndTransfers({
						...normalizedValues,
						statusFlowId: newStatusFlowId,
						abaterSaldoProvisao: findOccurrenceType?.abaterSaldoProvisao,
						judicialBlocksAndTransferOrders: isJudicialBlocksAndTransfersOrdersToSend ? ( findOccurrenceType?.abaterSaldoProvisao === 2 ? judicialBlocksAndTransferOrdersWhenSaldoProvisaoTwo : judicialBlocksAndTransferOrders) : []
					})
				);
					} else {
						
					const judicialBlocksAndTransfersToSend = paymentOrders.map((order: any) => {
						return {
							id: 0,
							isDeleted: false,
							orderRatingId: order.orderRatingId,
							value: order.value
						}
					})

					const processObject = (obj: any) => {
						return Object.entries(obj).map(([key, value]: any) => ({	
						id: 0,
						isDeleted: value.isDeleted,
						orderRatingId: value.id,
						value:value.value
						}));
					}

					const judicialBlocksAndTransferOrdersWhenSaldoProvisaoTwo = orders.length !== 0 ? await processObject(orders[0]?.orderRatings)?.filter((order: any) => order?.value !== 0) : [];

					const isJudicialOrderToSend = findOccurrenceType?.abaterSaldoProvisao !== 0;

 							dispatch(
								editJudicialBlocksAndTransfers({
									...normalizedValues,
									statusFlowId: newStatusFlowId,
									abaterSaldoProvisao: findOccurrenceType?.abaterSaldoProvisao,
									judicialBlocksAndTransferOrders: isJudicialOrderToSend === true ? (findOccurrenceType?.abaterSaldoProvisao === 2 ? judicialBlocksAndTransferOrdersWhenSaldoProvisaoTwo : judicialBlocksAndTransfersToSend) : []
								})
								);
						}	
		} 
		setSubmitting(false);
	};

	const handleDelete = (file: any) => {
		if (file && file.id) {
			dispatch(deleteJudicialBlocksAndTransfersFile(file.id));
		}
	};

	const columns: ColumnData[] = [
		{
			label: t("judicialBlocksAndTransfers:accountingData.date"),
			field: "createdDate",
			type: "date",
		},
		{
			label: t("judicialBlocksAndTransfers:accountingData.number"),
			field: "documentNumber",
		},
	];

	const handleOnBlur = (event: any, orderRatingDescription = 1) => {
		const numberValue = toNumber(event?.target?.value ?? 0);
		const filtredOrders = orders.filter(
			({ isActive, orderRatings, orderExpectationId }) => {
				if (!isActive) return false;
				if (orderExpectationId !== 1) return false;

				const orderRatingProbabability = orderRatings
					.filter(
						({ orderRatingProbababilityId, value }) =>
							orderRatingProbababilityId === 1 && value !== 0 && value !== null
					)
					.pop();
				if (orderRatingProbabability?.value === undefined) return false;
				return true;
			}
		);
		const justOrderRating = filtredOrders
			.map(({ orderRatings }) => orderRatings)
			.flat(1);
		const fitredOrderRating = justOrderRating.filter(
			({ orderRatingDescriptionId, value, orderRatingProbababilityId }) =>
				value && orderRatingProbababilityId === 1
		);
		const totalValueOrderRating = fitredOrderRating.reduce(
			(sum, { value }) => sum + Number(value),
			0
		);
		if (paymentOrders.length)
			paymentOrders.map(item => dispatch(
				setPaymentOrders({
					...item,
					value: 0,
					isDeleted: true
				})
			))
		// if (fitredOrderRating.length === 1) {
		// 	dispatch(
		// 		setPaymentOrders({
		// 			id: 0,
		// 			paymentId: 0,
		// 			orderRatingId: Number(fitredOrderRating[0].id),
		// 			value: numberValue,
		// 		})
		// 	);
		// 	return;
		// }
		fitredOrderRating.map(({ value, id }) =>
			dispatch(
				setPaymentOrders({
					id: 0,
					paymentId: 0,
					orderRatingId: Number(id),
					value: numberValue >= totalValueOrderRating ? value : 0,
				})
			)
		);
	};

	const getstatusFlowIdOption = (occurrenceType: number, gerarBensGarantias: boolean): TOptionsSelect[] => {
		if (occurrenceType !== OCCURRENCE_TYPE.JUDICIAL_BLOCK)
			return solicitationStatusOptionsTransfer
		if (isNew)
			return [
				{ value: STATUS_FLOW.PENDING_CCJ, label: 'Pendente' },
				{ value: STATUS_FLOW.IN_UNLOCK, label: 'Em desbloqueio' },
			]
		if (gerarBensGarantias)
			return [
				{ value: STATUS_FLOW.RETURNED, label: 'Devolvido' },
				{ value: STATUS_FLOW.IN_UNLOCK, label: 'Em desbloqueio' },
				{ value: STATUS_FLOW.CANCELLED, label: 'Cancelado' },
			]
		return [
			{ value: STATUS_FLOW.UNLOCKED, label: 'Desbloqueado' },
			{ value: STATUS_FLOW.CANCELLED, label: 'Cancelado' },
		]
	}

	useEffect(() => {
		if(isNew === false){
			setBalanceBlocking(item?.balanceBlocking)
		}
	}, [isNew])

	return (
		<>
			<Form
				enableReinitialize
				initialValues={finalInitialValues}
				onSubmit={onSubmit}
				innerRef={form}
			>
				{({
					handleSubmit,
					isSubmitting,
					setSubmitting,
					values,
					status: statusForm,
				}) => {
					const isReadonly = isFormReadonly || statusForm === "readOnly";
					const selectPaymentType = paymentType.find(
						({ id }: any) => id === values?.occurrenceReason
					)
					const abaterSaldoProvisao = selectPaymentType?.abaterSaldoProvisao;
					const gerarBensGarantias = !!selectPaymentType?.gerarBensGarantias as boolean;

					return (
						<>
							{abaterSaldoProvisao === 1 &&
								folderNumber &&
								values.occurrenceType === 2 && 
								filtredOrders.length > 1 && (
									<AccordionPanel title={"Pedidos de provisão"}>
										<AccountabilityModal
											folderNumber={folderNumber}
											isEditable={!isFormReadonly}
											dictionary={{
												1: "value",
												2: "value",
												3: "value",
												4: "value",
												5: "value",
											}}
											form={form}
											isSpecialSetFormValues
											isOrderRatingDescription1Only
										/>
									</AccordionPanel>
								)}
							<form noValidate onSubmit={handleSubmit}>
								<Panel
									title={t("judicialBlocksAndTransfers:form.occurrenceData")}
									withPadding
								>
									<Grid container spacing={3}>
										<Grid item xs={12} md={3}>
											<FieldColumn
												label={t("judicialBlocksAndTransfers:form.requestDate")}
												value={values.createdDate}
												type="date"
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<FieldColumn
												label={t("judicialBlocksAndTransfers:form.finishedDate")}
												value={values.endDateOfEvent}
												type="date"
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<TextField
												label={t("field.company")}
												name="company"
												readOnly={isReadonly}
												required
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<NumericField
												name="exercise"
												label={t("creditReceipt:form.exercise")}
												readOnly={isReadonly}
												required
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<NumericField
												label={t("judicialBlocksAndTransfers:form.documentNumber")}
												name="accountingDocumentNumber"
												placeholder={t("form.typeHere")}
												readOnly={isReadonly}
												required
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<SelectField
												label={"Banco Origem"}
												name="bankId"
												options={banksAsOptions}
												readOnly={isReadonly}
												required
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<TextField
												label={"Agência"}
												name="agency"
												readOnly={isReadonly}
												required
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<TextField
												label={"N.° conta bloqueada/transf."}
												name="blockedAccountNumber"
												readOnly={isReadonly}
												required
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<DateField
												label={t("judicialBlocksAndTransfers:form.blockAndTransfersDate")}
												name="blockOrTransfDate"
												readOnly={isReadonly}
												required
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<NumericField
												label={"Conta banco Origem"}
												name="bankToSendLicense"
												placeholder={t("form.typeHere")}
												readOnly={isReadonly}
												required
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<CurrencyField
												label={t("judicialBlocksAndTransfers:form.value")}
												name="value"
												required
												min={0.01}
												readOnly={isReadonly}
												onBlur={(event) => handleOnBlur(event, 1)}
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<SelectField
												label={t("judicialBlocksAndTransfers:form.occurrenceType")}
												name="occurrenceType"
												options={occurrenceTypesOptions}
												readOnly={isReadonly}
												required
											/>
										</Grid>
										{
											values.occurrenceType === 1 ?
											<Grid item xs={12} md={3}>
												<FormControlLabel
														control={<Checkbox
															disabled={isReadonly}
															readOnly={isReadonly}
															color="primary"
															checked={balanceBlocking}
															onChange={() => {
																setBalanceBlocking((state) => !state);
															} } />} 
														label={"Bloqueio saldo"}												/>
												
											</Grid> : null
										}
										{
											values.occurrenceType === 2 ? <>
												<Grid item xs={12} md={3}>
													<CurrencyField
														label={t("judicialBlocksAndTransfers:form.mainValue")}
														name="mainValue"
														readOnly={isReadonly}	
												/>
												</Grid>
												<Grid item xs={12} md={3}>
													<CurrencyField
														label={t("judicialBlocksAndTransfers:form.fineValue")}
														name="fineValue"
														readOnly={isReadonly}	
													/>
												</Grid>
												<Grid item xs={12} md={3}>
													<CurrencyField
														label={t("judicialBlocksAndTransfers:form.valueCharges")}
														name="valueCharges"
														readOnly={isReadonly}	
													/>
												</Grid>
												<Grid item xs={12} md={3}>												
													<CurrencyField
														label={t("judicialBlocksAndTransfers:form.succumbingValue")}
														name="succumbingValue"
														readOnly={isReadonly}	
													/>
												</Grid>
												<Grid item xs={12} md={3}>
													<CurrencyField
														label={t("judicialBlocksAndTransfers:form.historicalInterestValue")}
														name="historicalInterestValue"
														readOnly={isReadonly}	
													/>
												</Grid>
											</> : null
										}
										<Grid item xs={12} md={3}>
											<SelectField
												label={t("judicialBlocksAndTransfers:form.occurrenceReason")}
												name="occurrenceReason"
												options={paymentTypeAsOptions}
												readOnly={isReadonly}
												required={!isNew}
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<TextField
												label={t("judicialBlocksAndTransfers:form.local")}
												name="locateDistrict"
												readOnly={isReadonly}
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<SelectField
												label={"Banco cta destino "}
												name="destinationBankAccountId"
												options={banksAsOptions}
												readOnly={isReadonly}
											/>
										</Grid>

										<Grid item xs={12} md={3}>
											<NumericField
												label={t("judicialBlocksAndTransfers:form.accountNumber")}
												name="judicialAccountNumber"
												placeholder={t("form.typeHere")}
												readOnly={isReadonly}
											/>
										</Grid>

										{isFormReadonly && (
											<Grid item xs={12} md={3}>
												<SelectField
													label={t(
														"judicialBlocksAndTransfers:form.occurrenceStatus"
													)}
													name="statusFlowId"
													//ATENCAO
													//ATENCAO
													//ATENCAO
													//ATENCAO NAO MEXA NAS OPTIONS NESSE CAMPO ELE FOI FEITO E REFEITO UMAS 10 VEZES ESSA DEVEIRA SER A VERSAO FINAL!!!!!!!!
													//ATENCAO
													//ATENCAO
													//ATENCAO
													// options={allStatusOptionsTransfer}
													options={(item.statusFlowId === STATUS_FLOW.IN_UNLOCK &&
														isSolicitacao &&
														item.statusApprovalId === 1)
														? [{ value: STATUS_FLOW.CANCELLED, label: 'Cancelado' }]
														:  allStatusOptionsTransfer}
													//ATENCAO
													//ATENCAO
													//ATENCAO
													readOnly={
														item.statusFlowId === STATUS_FLOW.IN_UNLOCK &&
															isSolicitacao &&
															item.statusApprovalId === 1
															? false
															: isReadonly
													}
												/>
											</Grid>
										)}
										{!isFormReadonly && isSolicitacao && (
											<Grid item xs={12} md={3}>
												<SelectField
													label={t(
														"judicialBlocksAndTransfers:form.occurrenceStatus"
													)}
													name="statusFlowId"
													//ATENCAO
													//ATENCAO
													//ATENCAO
													//ATENCAO NAO MEXA NAS OPTIONS NESSE CAMPO ELE FOI FEITO E REFEITO UMAS 10 VEZES ESSA DEVEIRA SER A VERSAO FINAL!!!!!!!!
													//ATENCAO
													options={getstatusFlowIdOption(Number(values.occurrenceType), gerarBensGarantias)}
													//ATENCAO LEIA ANTES DE ALTERAR

													//ATENCAO
													//ATENCAO
													//ATENCAO
													//ATENCAO
													readOnly={isReadonly}
												/>
											</Grid>
										)}
										{!isFormReadonly && !isSolicitacao && (
											<Grid item xs={12} md={3}>
												<SelectField
													label={t(
														"judicialBlocksAndTransfers:form.occurrenceStatus"
													)}
													name="statusFlowId"
													//ATENCAO
													//ATENCAO
													//ATENCAO NAO MEXA NAS OPTIONS NESSE CAMPO ELE FOI FEITO E REFEITO UMAS 10 VEZES ESSA DEVEIRA SER A VERSAO FINAL!!!!!!!!
													options={evaluationStatusOptions}
													//ATENCAO
													//ATENCAO
													//ATENCAO
													readOnly={isReadonly}
												/>
											</Grid>
										)}
										<Grid item xs={12} md={3}>
											<TextField
												label={"Responsável"}
												name="responsibleName"
												readOnly={isReadonly}
												maxLength={60}
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<DateField
												label={"Data desbloqueio"}
												name="unlockDate"
												readOnly={isReadonly}
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<NumericField
												label={"Empresa doc. desbloqueio"}
												name="companyDocumentUnlock"
												placeholder={t("form.typeHere")}
												readOnly={isReadonly}
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<NumericField
												label={"Exercício doc. desbloqueio"}
												name="exerciseUnlock"
												placeholder={t("form.typeHere")}
												readOnly={isReadonly}
											/>
										</Grid>
										<Grid item xs={12} md={3}>
											<NumericField
												label={"Nº doc. desbloqueio"}
												name="unlockDocumentNumber"
												placeholder={t("form.typeHere")}
												readOnly={isReadonly}
											/>
										</Grid>

										<Grid item xs={12} md={12}>
											<TextField
												name="description"
												label={t("judicialBlocksAndTransfers:form.description")}
												rows={5}
												maxLength={10000}
												readOnly={isReadonly}
												multiline
											/>
										</Grid>
									</Grid>
								</Panel>						
								<Attachments
									name="files"
									disabled={isReadonly}
									onDelete={handleDelete}
								/>
								<ProssibleApprovers
									items={
										item?.aprovadores?.map((item) => ({
											...item,
											approverName: item?.nameApprover ?? "",
											hierarchyDescription: item?.codeHierarchy ?? "",
										})) ?? []
									}
								/>
								{!isNew && accounting && accounting.length && (
									<AccordionPanel
										title={t("judicialBlocksAndTransfers:accounting")}
									>
										<TableComponent
											columns={columns}
											rows={accounting.map((item) => ({
												createdDate: item.releaseDate,
												documentNumber: `${item?.company} ${item?.exercice} ${item?.documentNumber}`,
											}))}
										/>
										{/* <Grid container spacing={3}>
											<Grid item xs={12} md={3}>
												<FieldColumn
													value={accounting?.createdDate}
													label={t(
														"judicialBlocksAndTransfers:accountingData.date"
													)}
													type="date"
												/>
											</Grid>
											<Grid item xs={12} md={3}>
												<FieldColumn
													value={`${accounting?.company} ${accounting?.exercice} ${accounting?.documentNumber}`}
													label={t(
														"judicialBlocksAndTransfers:accountingData.number"
													)}
												/>
											</Grid>
										</Grid> */}
									</AccordionPanel>
								)}

								{[STATUS_FLOW.CANCELLED, STATUS_FLOW.RETURNED].includes(
									item.statusFlowId
								) && (
										<JustificationDisplay
											logs={item.logs}
											status={item.statusFlowId}
											type={
												item.statusFlowId === STATUS_FLOW.CANCELLED
													? "cancelled"
													: "returned"
											}
											moduloId={10}
										/>
									)}
								<Logs
									logs={item.logs}
									statuses={allStatusAsObject}
									statusOrder={["flow"]}
								/>
								{!isNew && unlocks && unlocks.length > 0 && (
									<AccordionPanel
										title={t("judicialBlocksAndTransfers:unlocks")}
									>
										<Grid container spacing={3}>
											{unlocks.map((unlock) => (
												<>
													<Grid item xs={6}>
														<FieldColumn
															value={unlock.releaseDate}
															label={t(
																"judicialBlocksAndTransfers:accountingData.date"
															)}
															type="date"
														/>
													</Grid>
													<Grid item xs={6}>
														<FieldColumn
															value={`${unlock.company} ${unlock.exercice} ${unlock.documentNumber}`}
															label={t(
																"judicialBlocksAndTransfers:accountingData.number"
															)}
														/>
													</Grid>
												</>
											))}
										</Grid>
									</AccordionPanel>
								)}
								{((values.statusFlowId === STATUS_FLOW.CANCELLED &&
									item.statusApprovalId === 1) ||
									!isReadonly) && (
										<Grid
											container
											direction="row"
											justifyContent="flex-end"
											className="margin-top-16"
											spacing={2}
										>
											<Grid item>
												<CancelButton />
											</Grid>
											<Grid item>
												<Submit
													isNew={isNew}
													submitting={
														isSubmitting ||
														statusSubmit === "saving" ||
														provisionsProcessLoading
													}
												/>
											</Grid>
										</Grid>
									)}
								{statusSubmit === "failure" &&
									isSubmitting &&
									setSubmitting(false)}
							</form>
						</>
					);
				}}
			</Form>
		</>
	);
};

export default JudicialBlocksAndTransfersForm;
