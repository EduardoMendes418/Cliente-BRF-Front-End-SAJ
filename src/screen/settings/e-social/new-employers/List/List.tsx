import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import { usePagination } from 'src/hooks/pagination';
import { useTranslation } from 'src/locale/i18n';
import { TESocialWorkerCategoryGridList } from 'src/core/models/e-social-worker-category';
import { getListESocialClosureEmployer, getListFiltersESocialClosureEmployer, getLoadingESocialClosureEmployer } from 'src/core/store/modules/e-social-new-employers/selectors';
import { fetchESocialClosureEmployer, fetchESocialClosureEmployerDelete } from 'src/core/store/modules/e-social-new-employers/thunks';
import { confirm } from 'src/components/modals';
import { useSnackbar } from 'notistack';


const formatCNPJ = (cnpj: string): string => {
    cnpj = cnpj.replace(/\D/g, '');
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

const ESocialNewEmployerList = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const loading = useSelector(getLoadingESocialClosureEmployer);
	const listESocialEmployer = useSelector(getListESocialClosureEmployer);
	const filters = useSelector(getListFiltersESocialClosureEmployer);

	const { page, pageSize } = usePagination();

	useEffect(() => {
		dispatch(fetchESocialClosureEmployer({ page, pageSize, ...filters }));
	}, [page, pageSize, dispatch, filters]);

	const rows: any [] = listESocialEmployer?.map((item: any) => {
		return {
			id: item.id,
			eSocialTableDescription:  item.closure,
			cnpj: formatCNPJ(item.cnpj)
			
		}
	}); 



	const columns: ColumnData[] = [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: "Fechamento", field: 'eSocialTableDescription' },
		{ label: "Cnpj", field: 'cnpj'},
	]; 

	const onEdit = (row: TESocialWorkerCategoryGridList) => {
		history.push(`/configuracoes/e-social/empregadores/${row.id}`);
	};  

	const onDelete = async (row:any) => {
		if (row !== undefined) {
			const isConfirmed = await confirm('Deseja excluir o item selecionado?', 'Atenção:')
		if(isConfirmed){
			
		const {meta} =  await dispatch(fetchESocialClosureEmployerDelete({ id: row.id })) as any;
		
		if(meta?.requestStatus === 'fulfilled'){
			dispatch(fetchESocialClosureEmployer({ page, pageSize, ...filters }));
			return enqueueSnackbar("Item excluído com sucesso", {
				variant: "success",
			});
		}
	}}
}

	return (
		<>
			<Panel title={"Empregadores"}>
				<Table
					onEdit={onEdit}
					columns={columns}
					rows={rows}
					isLoading={loading}
					onDelete={onDelete}
				/>
			</Panel>
			<Pagination /> 
		</>
	);
};

export default ESocialNewEmployerList;
