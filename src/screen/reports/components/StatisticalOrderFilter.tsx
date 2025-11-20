import { Grid } from '@material-ui/core'
import Panel from 'src/components/Panel'
import { useTranslation } from 'src/locale/i18n'

import { TReportComponent } from 'src/core/models/reports'
import { TReportFilterField } from 'src/core/models/report-configuration'

import { useGenerateReport } from '../hooks/useGenerateReport'
import ActionsButton from './ActionButtons'
import {
	DateField,
	TextField
} from 'src/components/form'

type Props = {
	hasItem: boolean
	submitting: boolean
	customFields: TReportFilterField[]
}

const StatisticalOrderFilter = ({ hasItem, submitting, customFields }: Props) => {
	const { t } = useTranslation();

	const isNew = !hasItem

	const { generateReport, isGeneratingReport } = useGenerateReport({ reportType: TReportComponent.STATISTICAL_ORDER });

	return (
		<Panel title={t('reports:statisticalOrder.title')}
			withPadding
			slotBottomRight={<ActionsButton
				isGeneratingReport={isGeneratingReport}
				isSavingConfiguration={submitting}
				generateReport={() => generateReport(customFields)}
			/>}
			slotBottonRightPermission={isNew ? 'add' : 'edit'}
		>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<TextField
						name='objectName'
						label={t('reports:statisticalOrder.form.objectName')}
					/>
				</Grid>

				<Grid item xs={12} md={6}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								name='requestInclusionDate'
								label={t('reports:statisticalOrder.form.requestInclusionDate')}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name='dataPagamentoFinal'
								label={t('reports:noticeInspectionPayment.form.until')}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Panel >

	)
}

export default StatisticalOrderFilter