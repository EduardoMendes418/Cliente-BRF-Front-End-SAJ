import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import { usePagination } from 'src/hooks/pagination';
import { useTranslation } from 'src/locale/i18n';
import { getListESocialReasonsForDismissal, getListFiltersESocialReasonsForDismissal, getLoadingESocialReasonsForDismissal } from 'src/core/store/modules/e-social-reasons-for-dismissal/selectors';
import { editESocialReasonsForDismissal, fetchESocialReasonsForDismissal } from 'src/core/store/modules/e-social-reasons-for-dismissal/thunks';

const ESocialReasonsForDismissalList = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListESocialReasonsForDismissal);
	const loading = useSelector(getLoadingESocialReasonsForDismissal);
	const filters = useSelector(getListFiltersESocialReasonsForDismissal);

	const { page, pageSize } = usePagination();

	 useEffect(() => {
		dispatch(fetchESocialReasonsForDismissal({ page, pageSize, ...filters}))
	}, [page, pageSize, dispatch, filters]);

	  const rows: any [] = list?.map((table: any) => {
		return {
			id: table.id,
			code: table.code,
			description: table.description,
			startDate: table.startDate,
			endDate: table.endDate,
			status: table.status,
			eSocialTableId: table.eSocialTableId
		}
	}); 

	  const handleChangeStatus = ({ status, ...row }: any) => {
		if (row.id) dispatch(editESocialReasonsForDismissal({ ...row, status: !status }));
	}; 

	  const columns: ColumnData[] = [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: t('eSocial:workerCategory.filter.code'), field: 'code'},
		{ label: t('eSocial:workerCategory.filter.description'), field: 'description'},
		{ label: t('eSocial:reasonsForDismissal.filter.startDate'), field: 'startDate', type: 'date'},
		{ label: t('eSocial:reasonsForDismissal.filter.endDate'), field: 'endDate', type: 'date'},
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	]; 

	  const onEdit = (row: any) => {
		history.push(`/configuracoes/e-social/motivos-de-desligamento/${row.id}`);
	};   

	return (
		<>
			 <Panel title={t('eSocial:reasonsForDismissal.title')}>
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

export default ESocialReasonsForDismissalList;
