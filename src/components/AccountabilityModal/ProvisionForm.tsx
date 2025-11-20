import {
	Box,
	Button as Btn,
	Divider,
	Grid,
	IconButton,
	Typography,
} from "@material-ui/core";
import { Formik, FormikHelpers, FormikProps } from "formik";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import { useDispatch, useSelector } from "react-redux";

import AccordionPanel from "src/components/AccordionPanel";
import { CurrencyField, DateField, SelectField } from "src/components/form";
import { t } from "src/locale/i18n";
import {
	TProvisionOrderForm,
	TpaymentOrders,
} from "src/core/models/provision-order";
import {
	getOrderOnEdit,
	getBlockedData,
	getProvisionsProcess,
} from "src/core/store/modules/provision-order/selectors";
import { clearOrderToEdit } from "src/core/store/modules/provision-order";
import useOptionsList from "src/hooks/useProvisionFilterOptions";
import useBoolean from "src/hooks/useBoolean";

import {
	getOrderForm,
	getOrderRatingForm,
} from "src/screen/provisions/utils/func";
import OrderRatingTable from "./OrderRatingTable";
import { ChangeEvent, RefObject } from "react";
import { valuesToNumber, toNumber } from "src/core/utils/func";
import { setPaymentOrders } from "src/core/store/modules/provision-order";
import {
	getOrders,
	getPaymentOrders,
} from "src/core/store/modules/provision-order/selectors";
import { associatePaymentOrdersWithOrder } from "src/components/AccountabilityModal/OrderTable";

const buttonStyle = { marginLeft: "16px" };

export const initialValuesPayment = {
	probablePaymentValue: 0,
	possiblePaymentValue: 0,
	remotePaymentValue: 0,
};
export const initialValues: TProvisionOrderForm = {
	...getOrderForm(),
	...getOrderRatingForm(),
	...initialValuesPayment,
};

type Props = {
	formikRef: RefObject<FormikProps<TProvisionOrderForm>>;
	onChangeOrderDescription: (event: ChangeEvent<HTMLSelectElement>) => void;
	setFormValues: (overrideValues: Partial<TProvisionOrderForm>) => void;
	clearOrderDescription: () => void;
	isEditable: boolean;
	paymentOrders: TpaymentOrders[];
	form?: any;
	isSpecialSetFormValues?: boolean;
	dictionary?: any;
	isOrderRatingDescription1Only?: boolean;
};

const ProvisionForm = ({
	formikRef,
	onChangeOrderDescription,
	setFormValues,
	clearOrderDescription,
	isEditable,
	paymentOrders,
	form,
	isSpecialSetFormValues,
	dictionary,
	isOrderRatingDescription1Only = false,
}: Props) => {
	const dispatch = useDispatch();

	const [
		isOrderRatingOnEdit,
		{ setTrue: enableEditingOrderRating, setFalse: disableEditinOrderRating },
	] = useBoolean(false);
	const paymentOrdersTotal = useSelector(getPaymentOrders);
	const orders = useSelector(getOrders);
	const orderOnEdition = useSelector(getOrderOnEdit);
	const { legalDepartmentAreaId } = useSelector(getProvisionsProcess);
	const { isExpectationBlocked, isFormBlocked } = useSelector(getBlockedData);

	const {
		orderDescriptionOptions,
		orderExpectationOptions,
		orderProbabilityOptions,
		orderRatingDescriptionOptions,
		orderStatusOptions,
	} = useOptionsList(legalDepartmentAreaId);

	const isOrderOnEdit = Boolean(orderOnEdition);

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

	const paymentOrdersWithOrder = associatePaymentOrdersWithOrder(
		paymentOrdersTotal,
		filtredOrders
	);
	const valueOrderEqualValue = {};

	for (let index = 1; index <= 5; index++) {
		const value = paymentOrdersWithOrder
			.filter(
				({ orderRatingDescriptionId }) => orderRatingDescriptionId === index
			)
			.reduce((sum, { value }) => sum + Number(value), 0);
		const valueOrder = paymentOrdersWithOrder
			.filter(
				({ orderRatingDescriptionId }) => orderRatingDescriptionId === index
			)
			.reduce((sum, { valueOrder }) => sum + Number(valueOrder), 0);
		const accountabilityValue = toNumber(
			`${form?.current?.values?.[dictionary[index]] ?? 0}`
		);
			  
		(valueOrderEqualValue as any)[index] =
			!!value && value === valueOrder && value < accountabilityValue;
	}

	const onSubmit = (
		values: TProvisionOrderForm,
		{ setSubmitting }: FormikHelpers<TProvisionOrderForm>
	) => {
		const normalizedValues = {
			...(valuesToNumber(
				[
					"probablePaymentValue",
					"possiblePaymentValue",
					"remotePaymentValue",
					"probableValue",
				],
				values
			) as TProvisionOrderForm),
		};
		if (isSpecialSetFormValues) {
			const findTotal =
				paymentOrdersTotal.find(
					(item) => item.orderRatingId === normalizedValues.probableId
				) ?? ({} as { id: number });
			const filterPaymentOrdersWithOrder = paymentOrdersWithOrder.filter(
				({ orderRatingDescriptionId, orderRatingId }) =>
					(orderRatingDescriptionId ===
						normalizedValues.orderRatingDescriptionId || isOrderRatingDescription1Only) &&
					orderRatingId !== Number(normalizedValues.probableId)
			);
			const sumOfPaymentOrdersWithOrder = filterPaymentOrdersWithOrder.reduce(
				(sum, { value }) => sum + Number(value),
				0
			);
			const maxValue =
				toNumber(
					`${
						form.current.values[
							dictionary[normalizedValues.orderRatingDescriptionId]
						]
					}`
				) - sumOfPaymentOrdersWithOrder;
			const probablePaymentValue = Number(
				normalizedValues.probablePaymentValue
			);
			const valueToBeSubtracted =
				probablePaymentValue > maxValue ? maxValue : probablePaymentValue;
			const valueToBeSaved = valueToBeSubtracted >= Number(normalizedValues.probableValue) ? Number(normalizedValues.probableValue) : valueToBeSubtracted;
			dispatch(
				setPaymentOrders({
					id: findTotal.id ?? 0,
					paymentId: 0,
					orderRatingId: Number(normalizedValues.probableId),
					value: valueToBeSaved,
				})
			);
			setSubmitting(false);
			return;
		}
		const findTotalP =
			paymentOrdersTotal.find(
				(item) => item.orderRatingId === normalizedValues.probableId
			) ?? ({} as { id: number });
		dispatch(
			setPaymentOrders({
				id: findTotalP.id ?? 0,
				paymentId: 0,
				orderRatingId: normalizedValues.probableId,
				value: Number(normalizedValues.probablePaymentValue),
			})
		);
		setSubmitting(false);
		return;
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize
			innerRef={formikRef}
		>
			{({ handleSubmit, values }) => (
				<form noValidate onSubmit={handleSubmit}>
					<AccordionPanel
						title={t("provisions:request.provisionRequestTitle")}
						startExpanded
					>
						<Grid container spacing={2}>
							<Grid item xs={12} md={3}>
								<SelectField
									label={`${t("provisions:fields.requestDescription")} *`}
									name="orderDescriptionId"
									disabled={isOrderOnEdit || isFormBlocked}
									readOnly
									options={orderDescriptionOptions}
									onChange={onChangeOrderDescription}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									label={t("provisions:fields.requestDate")}
									name="createdDate"
									disabled={isOrderOnEdit || isFormBlocked}
									readOnly
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={`${t("provisions:fields.expectation")} *`}
									name="orderExpectationId"
									options={orderExpectationOptions}
									readOnly
									disabled={isExpectationBlocked || isFormBlocked}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									disabled
									label={t("provisions:fields.status")}
									name="orderStatusId"
									options={orderStatusOptions}
									readOnly
								/>
							</Grid>
							{/* <Grid item xs={12} md={3}>
								<p>1</p>
								<SelectField
									label={`${t("provisions:fields.probability")} *`}
									name="orderProbabilityId"
									options={orderProbabilityOptions}
									readOnly
									disabled={isFormBlocked}
								/>
							</Grid> */}
						</Grid>

						<Grid container>
							<Grid item xs={12}>
								<Box marginX={0} marginY={3}>
									<Divider />
								</Box>
							</Grid>
						</Grid>

						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Box marginX={0} mb={1}>
									<Typography variant="h3">
										{t("provisions:request.openingReleaseTitle")}
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12}>
								<SelectField
									label={`${t("provisions:fields.openingDescription")} *`}
									name="orderRatingDescriptionId"
									disabled={isOrderRatingOnEdit || isFormBlocked}
									readOnly
									options={orderRatingDescriptionOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={t("provisions:fields.probableValue")}
									name="probableValue"
									readOnly
									disabled={isFormBlocked}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={"Valor pagamento provável"}
									name="probablePaymentValue"
									disabled={
										!isEditable ||
										values.probableValue === "R$ 0,00" ||
										!(
											!isSpecialSetFormValues ||
											!(valueOrderEqualValue as any)[values.orderRatingDescriptionId]
										)
									}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={t("provisions:fields.possibleValue")}
									name="possibleValue"
									readOnly
									disabled={isFormBlocked}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={"Valor pagamento possível"}
									name="possiblePaymentValue"
									disabled
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={t("provisions:fields.remoteValue")}
									name="remoteValue"
									readOnly
									disabled={isFormBlocked}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={"Valor pagamento remoto"}
									name="remotePaymentValue"
									disabled
								/>
							</Grid>
							{isEditable &&
								!isFormBlocked &&
								(!isSpecialSetFormValues ||
									!(valueOrderEqualValue as any)[values.orderRatingDescriptionId]) &&
								values.probableValue !== "R$ 0,00" && (
									<Grid item xs={12} md={3}>
										<IconButton
											type="submit"
											aria-label={"Add"}
											color="primary"
										>
											<SaveOutlinedIcon />
										</IconButton>
										<Btn
											variant="outlined"
											onClick={() => {
												dispatch(clearOrderToEdit());
												disableEditinOrderRating();
												const emptyForm = {
													...getOrderForm(),
													...getOrderRatingForm(),
													...initialValuesPayment,
												};
												setFormValues(emptyForm);
												clearOrderDescription();
											}}
											style={buttonStyle}
										>
											{t("clear")}
										</Btn>
									</Grid>
								)}
						</Grid>
						<OrderRatingTable
							isEditable={isEditable && !isFormBlocked}
							setFormValues={setFormValues}
							enableEditingOrderRating={enableEditingOrderRating}
							paymentOrders={paymentOrders}
							isSpecialSetFormValues={isSpecialSetFormValues}
							dictionary={dictionary}
							form={form}
							isOrderRatingDescription1Only={false}
						/>
					</AccordionPanel>
				</form>
			)}
		</Formik>
	);
};

export default ProvisionForm;

