import { Grid } from '@material-ui/core';

import { useTranslation } from 'src/locale/i18n';
import { DateField, RadioGroup } from 'src/components/form';

import { radioOption } from '../constants';

const FiltersPayment = () => {
	const { t } = useTranslation();

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={5} lg={4} xl={3}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<DateField
							name='paymentStartDate'
							label={t('dataImport:documents.form.expirationPeriodStart')}
						/>

					</Grid>
					<Grid item xs={12} sm={6}>
						<DateField
							name='paymentEndDate'
							label={t('dataImport:documents.form.end')}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} md={7} lg={8} xl={9} style={{ display: "flex" }}>
				<RadioGroup
					name='paymentReceipt'
					label={t('dataImport:documents.form.paymentWithReceipt')}
					options={radioOption}
				/>
			</Grid>
		</Grid>
	)
}

export default FiltersPayment;