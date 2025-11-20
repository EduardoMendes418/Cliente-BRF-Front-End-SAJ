import { Grid } from '@material-ui/core';

import { TAccountingData } from 'src/core/models';
import { t } from 'src/locale/i18n';

import FieldColumn from '../FieldColumn';
import Panel from '../Panel';
import { IconButton } from "@material-ui/core";

type TProps = {
	accountingData: any;
	isPension?: boolean;
	title: string;
	renderButton?: boolean;
	reclassification?: any;
	loadingReclassification?: boolean;
}

const formatReleaseDate = (date: string | undefined) => date ? `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}` : undefined

const formatSapReleaseNumber = (accountingData: TAccountingData) => (
	(accountingData !== null || undefined) ?? Object?.keys(accountingData)?.length
		? `${accountingData?.company ?? ''} ${accountingData?.exercice ?? ''} ${accountingData?.documentNumber ?? ''}`
		: undefined
)

const AccountingData = ({ accountingData, isPension, title, renderButton, reclassification }: TProps) => (
	
	<Panel title={title} withPadding>
		<Grid container spacing={3}>
			<Grid item md={3} xs={12}>
				<FieldColumn
					label={t('accounting.releaseDate')}
					value={isPension === true ? accountingData?.releaseDate : formatReleaseDate(accountingData?.releaseDate)}
					type='date'
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<FieldColumn
					label={t('accounting.sapReleaseNumber')}
					value={formatSapReleaseNumber(accountingData)}
					reclassification={reclassification}
					renderReclassification={renderButton}
				/>
			</Grid>
		</Grid>
	</Panel>
)

export default AccountingData;