import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";
import moment from "moment";
import FieldColumn from "src/components/FieldColumn";

import {
	CurrencyField,
	DateField,
	FormikContext,
	NumericField,
	TOptionsSelect,
} from "src/components/form";
import { valuesToNumber } from "src/core/utils/func";
import { t } from "src/locale/i18n";

import { TForm } from "../../hooks/useAccountability";
import { toCurrency } from 'src/core/utils/func';

type Props = {
	isVisible: boolean;
	readOnly: boolean;
	banksAsOptions: TOptionsSelect[];
	isRequired: boolean
};

const ReleasedToCompanyForm = ({
	isVisible,
	readOnly,
	banksAsOptions,
	isRequired
}: Props) => {
	const { values, setFieldValue } = useFormikContext<FormikContext>();

	const calculateUpdateValueCredited = (event: any, fieldName: string) => {
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
			{ ...values, [fieldName]: event.target.value }
		) as TForm;

		const totalUpdateValueCredited =
			creditedAmount -
			amountWrittenOff +
			incomeTax +
			electronicTransferRate +
			covenantRate;
		const updateValueCreditedCurrency = toCurrency(Math.abs(totalUpdateValueCredited))

		setFieldValue("updateValueCredited", updateValueCreditedCurrency);
		setFieldValue(fieldName, event.target.value);
	};

	const calculatePendingTime = (value: any, fieldName: string) => {
		const { writeOffDate, submissionDate } = {
			...values,
			[fieldName]: value,
		} as TForm;
		const start = moment(writeOffDate);
		const end = moment(submissionDate);

		let pendingTime = end.diff(start, "days");
		if (pendingTime < 0) pendingTime = pendingTime * -1;

		setFieldValue("pendingTime", pendingTime);
		setFieldValue(fieldName, value);
	};

	if (!isVisible) return null;

	return (
		<>
			<Grid item xs={12} md={3}>
				<CurrencyField
					label={t("goodsAndGuarantees:accountability.creditedAmount")}
					name="creditedAmount"
					onChange={(event) =>
						calculateUpdateValueCredited(event, "creditedAmount")
					}
					readOnly={readOnly}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<CurrencyField
					label={t("goodsAndGuarantees:accountability.incomeTax")}
					name="incomeTax"
					onChange={(event) => calculateUpdateValueCredited(event, "incomeTax")}
					readOnly={readOnly}
					required={!(values?.bearishReasons === 2) && isRequired}

				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<CurrencyField
					label={t("goodsAndGuarantees:accountability.electronicTransferRate")}
					name="electronicTransferRate"
					onChange={(event) =>
						calculateUpdateValueCredited(event, "electronicTransferRate")
					}
					readOnly={readOnly}
					required={!(values?.bearishReasons === 2) && isRequired}

				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<CurrencyField
					label={t("goodsAndGuarantees:accountability.covenantRate")}
					name="covenantRate"
					onChange={(event) =>
						calculateUpdateValueCredited(event, "covenantRate")
					}
					readOnly={readOnly}
					required={!(values?.bearishReasons === 2) && isRequired}

				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<CurrencyField
					label={t("goodsAndGuarantees:accountability.updateValueCredited")}
					name="updateValueCredited"
					readOnly={readOnly}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<NumericField
					name="numberOfCasualties"
					label={t("goodsAndGuarantees:accountability.numberOfCasualties")}
					placeholder={t("form.typeHere")}
					readOnly={readOnly}
					required={!(values?.bearishReasons === 2) && isRequired}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<DateField
					name="writeOffDate"
					label={t("goodsAndGuarantees:writeOffDate")}
					placeholder={t("form.typeHere")}
					onChange={(value: any) => calculatePendingTime(value, "writeOffDate")}
					readOnly={readOnly}
					required={!(values?.bearishReasons === 2) && isRequired}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<DateField
					name="submissionDate"
					label={t("goodsAndGuarantees:accountability.submissionDate")}
					placeholder={t("form.typeHere")}
					onChange={(value: any) =>
						calculatePendingTime(value, "submissionDate")
					}
					readOnly={readOnly}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<FieldColumn
					label={t("goodsAndGuarantees:accountability.pendingTime")}
					value={
						values.pendingTime || values.pendingTime === 0
							? values.pendingTime === 1
								? "1 dia"
								: `${values.pendingTime} dias`
							: ""
					}
				/>
			</Grid>
		</>
	);
};

export default ReleasedToCompanyForm;
