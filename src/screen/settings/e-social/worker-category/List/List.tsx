import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import { usePagination } from 'src/hooks/pagination';
import { useTranslation } from 'src/locale/i18n';
import { getListESocialWorkerCategory, getListFiltersESocialWorkerCategory, getLoadingESocialWorkerCategory } from 'src/core/store/modules/e-social-worker-category/selectors';
import { editESocialWorkerCategory, fetchESocialWorkerCategory } from 'src/core/store/modules/e-social-worker-category/thunks';
import { TESocialWorkerCategoryGridList } from 'src/core/models/e-social-worker-category';

const ESocialWorkerCategoryList = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListESocialWorkerCategory);
	const loading = useSelector(getLoadingESocialWorkerCategory);
	const filters = useSelector(getListFiltersESocialWorkerCategory);

	const { page, pageSize } = usePagination();

	 useEffect(() => {
		dispatch(fetchESocialWorkerCategory({ page, pageSize, ...filters}))
	}, [page, pageSize, dispatch, filters]);

	 const rows: any [] = list?.map((table: any) => {
		return {
			id: table.id,
			eSocialTableDescription: table.eSocialTableDescription,
			code: table.code,
			description: table.description,
			eSocialGroupDescription: table.eSocialGroupDescription,
			status: table.status
		}
	}); 

	 const handleChangeStatus = ({ status, ...row }: TESocialWorkerCategoryGridList) => {
		if (row.id) dispatch(editESocialWorkerCategory({ ...row, status: !status }));
	}; 

	 const columns: ColumnData[] = [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: t('eSocial:workerCategory.filter.eSocialTableDescription'), field: 'eSocialTableDescription' },
		{ label: t('eSocial:workerCategory.filter.code'), field: 'code'},
		{ label: t('eSocial:workerCategory.filter.description'), field: 'description'},
		{ label: t('eSocial:workerCategory.filter.eSocialGroupDescription'), field: 'eSocialGroupDescription'},
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	]; 

	 const onEdit = (row: TESocialWorkerCategoryGridList) => {
		history.push(`/configuracoes/e-social/categoria-do-trabalhador/${row.id}`);
	};  

	return (
		<>
			 <Panel title={t('eSocial:workerCategory.title')}>
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

export default ESocialWorkerCategoryList;
