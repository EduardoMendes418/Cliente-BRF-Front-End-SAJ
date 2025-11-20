import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment'

import Table, { ColumnData } from 'src/components/Table';
import Panel from 'src/components/Panel';
import Pagination from 'src/components/Pagination';

import {
	getStatusClosures
} from 'src/core/store/modules/closures/selectors';

import { useTranslation } from 'src/locale/i18n';
import { statusClosureText, STATUS_CLOSURE } from 'src/screen/closure/constants';
import { TClosures } from 'src/core/models/closures';
import { CircularProgress, IconButton } from '@material-ui/core';
import ScheduleIcon from '@material-ui/icons/Schedule';
type TProps = {
	handleAction: (row: any) => void
	data: TClosures[]
	lockId?: number
	handleSchedule: (row: any) => void
}

const ClosureList = ({ handleAction, data, lockId, handleSchedule }: TProps) => {
	const { t } = useTranslation();

	const loading = useSelector(getStatusClosures);
	const rows = useMemo(() => data.map((item) => ({
		...item,
		statusText: (statusClosureText as any)[item.status],
		isEditButtonHidden: item.status === STATUS_CLOSURE.BLOKED || item.id === lockId,
		monthCompetence: moment(item.period).format("MM/yyyy")
	})
	), [data, lockId]);

	const columns: ColumnData[] = [
		{
			label: "Agendar", field: 'actions', type: "custom",
			component: (row: any) => {
				return (
					<>
						{
							(row?.status === STATUS_CLOSURE.CLOSURE) ? <>
								<IconButton onClick={() => handleSchedule(row)}>
									<ScheduleIcon />
								</IconButton>
							</> : null
						}
					</>
				);
			},
		},
		{ label: t('closure:closingRoutine.list.id'), field: 'id' },
		{
			label: t('closure:closingRoutine.list.period'),
			field: 'monthCompetence',
		},
		{ label: t('closure:closingRoutine.list.status'), field: 'statusText' },
		{
			label: t('closure:closingRoutine.list.startDateCompetence'),
			field: 'startDateCompetence',
			type: 'date',
		},
		{
			label: t('closure:closingRoutine.list.endDateCompetence'),
			field: 'endDateCompetence',
			type: 'date',
		},
	];


	return (
		<>
			<Panel
				title={t('closure:closingRoutine.titleList')}
				slotTopRightPermission="view"
				slotTopRight={loading !== 'initial' ?
					<CircularProgress size={30} /> : null}
			>
				<Table
					columns={columns}
					rows={rows}
					isLoading={loading === 'fetching'}
					onEdit={handleAction}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default ClosureList;
