import { Grid } from "@material-ui/core";

import {
	NumericField,
	TextField,
	TOptionsSelect,
	DateField,
	FormikContext,
} from "src/components/form";
import { t } from "src/locale/i18n";
import { useFormikContext } from "formik";

type Props = {
	isVisible: boolean;
	readOnly: boolean;
	banksAsOptions: TOptionsSelect[];
	isReverseAccountability: boolean;
	isRequired: boolean;
};

const CreditPostingOnSapForm = ({
	isVisible,
	readOnly,
	banksAsOptions,
	isReverseAccountability,
	isRequired,
}: Props) => {
	const { values } = useFormikContext<FormikContext>();
	if (!isVisible) return null;

	return (
		<>
			<Grid item xs={12} md={3}>
				<TextField name="companySap" label="Empresa SAP" readOnly={readOnly} />
			</Grid>
			<Grid item xs={12} md={3}>
				<TextField
					name="exerciceSap"
					label="Exercício SAP"
					readOnly={readOnly}
				/>
			</Grid>

			<Grid item xs={12} md={3}>
				<NumericField
					name="sapEntryNumber"
					label={
						t("goodsAndGuarantees:accountability.sapEntryNumber")
					}
					placeholder={t("form.typeHere")}
					readOnly={readOnly}
					required={!isReverseAccountability && isRequired}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<TextField
					name="bankToSendLicence"
					label={"Conta banco"}
					readOnly={readOnly}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<DateField
					name="documentDate"
					label={t("goodsAndGuarantees:accountability.documentDate")}
					placeholder={t("form.typeHere")}
					readOnly={readOnly}
					required={!(values?.bearishReasons === 2) && isRequired}
				/>
			</Grid>
		</>
	);
};

export default CreditPostingOnSapForm;
