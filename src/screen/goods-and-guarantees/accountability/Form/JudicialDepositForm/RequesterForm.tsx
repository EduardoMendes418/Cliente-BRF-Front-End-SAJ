import { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { useMsal } from "@azure/msal-react";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

import {
	CurrencyField,
	DateField,
	FormikContext,
	SelectField,
	TextField,
	CheckboxField,
	NumericField,
} from "src/components/form";
import FieldColumn from "src/components/FieldColumn";
import Panel from "src/components/Panel";

import { useGuaranteeModality, useLicenseType } from "src/hooks/fetchLists";
import { t } from "src/locale/i18n";
import { accuratelyConvertDecimal, toNumber, valuesToNumber } from "src/core/utils/func";
import { TGuaranteeAccountability } from "src/core/models/guarantee-accountability";
import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";

import { TForm } from "../hooks/useAccountability";
import {
	depositAccountabilityStatusOptionsAsObject,
	situationStatusOptionsAsObject,
} from "../../constants";
import { BEARISH_REASONS, bearishReasonsGoodsAndGuarantees } from "../../../constants";
import { fetchAccountType } from "src/core/store/modules/account-type/thunks";
import { getListAccountTypeAsOptions } from "src/core/store/modules/account-type/selectors";
import { TOptions } from "src/components/form/AutocompleteField";
import { fetchReleaseType } from "src/core/store/modules/release-type/thunks";
import { getListReleaseTypeAsOptions } from "src/core/store/modules/release-type/selectors";
import { getPermissionsCurrentUser } from "src/core/store/modules/currentUser/selectors";
import moment from "moment";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { OCCURRENCE_TYPE } from "src/screen/judicial-blocks-and-transfers/constants";
import { setPaymentOrders } from 'src/core/store/modules/provision-order';
import {
	getOrders,
} from "src/core/store/modules/provision-order/selectors";
import { toCurrency } from 'src/core/utils/func';
import { getItemGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors";
import goodsGuaranteesRequestApi from "src/core/api/goods-guarantee";


type Props = {
	hasItem: boolean;
	readOnly: boolean;
	isReverseAccountability: boolean;
	itemRequest: TGoodsGuaranteesRequest;
	itemAccountability: TGuaranteeAccountability;
	isRequester: boolean;
	onBearishReasonsChanges: (event: any) => void;
};

const RequesterForm = ({
	hasItem,
	readOnly,
	itemRequest,
	isRequester,
	itemAccountability,
	onBearishReasonsChanges,
	isReverseAccountability,
}: Props) => {
	const { values, setFieldValue, initialValues } = useFormikContext<FormikContext>();
	const { licenseTypeAsOptions } = useLicenseType();
	const location = useLocation();
	const { id } = useParams<{ id: string }>();
	const [newGuaranteeValues, setNewGuaranteeValues] = useState<any>();

	const { name } = useSelector(getDataCurrentUser);

	const { accounts } = useMsal();

	const { guaranteeModalityAsOptions } = useGuaranteeModality();

	const permissions = useSelector(getPermissionsCurrentUser);
	const item = useSelector(getItemGoodsGuaranteesRequest);
	const permition = permissions.find(({ name }) => name === "bens-e-garantias/prestacao-de-contas-avaliacao");
	const isSolicitacao = location.pathname.includes("prestacao-de-contas-solicitacao");
	const isNew = id === "novo";
	const orders = useSelector(getOrders);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchAccountType({ notPaginate: true }));
		dispatch(fetchReleaseType({ notPaginate: true }));
	}, [dispatch]);

	const getNewGuaranteeValues = async () => {
		const response = await goodsGuaranteesRequestApi.listNewGuarantee({id: Number(values.replacementGoodGuaranteeId)});
		setFieldValue('goodsGuaranteesRequest.guaranteeModalityId', response?.data?.items[0]?.guaranteeModeId)
		setFieldValue('goodsGuaranteesRequest.valueGuarantee', response?.data?.items[0]?.valueGuarantee)
	}

	 useEffect(() => {
		if(isNew === false && values.bearishReasons === BEARISH_REASONS.INTERNAL_DELIBERATION_REPLACEMENT){
			getNewGuaranteeValues()
		}
	}, [values.bearishReasons]) 

	const accountTypesOptions = useSelector(getListAccountTypeAsOptions) as TOptions[];
	const releaseTypesOptions = useSelector(getListReleaseTypeAsOptions) as TOptions[];

	const doNewGuaranteeRequest = async (newGuaranteeId: any) => {

		const response = await goodsGuaranteesRequestApi.listNewGuarantee({id: Number(newGuaranteeId)});

		setNewGuaranteeValues({
			guaranteeModeId:  response?.data?.items[0]?.guaranteeModeId,
			valueGuarantee: response?.data?.items[0]?.valueGuarantee
		})
		setFieldValue('replacementGoodGuaranteeId', newGuaranteeId)
	}

	const calculateTotalAmountWrittenOff = (event: any, fieldName: string) => {
		const { amountWrittenOff, fine, historicalInterest, charge, succumbence } =
			valuesToNumber(
				[
					"amountWrittenOff",
					"fine",
					"historicalInterest",
					"charge",
					"succumbence",
				],
				{ ...values, [fieldName]: event.target.value }
			) as TForm;

		const totalAmountWrittenOff = amountWrittenOff + fine + historicalInterest + charge + succumbence;

		setFieldValue("totalAmountWrittenOff", accuratelyConvertDecimal(totalAmountWrittenOff, 2));
		setFieldValue(fieldName, event.target.value);
	};

	const calculateUpdateAmountWrittenOff = (event: any) => {
		
		const { updatedValue } = itemRequest;
		const amountWrittenOff = toNumber(event.target.value);

		const updateAmountWrittenOff = (updatedValue ?? 0) - amountWrittenOff;
		setFieldValue("updateAmountWrittenOff", updateAmountWrittenOff);
	};

	const handleOnBlur = (event: any, orderRatingDescription = 1) => {
		const numberValue = toNumber(event?.target?.value ?? 0)
		const filtredOrders = orders.filter(({isActive, orderRatings, orderExpectationId}) => {
			if (!isActive) return false
			if (orderExpectationId !== 1) return false

			const orderRatingProbabability = orderRatings.filter(({orderRatingProbababilityId, value}) => orderRatingProbababilityId === 1 && value !== 0 && value !== null).pop()
			if (orderRatingProbabability?.value === undefined) return false
			return true
		})
		const justOrderRating = filtredOrders.map(({orderRatings})=> orderRatings).flat(1)
		const fitredOrderRating = justOrderRating.filter(({orderRatingDescriptionId, value, orderRatingProbababilityId}) => value && orderRatingDescriptionId === orderRatingDescription && orderRatingProbababilityId === 1)
		const totalValueOrderRating = fitredOrderRating.reduce((sum, { value }) => sum + Number(value), 0)
		if (fitredOrderRating.length === 1) {
			dispatch(setPaymentOrders({
				id: 0,
				paymentId: 0,
				orderRatingId: Number(fitredOrderRating[0].id),
				value: numberValue
			}))
			return
		}
		fitredOrderRating.map(({value, id}) => dispatch(setPaymentOrders({
			id: 0,
			paymentId: 0,
			orderRatingId: Number(id),
			value: numberValue >= totalValueOrderRating ? value : 0
		})))
	}

	const { reverseAccounting } = values;

	const sortedBearishReasonsOptionsList = bearishReasonsGoodsAndGuarantees?.sort((a, b) => {
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
    });

	return (
		<Panel title={t("goodsAndGuarantees:accountability.title")} withPadding>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t("goodsAndGuarantees:accountability.accountabilityDate")}
						value={(itemAccountability.accountabilityDate || new Date()) as Date}
						type="date"
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t("goodsAndGuarantees:accountability.applicantName")}
						value={itemAccountability.applicantName || accounts[0]?.name}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t("goodsAndGuarantees:accountability.accountabilityStatus")}
						value={depositAccountabilityStatusOptionsAsObject[values.statusFlowId]}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t("goodsAndGuarantees:accountability.situation")}
						value={situationStatusOptionsAsObject[values.status]}
					/>
				</Grid>
				{permition && isSolicitacao && isNew && (
					<Grid item md={3} xs={12}>
						<CheckboxField
							name="reverseAccounting"
							label={"Prestação de conta reversa"}
							onChange={(e) => {
								const isChecked = e.target?.checked;
								if (isChecked) {
									setFieldValue("bearishReasons", 2);
									setFieldValue("valuationDate", moment().format("YYYY-MM-DD"));
									setFieldValue("evaluator", name);
								} else {
									setFieldValue("evaluator", "");
									setFieldValue("bearishReasons", "");
									setFieldValue("valuationDate", null);
								}
								setFieldValue("reverseAccounting", isChecked);
								setFieldValue("reverseAccountingChecked", isChecked);
							}}
						/>
					</Grid>
				)}
				<Grid item xs={12} md={3}>
					<SelectField
						name="bearishReasons"
						label={t("goodsAndGuarantees:accountability.bearishReasons")}
						options={ itemRequest.judicialBlocksAndTransfer?.occurrenceType === OCCURRENCE_TYPE.JUDICIAL_BLOCK ? [{ value: 7, label: "Desbloqueado" }]
						: sortedBearishReasonsOptionsList
						}
						onChange={onBearishReasonsChanges}
						readOnly={readOnly || (isReverseAccountability && hasItem) || reverseAccounting}
						required={!reverseAccounting && !readOnly}
					/>
				</Grid>
				{values.bearishReasons === BEARISH_REASONS.RELEASED_TO_COMPANY && (
					<Grid item xs={12} md={3}>
						<SelectField
							name="releaseType"
							label={t("goodsAndGuarantees:accountability.releaseType")}
							options={releaseTypesOptions}
							readOnly={readOnly || (isReverseAccountability && hasItem)}
							required={!reverseAccounting && !readOnly}
						/>
					</Grid>
				)}
				{values.bearishReasons === BEARISH_REASONS.INTERNAL_DELIBERATION_REPLACEMENT && item.guaranteeModalityId === 1&& (
					<Grid item xs={12} md={3}>
						<SelectField
							name="releaseType"
							label={t("goodsAndGuarantees:accountability.releaseType")}
							options={releaseTypesOptions}
							readOnly={readOnly || (isReverseAccountability && hasItem)}
							required={!reverseAccounting && !readOnly}
						/>
					</Grid>
				)}
				{(hasItem || (values.bearishReasons && !isReverseAccountability)) && (
					<>
						<Grid item xs={12} md={3}>
							<CurrencyField
								label={t("goodsAndGuarantees:accountability.amountWrittenOff")}
								name="amountWrittenOff"
								// max={
								// 	itemRequest.accountingBalance ??
								// 	Number(itemRequest.valueGuarantee)
								// }
								readOnly={readOnly}
								onChange={(event) => {
									calculateTotalAmountWrittenOff(event, "amountWrittenOff");
									calculateUpdateAmountWrittenOff(event);

									if (values.bearishReasons === 2 && initialValues.amountWrittenOff === 0){
										const {
											creditedAmount,
											amountWrittenOff,
											incomeTax,
											electronicTransferRate,
											covenantRate,
										} = valuesToNumber(
											[
												"creditedAmount",
												"amountWrittenOff",
												"incomeTax",
												"electronicTransferRate",
												"covenantRate",
												"updateValueCredited",
											],
											{ ...values, amountWrittenOff: event.target.value }
										) as TForm;
								
										const totalUpdateValueCredited =
											creditedAmount -
											amountWrittenOff +
											incomeTax +
											electronicTransferRate +
											covenantRate;

										const updateValueCreditedCurrency = toCurrency(Math.abs(totalUpdateValueCredited))
										setFieldValue("updateValueCredited", updateValueCreditedCurrency);
									}

								}}
								min={!reverseAccounting && !readOnly ? 0.01 : 0}
								onBlur={(event) => handleOnBlur(event, 1)}
								required={!reverseAccounting && !readOnly}
							/>
						</Grid>
						{(values.bearishReasons === 3 || values.bearishReasons === 5) && (
							<>
								<Grid item xs={12} md={3}>
									<CurrencyField
										label={t("goodsAndGuarantees:accountability.fine")}
										name="fine"
										readOnly={readOnly}
										onChange={(event) => calculateTotalAmountWrittenOff(event, "fine")}
										onBlur={(event) => handleOnBlur(event, 2)}
										required={!readOnly}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<CurrencyField
										label={t("goodsAndGuarantees:accountability.historicInterest")}
										name="historicalInterest"
										readOnly={readOnly}
										onBlur={(event) => handleOnBlur(event, 3)}
										onChange={(event) => calculateTotalAmountWrittenOff(event, "historicalInterest")}
										required={!readOnly}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<CurrencyField
										label={t("goodsAndGuarantees:accountability.charges")}
										name="charge"
										readOnly={readOnly}
										onBlur={(event) => handleOnBlur(event, 4)}
										onChange={(event) => calculateTotalAmountWrittenOff(event, "charge")}
										required={!readOnly}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<CurrencyField
										label={t("goodsAndGuarantees:accountability.succumb")}
										name="succumbence"
										readOnly={readOnly}
										onBlur={(event) => handleOnBlur(event, 5)}
										onChange={(event) => calculateTotalAmountWrittenOff(event, "succumbence")}
										required={!readOnly}
									/>
								</Grid>
							</>
						)}
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t("goodsAndGuarantees:accountability.totalAmountWrittenOff")}
								value={values.totalAmountWrittenOff}
								type="currency"
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<DateField
								name="licenseDate"
								label={t("goodsAndGuarantees:accountability.licenseDate")}
								placeholder={t("form.typeHere")}
								readOnly={readOnly}
								required={!readOnly && !reverseAccounting}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<TextField
								name="licenseNumber"
								label={t("goodsAndGuarantees:accountability.licenseNumber")}
								readOnly={readOnly}
								required={!readOnly && !reverseAccounting}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<SelectField
								name="licenseType"
								label={t("goodsAndGuarantees:accountability.licenseType")}
								options={licenseTypeAsOptions}
								readOnly={readOnly}
								required={!readOnly && !reverseAccounting}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<SelectField
								name="accountType"
								label={t("goodsAndGuarantees:accountability.accountType")}
								options={accountTypesOptions}
								readOnly={readOnly}
								required={!readOnly && !reverseAccounting}
							/>
						</Grid>
						 {values.bearishReasons === BEARISH_REASONS.INTERNAL_DELIBERATION_REPLACEMENT /* && item.guaranteeModalityId === 1 */ && (

								<> 
								<Grid item xs={12} md={3}>
									<NumericField
										onChange={(e)=> doNewGuaranteeRequest(e.target.value)}
										name="replacementGoodGuaranteeId"
										required
										readOnly={readOnly}
										label={"ID da nova garantia"}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<FieldColumn
										label={t("goodsAndGuarantees:form.guaranteeModality")}
										value={readOnly === true ? values.goodsGuaranteesRequest?.guaranteeModalityId : newGuaranteeValues?.guaranteeModeId}
										type="list"
										options={guaranteeModalityAsOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<FieldColumn
										label={"Valor da garantia"}
										value={readOnly === true ? values.goodsGuaranteesRequest?.valueGuarantee : newGuaranteeValues?.valueGuarantee}
										type="currency"
									/>
								</Grid>
								</>
						)}
					 </>
				)}
			</Grid>
			<Grid
				container
				spacing={3}
				justifyContent="center"
				className="margin-top-16"
			>
				<Grid item xs={12} md={3}>
					<TextField
						name="email"
						label={t("goodsAndGuarantees:accountability.mail")}
						placeholder={t("form.typeHere")}
						readOnly={readOnly}
					/>
				</Grid>
				<Grid item xs={12} md={9}>
					<TextField
						name="description"
						label={t("goodsAndGuarantees:accountability.description")}
						placeholder={t("form.typeHere")}
						readOnly={readOnly}
						rows={5}
						maxLength={1000}
						multiline
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default RequesterForm;
