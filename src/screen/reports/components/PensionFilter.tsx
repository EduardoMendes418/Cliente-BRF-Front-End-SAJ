import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import Panel from 'src/components/Panel';
import { DateField,	SelectField } from 'src/components/form';

import { useTranslation } from "src/locale/i18n";
import { useBanks } from 'src/hooks/fetchLists';
import { Modulos } from 'src/core/models/modules';
import {
	fetchPensionCategories
} from 'src/core/store/modules/pensions/request-pensions/thunks';
import { getPensionCategoriesAsOptions } from 'src/core/store/modules/pensions/request-pensions/selectors';
import { getListAsOptionPaymentType } from 'src/core/store/modules/payment-type/selectors';
import { getListAsOptionPaymentMethod } from 'src/core/store/modules/payment-method/selectors';
import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks';
import { fetchPaymentMethod } from 'src/core/store/modules/payment-method/thunks';
import { pensionStatusAsOptions } from 'src/screen/pensions/request/constants';
import { TReportComponent } from 'src/core/models/reports';
import { TReportFilterField } from 'src/core/models/report-configuration';
import ContactField from 'src/components/ContactField';

import { useGenerateReport } from '../hooks/useGenerateReport';
import ActionsButton from './ActionButtons';

type Props = {
	hasItem: boolean
	submitting: boolean
	customFields: TReportFilterField[]
}

const PensionFilter = ({ hasItem, submitting, customFields }: Props) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const isNew = !hasItem

	const paymentTypeOptions = useSelector(getListAsOptionPaymentType);
	const paymentFormOptions = useSelector(getListAsOptionPaymentMethod);
	const pensionCategoryOptions = useSelector(getPensionCategoriesAsOptions)

	const { banksAsOptions } = useBanks();
	const { generateReport, isGeneratingReport } = useGenerateReport({ reportType: TReportComponent.PENSIONS });

	useEffect(() => {
		dispatch(fetchPensionCategories());
		dispatch(fetchPaymentType({ modulo: Modulos.Pension }));
		dispatch(fetchPaymentMethod({ moduloId: Modulos.Pension }))
	}, [dispatch]);

	return (
		<Panel title={t('reports:pension.title')}
			withPadding
			slotBottomRight={<ActionsButton
				isGeneratingReport={isGeneratingReport}
				isSavingConfiguration={submitting}
				generateReport={() => generateReport(customFields)}
			/>
		}
		slotBottonRightPermission={isNew ? 'add' : 'edit'}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:pension.form.dataSolicitacaoInitial')}
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
								name='dataPagamentoInitial'
								label={t('reports:pension.form.dataPagamentoInitial')}
								views={['year', 'month']}
								format='MM/yyyy'
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name='dataPagamentoFinal'
								label={t('reports:common.form.until')}
								views={['year', 'month']}
								format='MM/yyyy'
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								name='dataBaseCorrecaoInitial'
								label={t('reports:pension.form.dataBaseCorrecaoInitial')}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name='dataBaseCorrecaoFinal'
								label={t('reports:common.form.until')}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name='tipoPagamentoId'
						label={t('reports:pension.form.tipoPagamentoId')}
						options={paymentTypeOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name='formaPagamentoId'
						label={t('reports:pension.form.formaPagamentoId')}
						options={paymentFormOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<ContactField
						name='favorecido'
						label={t('reports:pension.form.favorecido')}
						setInvalidValueWhenTyping
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name='bankId'
						label={t('reports:pension.form.bankId')}
						options={banksAsOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name='pensionCategoryId'
						label={t('reports:pension.form.pensionCategoryId')}
						options={pensionCategoryOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name='statusPensionId'
						label={t('reports:pension.form.statusPensionId')}
						options={pensionStatusAsOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:pension.form.receiptDateInitial')}
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
								name='sapEntryDateInitial'
								label={t('reports:pension.form.sapEntryDateInitial')}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name='sapEntryDateFinal'
								label={t('reports:common.form.until')}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Panel>
	)
}

export default PensionFilter;