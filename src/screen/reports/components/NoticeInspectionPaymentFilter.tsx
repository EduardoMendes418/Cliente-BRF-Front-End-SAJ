import { useEffect } from 'react'
import { Grid } from '@material-ui/core'
import Panel from 'src/components/Panel'
import { useTranslation } from 'src/locale/i18n'
import { TReportComponent } from 'src/core/models/reports'
import { TReportFilterField } from 'src/core/models/report-configuration'
import { useGenerateReport } from '../hooks/useGenerateReport'
import ActionsButton from './ActionButtons'
import {
	SelectField,
	DateField,
	CurrencyField
} from 'src/components/form'
import ContactField from 'src/components/ContactField'
import { CONTACT_SEARCH, CONTACT_TYPE } from "src/core/utils/constants"
import { useDispatch, useSelector } from 'react-redux'
import { getListAsOptionPaymentType } from 'src/core/store/modules/payment-type/selectors'
import { getListAsOptionsOrderStatus } from 'src/core/store/modules/order-status/selectors'
import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks'
import { fetchPaymentMethod } from 'src/core/store/modules/payment-method/thunks'
import { Modulos } from 'src/core/models/modules'
import { fetchOrderStatuses } from 'src/core/store/modules/order-status/thunks'

type Props = {
	hasItem: boolean
	submitting: boolean
	customFields: TReportFilterField[]
}

const NoticeInspectionPaymentFilter = ({ hasItem, submitting, customFields }: Props) => {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const isNew = !hasItem

	const paymentTypeOptions = useSelector(getListAsOptionPaymentType)
	const orderStatusAsOptions = useSelector(getListAsOptionsOrderStatus)

	useEffect(() => {
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento }))
		dispatch(fetchPaymentMethod({ moduloId: Modulos.Pagamento }))
		dispatch(fetchOrderStatuses({ notPaginate: true }));
	}, [dispatch])

	const { generateReport, isGeneratingReport } = useGenerateReport({ reportType: TReportComponent.NOTICE_INSPECTION_PAYMENT })

	return (
		<Panel
			title={t('reports:noticeInspectionPayment.title')}
			withPadding
			slotBottomRight={
				<ActionsButton
					isGeneratingReport={isGeneratingReport}
					isSavingConfiguration={submitting}
					generateReport={() => generateReport(customFields)}
				/>
			}
			slotBottonRightPermission={isNew ? 'add' : 'edit'}
		>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<SelectField
						name='tipoPagamentoId'
						label={t('reports:noticeInspectionPayment.form.tipoPagamento')}
						multiple
						options={paymentTypeOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name='receiptStatus'
						label={t('reports:noticeInspectionPayment.form.status')}
						multiple
						options={orderStatusAsOptions}
					/>
				</Grid>

				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								name='receiptDateInitial'
								label={t('reports:noticeInspectionPayment.form.dataSolicitacaoInicial')}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name='receiptDateFinal'
								label={t('reports:noticeInspectionPayment.form.until')}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								name='dataPagamentoInitial'
								label={t('reports:noticeInspectionPayment.form.dataPagamentoInicial')}
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

				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<CurrencyField
								name='valorPagamentoJudicialInitial'
								label={t('reports:noticeInspectionPayment.form.valorPagamentoJudicialInitial')}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<CurrencyField
								name='valorPagamentoJudicialFinal'
								label={t('reports:noticeInspectionPayment.form.until')}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12} md={3}>
					<ContactField
						name='internalLawyer'
						label={t('reports:noticeInspectionPayment.form.internalLawyer')}
						contactType={CONTACT_TYPE.PERSON}
						setInvalidValueWhenTyping
						contactSearch={CONTACT_SEARCH.InternalLawyer}
					/>
				</Grid>

				<Grid item xs={12} md={3}>
					<ContactField
						name='favorecidoId'
						label={t('reports:noticeInspectionPayment.form.favorecido')}
						contactType={CONTACT_TYPE.PERSON}
						setInvalidValueWhenTyping
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								name='closingDateInitial'
								label={t('reports:noticeInspectionPayment.form.closingDateInitial')}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name='closingDateFinal'
								label={t('reports:noticeInspectionPayment.form.until')}
							/>
						</Grid>
					</Grid>
				</Grid>

			</Grid>
		</Panel>
	)
}

export default NoticeInspectionPaymentFilter
