import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import { usePagination } from 'src/hooks/pagination';
import { useTranslation } from 'src/locale/i18n';
import { getListESocialRegistrationTable, getListFiltersESocialRegistrationTable, getLoadingESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/selector';
import { editESocialRegistrationTable, fetchESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/thunks';

const ESocialRegistrationTable = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListESocialRegistrationTable);
	const loading = useSelector(getLoadingESocialRegistrationTable);
	const filters = useSelector(getListFiltersESocialRegistrationTable);

	const { page, pageSize } = usePagination();

	useEffect(() => {
		dispatch(fetchESocialRegistrationTable({ page: page, pageSize: pageSize, notPaginate: false, ...filters}))
	}, [page, pageSize, dispatch, filters]);

	  const rows: any [] = list?.map((table: any) => {
		return {
			id: table.id,
			code: table.code,
			description: table.description,
			status: table.status,
			eSocialTableId: table.eSocialTableNumber,
			eSocialTableDescription: table.eSocialTableDescription
		}
	}); 

	  const handleChangeStatus = ({ status, ...row }: any) => {
		if (row.id) dispatch(editESocialRegistrationTable({ ...row, status: !status }));
	};  

	   const columns: ColumnData[] = [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: t('eSocial:eSocialTablesRegistration.filter.eSocialTableId'), field: 'eSocialTableId'},
		{ label: t('eSocial:eSocialTablesRegistration.filter.eSocialTableDescription'), field: 'eSocialTableDescription'},
		{ label: t('eSocial:eSocialTablesRegistration.filter.code'), field: 'code'},
		{ label: t('eSocial:eSocialTablesRegistration.filter.description'), field: 'description'},

		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];  

	  const onEdit = (row: any) => {
		history.push(`/configuracoes/e-social/cadastrar-tabelas-do-e-social/${row.id}`);
	};    

	return (
		<>
			 <Panel title={t('eSocial:eSocialTablesRegistration.title')}>
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

export default ESocialRegistrationTable;
