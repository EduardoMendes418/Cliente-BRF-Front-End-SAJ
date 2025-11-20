import { Grid } from '@material-ui/core';

import { useTranslation } from 'src/locale/i18n';
import { DateField, SelectField } from 'src/components/form';
import { bearishReasonsOptions } from 'src/screen/goods-and-guarantees/constants';
import { accountabilityStatusOptions, situationStatusOptions } from 'src/screen/goods-and-guarantees/accountability/constants'
import { useBanks } from 'src/hooks/fetchLists';


const FiltersAccountability = () => {
	const { t } = useTranslation();
	const { banksAsOptions } = useBanks();

	return (
		<Grid container spacing={2}>
			<Grid item xs={6} sm={4} md={2}>
				<DateField
					name='accountabilityAccountabilityStartDate'
					label={t('dataImport:documents.form.accountsStart')}
				/>
			</Grid>
			<Grid item xs={6} sm={4} md={2}>
				<DateField
					name='accountabilityAccountabilityEndDate'
					label={t('dataImport:documents.form.end')}
				/>
			</Grid>

			<Grid item xs={12} sm={4} md={4}>
				<SelectField
					name='accountabilityBearishReasons'
					label={t('dataImport:documents.form.bearishReasons')}
					options={bearishReasonsOptions}
				/>
			</Grid>

			<Grid item xs={6} sm={4} md={2}>
				<DateField
					name='accountabilityApprovalStartDate'
					label={t('dataImport:documents.form.approvalPeriod')}
				/>
			</Grid>
			<Grid item xs={6} sm={4} md={2}>
				<DateField
					name='accountabilityApprovalEndDate'
					label={t('dataImport:documents.form.end')}
				/>
			</Grid>

			<Grid item xs={12} sm={4} md={4}>
				<SelectField
					name='accountabilityStatusFlowId'
					label={t('dataImport:documents.form.accountRenderingStatus')}
					options={accountabilityStatusOptions}
				/>
			</Grid>
			<Grid item xs={12} sm={6} md={4}>
				<SelectField
					name='status'
					label={t('dataImport:documents.form.situation')}
					options={situationStatusOptions}
				/>
			</Grid>
			<Grid item xs={12} sm={6} md={4}>
				<SelectField
					name='accountabilityBankId'
					label={t('dataImport:documents.form.bank')}
					options={banksAsOptions}
				/>
			</Grid>
		</Grid>
	)
}

export default FiltersAccountability;