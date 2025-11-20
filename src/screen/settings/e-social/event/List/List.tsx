import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import {
	getListESocialEvent, getListFiltersESocialEvent, getLoadingESocialEvent
} from 'src/core/store/modules/e-social-event/selectors';
import { usePagination } from 'src/hooks/pagination';
import { useTranslation } from 'src/locale/i18n';
import { editESocialEvent, fetchESocialEvent } from 'src/core/store/modules/e-social-event/thunks';

const ESocialTablesList = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListESocialEvent);
	const loading = useSelector(getLoadingESocialEvent);
	const filters = useSelector(getListFiltersESocialEvent);

	const { page, pageSize } = usePagination();

	useEffect(() => {
		dispatch(fetchESocialEvent({ page, pageSize, ...filters}))
	}, [page, pageSize, dispatch, filters]); 

	const rows: any[] = list?.map((table: any) => {
		return {
			id: table.id,
			description: table.description,
			code: table.code,
			status: table.status
		}
	});

	const handleChangeStatus = ({ status, ...row }: any) => {
		if (row.id) dispatch(editESocialEvent({ ...row, status: !status }));
	};

	const columns: ColumnData[] = [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: t('eSocial:eSocialTables.filter.description'), field: 'description'},
		{ label: "Código evento", field: 'code'},
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];

	const onEdit = (row: any) => {
		history.push(`/configuracoes/e-social/evento-do-e-social/${row.id}`);
	}; 

	return (
		<>
			<Panel title={t('eSocial:eSocialEvent.title')}>
				<Table
					onEdit={onEdit}
					columns={columns}
					rows={rows}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default ESocialTablesList;
