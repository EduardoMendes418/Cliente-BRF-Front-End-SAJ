import { Chip, makeStyles } from '@material-ui/core';
import Accordion from 'src/components/Accordion';
import Table, { ColumnData } from 'src/components/Table';
import { TLogs } from 'src/core/models';
import { useTranslation } from 'src/locale/i18n';
import { useMemo } from 'react';
import { requestStatusFlowText } from '../constants';

const useStyles = makeStyles({
	[-1]: {
		backgroundColor: '#BADEF6',
		color: '#004894'
	},
	0: {
		backgroundColor: '#FFEDB4',
		color: '#F04E23'
	},
	1: {
		backgroundColor: '#E8F6EA',
		color: '#1C6226'
	},
	2: {
		backgroundColor: '#F3E6F3',
		color: '#004894'
	},
	3: {
		backgroundColor: '#BADEF6',
		color: '#004894'
	},
	4: {
		backgroundColor: '#6FCF97',
		color: '#FFFFFF'
	},
	5: {
		backgroundColor: '#FDDFB4',
		color: '#DB5315'
	},
	6: {
		backgroundColor: '#BB6BD9',
		color: '#FFFFFF'
	},
	7: {
		backgroundColor: '#F2994A',
		color: '#FFFFFF'
	},
});

type Props = {
	items: TLogs[];
}

const Log = ({ items }: Props) => {
	const styles = useStyles() as { [key: string]: string };
	const { t } = useTranslation()

	const rows = useMemo(() => {
		return items.map((item, i) => {
			const status = item.statusFlowId

			const statusText = requestStatusFlowText[status];

			return {
				...item,
				status: <Chip label={statusText} className={styles[status]} />
			}
		}).sort((item1, item2) => new Date(item1.occurrenceDate).getTime() - new Date(item2.occurrenceDate).getTime())
	}, [items, styles])

	const columns: ColumnData[] = [
		{ label: t('userName'), field: 'userName' },
		{ label: t('Pagamentos:logs.date'), field: 'occurrenceDate', type: 'dateHour' },
		{ label: t('status'), field: 'status' },
		{ label: t('Pagamentos:logs.obs'), field: 'observation' },
	];

	return !items.length ? null
		: (
			<div className='margin-top-16 form-accordion'>
				<Accordion title={t('Pagamentos:logs.titleList')}>
					<Table columns={columns} rows={rows} />
				</Accordion>
			</div>
		)
}

export default Log;