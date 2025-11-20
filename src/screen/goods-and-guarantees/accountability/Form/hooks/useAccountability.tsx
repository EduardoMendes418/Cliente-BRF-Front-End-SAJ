import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import JustificationModal, {
	TForm as TJustificationModalForm,
} from "src/components/JustificationModal";
import { modal } from "src/components/modals";

import {
	addGuaranteeAccountability,
	editGuaranteeAccountability,
	addGuaranteeAccountabilityReverse,
} from "src/core/store/modules/guarantee-accountability/thunks";

import { TGuaranteeAccountability } from "src/core/models/guarantee-accountability";
import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import { numberToCurrency, valuesToNumber } from "src/core/utils/func";

import {
	TProvisionOrder,
	TpaymentOrders,
} from "src/core/models/provision-order";
import { t } from "src/locale/i18n";

import {
	ACCOUNTABILITY_SITUATION,
	ACCOUNTABILITY_STATUS,
	requesterAccountabilityStatus,
	returnedStatus,
	statusToShowJustification,
} from "../../constants";

import { BEARISH_REASONS } from "src/screen/goods-and-guarantees/constants";
import { FormikHelpers } from "formik";
import { AppDispatch } from "src/core/store";
import { associatePaymentOrdersWithOrder } from "src/components/AccountabilityModal/OrderTable";
import { setAllPaymentOrders } from "src/core/store/modules/provision-order";
import { useSnackbar } from "notistack";
import { getPendingConfrontOrders } from "src/core/store/modules/confronting-orders/thunks";
import { checkHasPaymentPending } from "src/core/store/modules/provision-order/thunks";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";

export type TForm = TGuaranteeAccountability & {
	justification: string;
	writeOffDate: string;
	reverseAccounting?: boolean
};

type Props = {
	hasItem: boolean;
	itemAccountability: TGuaranteeAccountability;
	itemRequest: TGoodsGuaranteesRequest;
	isJudicialDeposit?: boolean;
	isRequester: boolean;
	isSolicitation?: boolean;
	orders: TProvisionOrder[];
	paymentOrders: TpaymentOrders[];
	isReversal?: boolean;
};

const numberFields = [
	"amountWrittenOff",
	"fine",
	"historicalInterest",
	"charge",
	"succumbence",
	"updateAmountWrittenOff",
	"creditedAmount",
	"incomeTax",
	"electronicTransferRate",
	"totalAmountWrittenOff",
	"covenantRate",
	"updateValueCredited",
	"valueGuarantee",
];

const accountabilityFormFormSchema = yup.object({
	files: yup.array().when("reverseAccounting", {
		is: false,
		then: yup.array().required().min(1, t("required")),
	}),
});

const justificationModalTitle = {
	rejected: t(
		"goodsAndGuarantees:accountability.justificationForReproveAccountability"
	),
	returned: t(
		"goodsAndGuarantees:accountability.justificationForReturnAccountability"
	),
	reversed: t(
		"goodsAndGuarantees:accountability.justificationForReversalAccountability"
	),
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
		valueDescripiton: "amountWrittenOff",
		orderRatingProbababilityId: 1,
	},
	{
		descripiton: "Multa",
		valueDescripiton: "fine",
		orderRatingProbababilityId: 2,
	},
	{
		descripiton: "Juros Históricos",
		orderRatingProbababilityId: 3,
		valueDescripiton: "historicalInterest",
	},
	{
		descripiton: "Encargos",
		valueDescripiton: "charge",
		orderRatingProbababilityId: 4,
	},
	{
		descripiton: "Sucumbência",
		valueDescripiton: "succumbence",
		orderRatingProbababilityId: 5,
	},
] as orderRatingDescription[];

const getValueByorderRatingProbababilityId = (
	values: any,
	OrderRatingDescriptions: number
): number => {
	switch (OrderRatingDescriptions) {
		case 1:
			return Number(values.amountWrittenOff);
		case 2:
			return Number(values.fine);
		case 3:
			return Number(values.historicalInterest);
		case 4:
			return Number(values.charge);
		case 5:
			return Number(values.succumbence);
		default:
			return 0;
	}
};

export const useAccountability = ({
	hasItem,
	itemAccountability,
	itemRequest,
	isRequester,
	orders,
	paymentOrders,
	isSolicitation = false,
	isJudicialDeposit,
	isReversal,
}: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	const user = useSelector(getDataCurrentUser);
	const { enqueueSnackbar } = useSnackbar();
	const id = Number(itemAccountability.id);

	const pending =
		itemAccountability.status === ACCOUNTABILITY_SITUATION.PENDING;
	const rejected =
		itemAccountability.status === ACCOUNTABILITY_SITUATION.REJECTED;
	const approved =
		itemAccountability.status === ACCOUNTABILITY_SITUATION.APPROVED;

	const onSubmitAccountabilityWithJustification = useCallback(
		({
			rejectionAndReturnReasonsId,
			...values
		}: TJustificationModalForm & TForm) => {
			const payload = {
				...values,
				reasonForFailure: rejectionAndReturnReasonsId,
			};

			if (isReversal) {
				return dispatch(
					addGuaranteeAccountabilityReverse({
						files: values.files,
						creditReceiptIds: [],
						accountabilityIds: [Number(values.id)],
						note: values.note,
						email: values.email,
						evaluationDescription: values.evaluationDescription,
						rejectionAndReturnReasonsId,
						justification: values.justification,
					})
				);
			}
			return hasItem
				? dispatch(editGuaranteeAccountability({ ...payload, id }))
				: dispatch(addGuaranteeAccountability(payload));
		},
		[id, hasItem, dispatch, isReversal]
	);

	const onJustify = useCallback(
		(values: TForm) => {
			let reasonType: "returned" | "rejected" | "reversed" = "returned";
			if (!returnedStatus.includes(values.statusFlowId))
				reasonType =
					values.status === ACCOUNTABILITY_SITUATION.REJECTED
						? "rejected"
						: "reversed";
			if (isReversal) reasonType = "reversed";
			const component = (
				<JustificationModal
					reason={reasonType}
					onSubmitJustification={({
						justification,
						rejectionAndReturnReasonsId,
					}: TJustificationModalForm) =>
						onSubmitAccountabilityWithJustification({
							...values,
							justification,
							rejectionAndReturnReasonsId,
						})
					}
					moduloId={9}
				/>
			);

			modal({
				title: justificationModalTitle[isReversal ? "reversed" : reasonType],
				component,
				buttons: [],
				dialogProps: {
					maxWidth: "md",
					showCloseButton: true,
					fullWidth: true,
				},
			});
		},
		[onSubmitAccountabilityWithJustification, isReversal]
	);

	const initialValues = useMemo(() => {
		if (hasItem) {
			dispatch(setAllPaymentOrders(itemAccountability.accountabilityOrders));

			if (
				(isRequester &&
				itemAccountability.bearishReasons ===
					BEARISH_REASONS.RELEASED_TO_COMPANY &&
				itemAccountability.status === ACCOUNTABILITY_SITUATION.OFFICE_PENDING) || isSolicitation
			) {
				return {
					...itemAccountability,
				};
			};

			return {
				...itemAccountability,
				justification: itemAccountability.justification ?? "",
				evaluator: itemAccountability.evaluator ?? "",
				valuationDate: itemAccountability.valuationDate ?? new Date(),
				writeOffDate: itemAccountability.writeOffDate ?? null,
				evaluationDescription: itemAccountability.evaluationDescription ?? "",
			};
		}

		const {
			id: goodsGuaranteesRequestId,
			valueGuarantee: amountWrittenOff,
			folderNumber,
		} = itemRequest;

		const amountWrittenOffAsCurrency = numberToCurrency(
			Number(amountWrittenOff)
		);
		
		return {
			status: ACCOUNTABILITY_SITUATION.PENDING,
			statusFlowId: ACCOUNTABILITY_STATUS.PENDING,
			goodsGuaranteesRequestId,
			folderNumber,
			amountWrittenOff: amountWrittenOffAsCurrency,
			totalAmountWrittenOff: amountWrittenOff,
			bearishReasons: "",
			licenseNumber: "",
			licenseDate: null,
			replacementGoodGuaranteeId: null,
			description: "",
			files: [],
		};
	}, [
		hasItem,
		itemRequest,
		dispatch,
		itemAccountability,
		isRequester,
		user.name,
	]) as TForm;

	const onSubmit = useCallback(
		async (values: TForm, { setSubmitting }: FormikHelpers<any>) => {
			setSubmitting(false);
			const normalizedValues = valuesToNumber<TForm>(numberFields, {
				...values,
				justification: "",
				reasonForFailure: null,
				accountabilityOrders: values.accountabilityOrders ?? [],
			});

			if (isReversal) {
				setSubmitting(true);
				return onJustify(normalizedValues);
			};

			if (
				(normalizedValues.bearishReasons ===
					BEARISH_REASONS.CONVERTED_TO_PAYMENT ||
					normalizedValues.bearishReasons === BEARISH_REASONS.LOW_FOR_LOSS) &&
				isJudicialDeposit &&
				!isSolicitation &&
				normalizedValues.statusFlowId === ACCOUNTABILITY_STATUS.DEAD &&
				normalizedValues.status === ACCOUNTABILITY_SITUATION.APPROVED
			) {
				const {
					meta: metaConfrontOrders,
					payload: { pending: pendingConfrontOrders },
				} = await dispatch(
					getPendingConfrontOrders(normalizedValues.folderNumber)
				);

				if (
					metaConfrontOrders.requestStatus === "rejected" ||
					pendingConfrontOrders
				) {
					enqueueSnackbar("Existe confrontador pendente para esta pasta/CTG", {
						variant: "error",
					});
				}

				const { meta: metaPayment, payload: pendingPayment } = await dispatch(
					checkHasPaymentPending(normalizedValues.folderNumber)
				);

				if (metaPayment.requestStatus === "rejected" || pendingPayment) {
					enqueueSnackbar("Existe pagamento pendente para esta pasta/CTG", {
						variant: "error",
					});
				}

				setSubmitting(true);
				if (pendingConfrontOrders || pendingPayment) {
					return;
				}
			};

			if (
				!isSolicitation &&
				(statusToShowJustification.includes(values.statusFlowId) ||
					values.status === ACCOUNTABILITY_SITUATION.REJECTED)
			) {
				setSubmitting(true);
				return onJustify(normalizedValues);
			};

			setSubmitting(true);

			const filtredOrders = orders.filter(({ isActive, orderRatings, orderExpectationId, orderDescription }) => {
				if (!isActive) return false;
				if (orderExpectationId !== 1) return false;
				if (!orderDescription?.sumProvision) return false
				return orderRatings.some(({ orderRatingProbababilityId, value }) => orderRatingProbababilityId === 1 && value !== 0)
			});

			let finalPaymentOrders = [] as TpaymentOrders[];

			if (
				filtredOrders.length === 1 &&
				[
					BEARISH_REASONS.CONVERTED_TO_PAYMENT,
					BEARISH_REASONS.LOW_FOR_LOSS,
				].findIndex((br) => br === normalizedValues.bearishReasons) !== -1 &&
				isRequester
			) {
				const [{ orderRatings }] = filtredOrders;
				const filtredOrderRatings = orderRatings.filter(
					(item) =>
						item.orderRatingProbabability.account &&
						item.orderRatingProbabability.id === 1
				);

				finalPaymentOrders = filtredOrderRatings.map(
					(item) =>
						({
							id: 0,
							paymentId: 0,
							accountabilityId: item.accountabilityId ?? 0,
							orderRatingId: item.id,
							value: getValueByorderRatingProbababilityId(
								normalizedValues,
								Number(item.orderRatingDescriptionId)
							),
						} as TpaymentOrders)
				);
			} else finalPaymentOrders = paymentOrders;
			
			const paymentOrdersWithOrder = associatePaymentOrdersWithOrder(
				paymentOrders,
				filtredOrders
			);

			if (
				filtredOrders.length > 1 &&
				[
					BEARISH_REASONS.CONVERTED_TO_PAYMENT,
					BEARISH_REASONS.LOW_FOR_LOSS,
				].findIndex((br) => br === normalizedValues.bearishReasons) !== -1
			) {
				// if (
				// 	values.totalAmountWrittenOff >
				// 	paymentOrders.reduce((sum, { value }) => sum + Number(value), 0)
				// )
				orderRatingDescriptions.forEach((orderRatingDescription) => {});

				const filtredOrderRatingDescriptions = [] as orderRatingDescription[];

				orderRatingDescriptions.forEach((orderRatingDescription) => {
					const filterPaymentOrdersWithOrder = paymentOrdersWithOrder.filter(
						(item) =>
							item.orderRatingDescription?.name ===
							orderRatingDescription.descripiton
					);
					if (filterPaymentOrdersWithOrder.length !== 0) {
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
				
				if (filtredOrderRatingDescriptions.length !== 0) {
					for (
						let index = 0;
						index < filtredOrderRatingDescriptions.length;
						index++
					) {
						const {sum, valueDescripiton, somaAllOrdesRatingsProvavel} = filtredOrderRatingDescriptions[index];
						if (
							Number(sum) < (normalizedValues as any)[valueDescripiton] && Number(sum) < Number(somaAllOrdesRatingsProvavel)
						) {
							return enqueueSnackbar(
								`Valor lançado nos pedidos de provisão são MENOR do valor da prestação de contas.`, //prestação de contas -> pagamento
								{ variant: "error" }
							);
						}
					}
				}
			};

			if (
				(!hasItem &&
					!statusToShowJustification.includes(values.statusFlowId) &&
					isSolicitation) ||
				Number.isNaN(id)
			) {
				const arrayOfFilesLength: number[] = [];
	
				normalizedValues?.files.forEach((file: any) => {
					arrayOfFilesLength.push(file?.name.length)
				})
				if(arrayOfFilesLength.some(number => number > 119)){
					return enqueueSnackbar(
						t("goodsAndGuarantees:characterLimiterWarningMessage"),
						{ variant: "error" }
					);
				} else {
					return dispatch(
						addGuaranteeAccountability({
							...normalizedValues,
							accountabilityOrders: finalPaymentOrders.filter(
								({ value }) => value
							),
						})
					);
				}
			};

			if (
				requesterAccountabilityStatus.includes(
					itemAccountability.statusFlowId
				) ||
				(itemAccountability.statusFlowId === ACCOUNTABILITY_STATUS.PENDING &&
					itemAccountability.status ===
						ACCOUNTABILITY_SITUATION.OFFICE_PENDING) ||
				isSolicitation
			) {
				
				delete normalizedValues.goodsGuaranteesRequest
				delete normalizedValues.logs
				/* delete normalizedValues.files */

				return dispatch(
					editGuaranteeAccountability({
						...normalizedValues,
						id,
						statusFlowId: ACCOUNTABILITY_STATUS.PENDING,
						status: ACCOUNTABILITY_SITUATION.PENDING,
						accountabilityOrders: finalPaymentOrders.filter(
							({ value }) => value
						),
					})
				)
			};

			delete normalizedValues.goodsGuaranteesRequest
			delete normalizedValues.logs
			/* delete normalizedValues.files */

			return dispatch(
				editGuaranteeAccountability({
					...normalizedValues,
					id,
					accountabilityOrders: finalPaymentOrders.filter(({ value }) => value),
				})
			);
		},
		[
			isJudicialDeposit,
			isSolicitation,
			paymentOrders,
			orders,
			hasItem,
			id,
			itemAccountability.statusFlowId,
			itemAccountability.status,
			dispatch,
			enqueueSnackbar,
			onJustify,
			isRequester,
			isReversal,
		]
	);

	return {
		approved,
		rejected,
		pending,
		onSubmit,
		initialValues,
		accountabilityFormFormSchema,
	};
};
