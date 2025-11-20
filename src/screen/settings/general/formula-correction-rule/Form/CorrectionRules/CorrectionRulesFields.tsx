import { Grid } from '@material-ui/core';
import { useFormikContext } from 'formik';

import { SelectField, TOptionsSelect, CurrencyField, DateField, PercentageField, FormikContext } from 'src/components/form';
import { useTranslation } from 'src/locale/i18n';
import { optionsValueType, VALUE_TYPE } from 'src/screen/settings/constants';

type TCorrectionRulesFields = {
	economicIndicesAsOptions: TOptionsSelect[];
	isModal?: boolean;
}

const CorrectionRulesFields = ({ economicIndicesAsOptions, isModal = false }: TCorrectionRulesFields) => {
	const { values } = useFormikContext<FormikContext>();
	const { t } = useTranslation();

	return (
		<>
			<Grid item md={3} xs={12}>
				<SelectField
					label={t('settings:formulaCorrectionRule.form.index')}
					name='economicIndicesId'
					options={economicIndicesAsOptions}
					required
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<DateField
					label={t('settings:formulaCorrectionRule.form.correctionStart')}
					name='correctionStart'
					required
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<DateField
					label={t('settings:formulaCorrectionRule.form.correctionEnd')}
					name='correctionEnd'
					minDate={values.correctionStart}
					required
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<DateField
					label={t('settings:formulaCorrectionRule.form.feesStart')}
					name='feesStart'
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<DateField
					label={t('settings:formulaCorrectionRule.form.feesEnd')}
					name='feesEnd'
					minDate={values.feesStart}
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<PercentageField
					label={t('settings:formulaCorrectionRule.form.feesValue')}
					name='feesValue'
				/>
			</Grid>
			<Grid item md={isModal ? 3 : 2} xs={12}>
				<SelectField
					label={t('settings:formulaCorrectionRule.form.fineType')}
					name='fineType'
					options={optionsValueType}
				/>
			</Grid>
			{values.fineType && (
				<Grid item md={isModal ? 3 : 2} xs={12}>
					{values.fineType === VALUE_TYPE.PERCENTAGE
						? (
							<PercentageField
								label={t('settings:formulaCorrectionRule.form.fineValue')}
								name='fineValue'
								required
							/>
						) : (
							<CurrencyField
								label={t('settings:formulaCorrectionRule.form.fineValue')}
								name='fineValue'
								required
							/>
						)
					}
				</Grid>
			)}
		</>
	)
}

export default CorrectionRulesFields;