import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import Panel from 'src/components/Panel';
import { CurrencyField, DateField, SelectField } from 'src/components/form';
import { useTranslation } from "src/locale/i18n";

import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks';
import { fetchPaymentMethod } from 'src/core/store/modules/payment-method/thunks';
import { getListAsOptionPaymentType } from 'src/core/store/modules/payment-type/selectors';
import { getListAsOptionPaymentMethod } from 'src/core/store/modules/payment-method/selectors';
import { Modulos } from 'src/core/models/modules';
import { useBanks } from 'src/hooks/fetchLists';
import { TReportComponent } from 'src/core/models/reports';
import { TReportFilterField } from 'src/core/models/report-configuration';

import { useGenerateReport } from '../hooks/useGenerateReport';
import ActionsButton from './ActionButtons';
import { statusApprovalIdPaymentAsOptions, statusFlowIdAsOptions } from 'src/core/utils/constants';

type Props = {
	hasItem: boolean
	submitting: boolean
	customFields: TReportFilterField[]
}

const PaymentFilter = ({ hasItem, submitting, customFields }: Props) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const isNew = !hasItem

	const paymentTypeOptions = useSelector(getListAsOptionPaymentType);
	const paymentFormOptions = useSelector(getListAsOptionPaymentMethod);

	const { banksAsOptions } = useBanks();
	const { generateReport, isGeneratingReport } = useGenerateReport({ reportType: TReportComponent.PAYMENTS });

	useEffect(() => {
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento }));
		dispatch(fetchPaymentMethod({ moduloId: Modulos.Pagamento }))
	}, [dispatch]);

	return (
		<Panel title={t('reports:payment.title')}
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
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:payment.form.dataSolicitacaoInitial')}
								name="dataSolicitacaoInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:common.form.until')}
								name="dataSolicitacaoFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:payment.form.dataVencimentoInitial')}
								name="dataVencimentoInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:common.form.until')}
								name="dataVencimentoFinal"
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:payment.form.receiptDateInitial')}
								name="receiptDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:common.form.until')}
								name="receiptDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:payment.form.sapEntryDateInitial')}
								name="sapEntryDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:common.form.until')}
								name="sapEntryDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:payment.form.periodoApuracaoInitial')}
								name="periodoApuracaoInitial"
								views={['year', 'month']}
								format='MM/yyyy'
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:common.form.until')}
								name="periodoApuracaoFinal"
								views={['year', 'month']}
								format='MM/yyyy'
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12} md={3}>
					<SelectField
						options={paymentTypeOptions}
						label={t('reports:payment.form.tipoPagamentoId')}
						name='tipoPagamentoId'
						multiple
					/>
				</Grid>

				<Grid item xs={12} md={3}>
					<SelectField
						options={paymentFormOptions}
						label={t('reports:payment.form.formaPagamentoId')}
						name='formaPagamentoId'
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={banksAsOptions}
						label={t('reports:payment.form.bankId')}
						name='bankId'
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<CurrencyField
								label={t('reports:payment.form.valorPagamentoJudicialInitial')}
								name="valorPagamentoJudicialInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<CurrencyField
								label={t('reports:common.form.until')}
								name="valorPagamentoJudicialFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t('reports:main.form.statusFlowId')}
						name='statusFlowId'
						options={statusFlowIdAsOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t('reports:main.form.statusApprovalId')}
						name='statusApprovalId'
						options={statusApprovalIdPaymentAsOptions}
						multiple
					/>
				</Grid>
			</Grid>
		</Panel>
	)
}

export default PaymentFilter;