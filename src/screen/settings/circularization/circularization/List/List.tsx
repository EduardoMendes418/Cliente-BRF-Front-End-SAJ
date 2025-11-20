import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import {
	getListCircularizationConfiguration, getLoadingCircularizationConfiguration
} from 'src/core/store/modules/circularizationConfiguration/selector';
import { usePagination } from 'src/hooks/pagination';
import { editCircularizationConfiguration, fetchCircularizationConfiguration } from 'src/core/store/modules/circularizationConfiguration/thunks';
import { useAreasWitchGroups } from 'src/hooks/fetchLists';
import { useSnackbar } from 'notistack';
import { TCircularization } from 'src/core/models/circularization';

const CircularizationList = () => {

	const history = useHistory();
	const dispatch = useDispatch();
	const { areasDEJUROptions } = useAreasWitchGroups();
	const { enqueueSnackbar } = useSnackbar();
	const list = useSelector(getListCircularizationConfiguration);
	const loading = useSelector(getLoadingCircularizationConfiguration);
	
	const { page, pageSize } = usePagination();

	useEffect(() => {
		 dispatch(fetchCircularizationConfiguration({ page, pageSize})) as any;

	
	}, [])
	

	const rows: any[] = list?.map((item: TCircularization) => {
		return {
			id: item.id,
			dejurAreaId: item.dejurAreaId, 
			dejurArea: areasDEJUROptions?.filter((x: any) => x.value === item?.dejurAreaId)[0]?.label,
			isActive: item.isActive,
			provisionTolerancePercentage: item.provisionTolerancePercentage,
			maintenanceDate: item.maintenanceDate,
			createdBy: item.createdBy,
			approvalProcessType: item.approvalProcessType,
			userUpdatedId: item.userUpdatedId,
			userUpdated: item.userUpdated,
			logs: item.logs,
			createdDate: item.createdDate,
			updatedDate: item.updatedDate,
			updatedBy: item.updatedBy,
			isDeleted: item.isDeleted
		}
	});

	const handleChangeStatus = async ({ isActive, ...row }: any) => {
		row['dejurArea'] = null;
		if (row.id) {
			const { type } = await dispatch(editCircularizationConfiguration({ ...row, isActive: !isActive })) as any;
			if(type === 'circularizationConfiguration/edit/fulfilled'){
				return enqueueSnackbar("Status alterado com sucesso!", {
					variant: "success",
				});
			} else {
				return enqueueSnackbar("Ocorreu um erro.", {
					variant: "error",
				});
			}
		};
	};

	const columns: ColumnData[] = [
		{ label: "Código", field: 'id' },
		{ label: "Área DEJUR", field: 'dejurArea' },
		{ label: "Percentual tolerância provisão", field: 'provisionTolerancePercentage', type: 'percentage'},
		{ label: "Data Manutenção", field: 'maintenanceDate', type: 'date'},
		{ label: "Nome", field: 'createdBy'},
		{ label: "Tipo processo aprovação", field: 'approvalProcessType'},

		{
			label: 'Status',
			field: 'isActive',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];

	const onEdit = (row: TCircularization) => {
		history.push(`/configuracoes/circularizacao/percentual-de-tolerancia/${row.id}`);
	}; 

	return (
		<>
			<Panel title={"Lista do parâmetro da circularização"}>
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

export default CircularizationList;
