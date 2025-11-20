import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import {
	getListESocialGroup, getListFiltersESocialGroup, getLoadingESocialGroup
} from 'src/core/store/modules/e-social-group/selectors';
import { usePagination } from 'src/hooks/pagination';
import { useTranslation } from 'src/locale/i18n';
import { TESocialRegistrationGroup } from 'src/core/models/e-social-tables';
import { editESocialGroup, fetchESocialGroup } from 'src/core/store/modules/e-social-group/thunks';

const ESocialTablesList = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListESocialGroup);
	const loading = useSelector(getLoadingESocialGroup);
	const filters = useSelector(getListFiltersESocialGroup);

	const { page, pageSize } = usePagination();

	 useEffect(() => {
		dispatch(fetchESocialGroup({ page, pageSize, ...filters}))
	}, [page, pageSize, dispatch, filters]); 

	const rows: TESocialRegistrationGroup[] = list?.map((table: any) => {
		return {
			id: table.id,
			description: table.description,
			status: table.status
		}
	});

	const handleChangeStatus = ({ status, ...row }: TESocialRegistrationGroup) => {
		if (row.id) dispatch(editESocialGroup({ ...row, status: !status }));
	};

	const columns: ColumnData[] = [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: t('eSocial:eSocialTables.filter.description'), field: 'description'},
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];

	const onEdit = (row: TESocialRegistrationGroup) => {
		history.push(`/configuracoes/e-social/grupo-do-e-social/${row.id}`);
	}; 

	return (
		<>
			<Panel title={t('eSocial:eSocialGroup.title')}>
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
