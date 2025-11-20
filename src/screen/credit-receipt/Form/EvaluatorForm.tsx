import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";
import moment from "moment";

import {
	CurrencyField,
	DateField,
	NumericField,
	SelectField,
	TextField,
	CheckboxField,
} from "src/components/form";
import FieldColumn from "src/components/FieldColumn";
import Panel from "src/components/Panel";

import { TCreditReceipt } from "src/core/models/credit-receipt";
import { valuesToNumber, toCurrency } from "src/core/utils/func";
import { useTranslation } from "src/locale/i18n";

import {
	statusOptions,
	STATUS_CREDIT_RECEIPT,
	statusOptionsPendente,
	statusOptionsSaque,
	statusOptionsMorto,
	allStatusOptions
} from "../constants";

type TEvaluatorForm = {
	readonly: boolean;
	statusFlowId: STATUS_CREDIT_RECEIPT;
	isMultiple?: boolean;
	isReversal?: boolean
};

const evaluatorStatusOptions = statusOptions.filter(
	({ value }) => value !== STATUS_CREDIT_RECEIPT.REQUESTED
);

const EvaluatorForm = ({ readonly, statusFlowId, isMultiple = false, isReversal = false  }: TEvaluatorForm) => {
	const { t } = useTranslation();
	const { values, setFieldValue } = useFormikContext<TCreditReceipt>();

	const calculateUpdateValueCredited = (event: any, fieldName: string) => {
		const {
			evaluatorCreditedAmount,
			evaluatorIncomeTax,
			evaluatorElectronicTransferRate,
			evaluatorCovenantRate,
			creditValue,
		} = valuesToNumber(
			[
				"evaluatorCreditedAmount",
				"evaluatorIncomeTax",
				"evaluatorElectronicTransferRate",
				"evaluatorCovenantRate",
				"creditValue",
			],
			{ ...values, [fieldName]: event.target.value }
		) as TCreditReceipt;

		// Valor de atualização creditada = valor creditado - (soma de todos os depósitos selecionados) - valor recebimento crédito + IR + TED + Convênio
		const totalUpdateValueCredited =
			evaluatorCreditedAmount -
			creditValue +
			evaluatorIncomeTax +
			evaluatorElectronicTransferRate +
			evaluatorCovenantRate;

		setFieldValue(
			"evaluatorUpdateValueCredited",
			toCurrency(totalUpdateValueCredited)
		);
		setFieldValue(fieldName, event.target.value);
	};

	const calculatePendingTime = (value: any, fieldName: string) => {
		const { evaluatorWriteOffDate, evaluatorSendBankDate } = {
			...values,
			[fieldName]: value,
		} as TCreditReceipt;
		const start = moment(evaluatorWriteOffDate);
		const end = moment(evaluatorSendBankDate);

		let pendingTime = end.diff(start, "days");
		if (pendingTime < 0) pendingTime = pendingTime * -1;
		else if (isNaN(pendingTime)) pendingTime = 0;

		setFieldValue("evaluatorPendingTime", pendingTime);
		setFieldValue(fieldName, value);
	};
	let finalEvaluatorStatusOptions = [];

	switch (statusFlowId) {
		case STATUS_CREDIT_RECEIPT.REQUESTED:
			finalEvaluatorStatusOptions = statusOptionsPendente;
			break;
		case STATUS_CREDIT_RECEIPT.FOR_WITHDRAWAL:
			finalEvaluatorStatusOptions = statusOptionsSaque;
			break;
		case STATUS_CREDIT_RECEIPT.DEAD:
			finalEvaluatorStatusOptions = statusOptionsMorto;
			break;
		default:
			finalEvaluatorStatusOptions = evaluatorStatusOptions;
			break;
	}

	if (readonly) finalEvaluatorStatusOptions = allStatusOptions;

	return (
		<Panel title={t("creditReceipt:form.evaluatorFormTitle")} withPadding>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t("creditReceipt:form.evaluator")}
						value={values.evaluatorUser?.name ?? ""}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						value={values.evaluatorDate}
						label={t("creditReceipt:form.valuationDate")}
						type="date"
					/>
				</Grid>
				{isReversal && <Grid item xs={12} md={3}>
					<FieldColumn
						value={"Estornado"}
						label={t("status")}
					/>
				</Grid>}
				{!isReversal && <Grid item xs={12} md={3}>
					<SelectField
						label={t("status")}
						name="statusFlowId"
						options={finalEvaluatorStatusOptions}
						readOnly={readonly}
						required
					/>
				</Grid>}
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<NumericField
								name="evaluatorCompany"
								label={t("creditReceipt:form.company")}
								maxLength={4}
								readOnly={readonly}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<NumericField
								name="evaluatorExercise"
								label={t("creditReceipt:form.exercise")}
								maxLength={4}
								readOnly={readonly}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<NumericField
						name="evaluatorSapDocument"
						label={t("creditReceipt:form.documentSAP")}
						maxLength={10}
						readOnly={readonly}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DateField
						name="evaluatorDocumentDate"
						label={t("creditReceipt:form.documentDate")}
						readOnly={readonly}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CurrencyField
						name="evaluatorCreditedAmount"
						label={t("creditReceipt:form.creditedValue")}
						onChange={(event) =>
							calculateUpdateValueCredited(event, "evaluatorCreditedAmount")
						}
						readOnly={readonly}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CurrencyField
						name="evaluatorIncomeTax"
						label={t("creditReceipt:form.irValue")}
						onChange={(event) =>
							calculateUpdateValueCredited(event, "evaluatorIncomeTax")
						}
						readOnly={readonly}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CurrencyField
						name="evaluatorElectronicTransferRate"
						label={t("creditReceipt:form.tedRate")}
						onChange={(event) =>
							calculateUpdateValueCredited(
								event,
								"evaluatorElectronicTransferRate"
							)
						}
						readOnly={readonly}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CurrencyField
						name="evaluatorCovenantRate"
						label={t("creditReceipt:form.covenantRate")}
						onChange={(event) =>
							calculateUpdateValueCredited(event, "evaluatorCovenantRate")
						}
						readOnly={readonly}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<NumericField
						name="evaluatorWriteOffQuantity"
						label={t("creditReceipt:form.numberOfCasualties")}
						readOnly={readonly}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<NumericField
						name="evaluatorAccount"
						label={t("creditReceipt:form.account")}
						readOnly={readonly}
						required={isReversal === true ? false : values.statusFlowId === 10}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CurrencyField
						label={t("creditReceipt:form.updateValueCredited")}
						name="evaluatorUpdateValueCredited"
						readOnly={readonly}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DateField
						name="evaluatorWriteOffDate"
						label={t("creditReceipt:form.writeOffDate")}
						onChange={(value: any) =>
							calculatePendingTime(value, "evaluatorWriteOffDate")
						}
						readOnly={readonly}
						required={isReversal === true ? false :( statusFlowId === STATUS_CREDIT_RECEIPT.DEAD || isMultiple)}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DateField
						name="evaluatorSendBankDate"
						label={t("creditReceipt:form.sendBankDate")}
						onChange={(value: any) =>
							calculatePendingTime(value, "evaluatorSendBankDate")
						}
						readOnly={readonly}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t("creditReceipt:form.pendingTime")}
						value={
							values.evaluatorPendingTime || values.evaluatorPendingTime === 0
								? values.evaluatorPendingTime === 1
									? "1 dia"
									: `${values.evaluatorPendingTime} dias`
								: ""
						}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CheckboxField
						name="restatementInterestAmount"
						label={t("creditReceipt:form.interestAmount")}
						readOnly={readonly}
					/>
				</Grid>
				<Grid item md={12} xs={12}>
					<TextField
						name="evaluatorObservation"
						label={t("form.comments")}
						placeholder={t("form.typeHere")}
						readOnly={readonly && !isReversal}
						maxLength={2500}
						rows={3}
						multiline
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default EvaluatorForm;
