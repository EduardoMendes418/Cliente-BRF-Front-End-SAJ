import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import {
	getListESocialTables, getListFiltersESocialTables, getLoadingESocialTables
} from 'src/core/store/modules/e-social-tables/selectors';
import { usePagination } from 'src/hooks/pagination';
import { useTranslation } from 'src/locale/i18n';
import { TESocialRegistrationTables } from 'src/core/models/e-social-tables';
import { editESocialTables, fetchESocialTables } from 'src/core/store/modules/e-social-tables/thunks';

const ESocialTablesList = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListESocialTables);
	const loading = useSelector(getLoadingESocialTables);
	const filters = useSelector(getListFiltersESocialTables);

	const { page, pageSize } = usePagination();

	 useEffect(() => {
		dispatch(fetchESocialTables({ page, pageSize, ...filters}))
	}, [page, pageSize, dispatch, filters]); 

	const rows: TESocialRegistrationTables[] = list?.map((table: any) => {
		return {
			id: table.id,
			eSocialTableNumber: table.eSocialTableNumber,
			description: table.description,
			status: table.status
		}
	});

	const handleChangeStatus = ({ status, ...row }: TESocialRegistrationTables) => {
		if (row.id) dispatch(editESocialTables({ ...row, status: !status }));
	};

	const columns: ColumnData[] = [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: t('eSocial:eSocialTables.filter.eSocialTableNumber'), field: 'eSocialTableNumber' },
		{ label: t('eSocial:eSocialTables.filter.description'), field: 'description'},
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];

	const onEdit = (row: TESocialRegistrationTables) => {
		history.push(`/configuracoes/e-social/tabelas-do-e-social/${row.id}`);
	}; 

	return (
		<>
			<Panel title={t('eSocial:eSocialTables.title')}>
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
