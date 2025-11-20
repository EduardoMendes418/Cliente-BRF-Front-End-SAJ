import { Grid } from "@material-ui/core";

import { NumericField, TextField, TOptionsSelect, DateField, FormikContext } from "src/components/form";
import { t } from "src/locale/i18n";
import { useFormikContext } from "formik";

type Props = {
	isVisible: boolean;
	readOnly: boolean;
	banksAsOptions: TOptionsSelect[];
	isReverseAccountability: boolean;
}

const CreditPostingOnSapForm = ({ isVisible, readOnly, banksAsOptions, isReverseAccountability }: Props) => {
	const { values } = useFormikContext<FormikContext>();
	if (!isVisible) return null;

	return (
		<>
			<Grid item xs={12} md={3}>
				<TextField
					name='company'
					label={"Empresa"}
					readOnly={readOnly}
					required={!readOnly}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<NumericField
					name="exercise"
					label={"Exercício"}
					placeholder={t('form.typeHere')}
					readOnly={readOnly}
					required={!readOnly}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<NumericField
					name="sapEntryNumber"
					label={t('goodsAndGuarantees:accountability.sapEntryNumber')}
					placeholder={t('form.typeHere')}
					readOnly={readOnly}
					required={!readOnly}
					maxLength={10}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<TextField
					name='bankToSendLicence'
					label={"Conta banco"}
					readOnly={readOnly}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<DateField
					name="documentDate"
					label={t('goodsAndGuarantees:accountability.documentDate')}
					placeholder={t('form.typeHere')}
					readOnly={readOnly}
					required={!(values?.bearishReasons === 2)}
				/>
			</Grid>
		</>
	)
}

export default CreditPostingOnSapForm;