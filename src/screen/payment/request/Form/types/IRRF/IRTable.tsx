import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react'
import {
	Typography,
	createStyles,
	makeStyles,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import moment from 'moment';

import Accordion from 'src/components/Accordion';
import Table, { ColumnData } from 'src/components/Table';
import { useTranslation } from 'src/locale/i18n';
import {
	calcJudicialTimes,
	normalizeIRTable,
	normalizeAccumulatedIRTable,
	calcIRResult,
	getCurrentIR,
} from '../../common/func';
import { toCurrency, toNumber, toPercentage } from 'src/core/utils/func';
import { searchIncomeTaxRates } from 'src/core/store/modules/income-tax-rates/thunks';
import {
	getItemIncomeTaxRates,
	getLoadingIncomeTaxRates,
} from 'src/core/store/modules/income-tax-rates/selectors';
import { TPaymentDataIRRF } from 'src/core/models/payment';

const useStyles = makeStyles(() =>
	createStyles({
		fullwidth: {
			width: '100%',
		},
		box: {
			padding: '30px 80px',
			background: '#f2f2f2',
			width: 'fit-content',
			margin: '25px auto',
		},
		box_label: {
			fontWeight: 600,
			textAlign: 'right',
			paddingRight: '24px',
		},
	})
);

type Props = {
	admissionDate: string;
	dismissalDate: string;
	distributionDate: string;
}

const IRTable = ({
	admissionDate,
	dismissalDate,
	distributionDate,
}: Props) => {
	const { t } = useTranslation();
	const classes = useStyles();
	const dispatch = useDispatch();
	const { values, setFieldValue } = useFormikContext<TPaymentDataIRRF>();
	const irBase = toNumber(values.baseCalculo)

	const [monthsToPay, setMonthsToPay] = useState<number>(0)
	const [judicialTimesRows, setJudicialTimesRows] = useState<unknown[]>([])

	const item = useSelector(getItemIncomeTaxRates)
	const irTableRows = normalizeIRTable(item)
	const loading = useSelector(getLoadingIncomeTaxRates)

	useEffect(() => {
		dispatch(searchIncomeTaxRates(moment().format('YYYY-MM-DD')))
	}, [dispatch]);

	useEffect(() => {
		const rows = calcJudicialTimes(admissionDate, dismissalDate, distributionDate)
		setMonthsToPay(rows[0].monthsToPay || 0)
		setJudicialTimesRows(rows)
	}, [admissionDate, dismissalDate, distributionDate])

	const accumulatedIRTableRows = useMemo(() => {
		return normalizeAccumulatedIRTable(monthsToPay)(irTableRows)
	}, [irTableRows, monthsToPay])

	const currentValues = useMemo(() => {
		const avarageIrBase = irBase / monthsToPay
		const { aliquot, installment, from, to } = getCurrentIR(avarageIrBase, irTableRows)
		const installmentResult = installment * monthsToPay
		const irResult = calcIRResult(aliquot, irBase, installmentResult)

		return {
			from: toCurrency(from),
			to: toCurrency(to),
			aliquot: toPercentage(aliquot),
			installment: toCurrency(installmentResult),
			irBase: toCurrency(irBase),
			irResult: toCurrency(irResult)
		}
	}, [irBase, irTableRows, monthsToPay])

	useEffect(() => {
		setFieldValue('valorPrincipal', currentValues.irResult)
	}, [setFieldValue, currentValues.irResult])

	const judicialTimesColumns: ColumnData[] = [
		{
			label: t('solicitacaoPagamento:irTable.admission'),
			field: 'admissionDate',
			type: 'date',
		},
		{
			label: t('solicitacaoPagamento:irTable.dismissal'),
			field: 'dismissalDate',
			type: 'date',
		},
		{
			label: t('solicitacaoPagamento:irTable.judicial'),
			field: 'distributionDate',
			type: 'date',
		},
		{
			label: t('solicitacaoPagamento:irTable.workTime'),
			field: 'workTime',
			type: 'number',
		},
		{
			label: t('solicitacaoPagamento:irTable.judicial'),
			field: 'judicialTime',
			type: 'number',
		},
		{
			label: t('solicitacaoPagamento:irTable.totalTime'),
			field: 'totalTime',
			type: 'number',
		},
		{
			label: t('solicitacaoPagamento:irTable.noLapsedYears'),
			field: 'noLapsedYears',
			type: 'number',
		},
		{
			label: t('solicitacaoPagamento:irTable.monthsToPay'),
			field: 'monthsToPay',
			type: 'number',
		},
	];

	const irTableColumns: ColumnData[] = [
		{
			label: t('solicitacaoPagamento:irTable.from'),
			field: 'from',
			type: 'currency',
		},
		{
			label: t('solicitacaoPagamento:irTable.to'),
			field: 'to',
			type: 'currency',
		},
		{
			label: t('solicitacaoPagamento:irTable.aliquot'),
			field: 'aliquot',
			type: 'percentage',
		},
		{
			label: t('solicitacaoPagamento:irTable.subtractValue'),
			field: 'installment',
			type: 'currency',
		},
	];

	const resultTableColumns = [
		{
			label: t('solicitacaoPagamento:irTable.acimaDe'),
			field: 'from',
		},
		{
			label: t('solicitacaoPagamento:irTable.to'),
			field: 'to',
		},
		{
			label: t('solicitacaoPagamento:irTable.aliquot'),
			field: 'aliquot',
		},
		{
			label: t('solicitacaoPagamento:irTable.installment'),
			field: 'installment',
		},
		{
			label: t('solicitacaoPagamento:irTable.irResult'),
			field: 'irResult',
		},
	];

	const box = [
		{
			label: t('solicitacaoPagamento:irTable.aliquotIRValue') + ':',
			value: currentValues.aliquot,
		},
		{
			label: t('solicitacaoPagamento:irTable.installment') + ':',
			value: currentValues.installment,
		},
		{
			label: t('solicitacaoPagamento:irTable.irValue') + ':',
			value: `${currentValues.irResult} = ${currentValues.irBase} * ${currentValues.aliquot} - ${currentValues.installment}`,
		},
	];

	const resultTableRows = [{
		from: currentValues.from,
		to: currentValues.to,
		aliquot: currentValues.aliquot,
		installment: currentValues.installment,
		irResult: currentValues.irResult,
	}];

	return (
		<div className='margin-top-16'>
			<Accordion title={t('solicitacaoPagamento:irTable.title')}>
				<div className={classes.fullwidth}>
					<Table columns={judicialTimesColumns} rows={judicialTimesRows} />

					<Typography variant='h2' className='margin-24'>
						{t('solicitacaoPagamento:irTable.irMonth')}
					</Typography>
					<Table
						columns={irTableColumns}
						rows={irTableRows}
						isLoading={loading}
					/>

					<Typography variant='h2' className='margin-24'>
						{t('solicitacaoPagamento:irTable.irAccumulated')}
					</Typography>
					<Table
						columns={irTableColumns}
						rows={accumulatedIRTableRows}
						isLoading={loading}
					/>

					<div className={classes.box}>
						<table>
							<tbody>
								{box.map(({ label, value }, index) => (
									<tr key={`box_row_${index}`}>
										<td className={classes.box_label}>{label}</td>
										<td className='box_value'>{value}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<Table
						columns={resultTableColumns}
						rows={resultTableRows}
						isLoading={loading}
					/>
				</div>
			</Accordion>
		</div>
	);
};

export default IRTable;
