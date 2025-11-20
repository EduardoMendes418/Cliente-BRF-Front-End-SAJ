import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useTranslation } from 'src/locale/i18n';
import ScreenTemplate from 'src/components/Screen';
import { useRegisterDefault } from "src/hooks";
import { TClosures } from 'src/core/models/closures';

import { fetchClosuresResultList } from 'src/core/store/modules/closures/thunks';
import List from "./List";
import Form from "./Form";
import { actions } from 'src/core/store';
import { getStatusClosures, getErrorMessageClosures, getListClosures } from 'src/core/store/modules/closures/selectors';
import { usePagination } from 'src/hooks/pagination';
import { modal } from "src/components/modals";
import EditModal from './Form/Modal'

const ClosingRoutine = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { page, pageSize } = usePagination()
	const [lockId, setLockId] = useState<number>()

	const list = useSelector(getListClosures);
	const status = useSelector(getStatusClosures)

	const fetchList = useCallback(() => {
		dispatch(fetchClosuresResultList({ page, pageSize }))
	}, [dispatch, page, pageSize]);

	useEffect(() => () => dispatch(actions.closures.clear()), [dispatch]);

	useEffect(() => {
		fetchList()
	}, [fetchList]);

	useRegisterDefault({
		action: 'closures',
		getStatus: getStatusClosures,
		getErrorMessage: getErrorMessageClosures,
		route: 'noRedirect',
		updateInListCallback: () => fetchList()
	});

	useEffect(() => {
		if (status !== "saving") {
			setLockId(undefined)
		}
	}, [status])

	const lockOnClose = (status: any) => {
		if(status !== 2){
			setLockId(undefined)
		}
	}

	const handleAction = ({
		id,
		period,
		startDateCompetence,
		endDateCompetence,
		status,
		dataHoraAgendamento
	}: TClosures, isSchedule?: boolean) => {

		if (!isSchedule) setLockId(id)

		modal({
			title: t('closure:closingRoutine.title'),
			buttons: [],
			dialogProps: { maxWidth: 'md', showCloseButton: true },
			onCloseAction: () => lockOnClose(status),
			component: <EditModal row={{
				id,
				period,
				startDateCompetence,
				endDateCompetence,
				status,
				dataHoraAgendamento
			}}
				isSchedule={isSchedule}
			/>
		})

	}

	return (
		<ScreenTemplate>
			<Form fetchList={fetchList} addEnable={list.length === 0} />
			<List
				handleAction={(row) => handleAction(row)}
				handleSchedule={(row) => handleAction(row, true)}
				data={list}
				lockId={lockId}
			/>
		</ScreenTemplate>
	)
};

export default ClosingRoutine;
