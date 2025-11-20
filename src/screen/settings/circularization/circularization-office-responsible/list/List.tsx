import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import { usePagination } from 'src/hooks/pagination';
import { useSnackbar } from 'notistack';
import { getListCircularizationOfficeResponsibleConfiguration, getLoadingCircularizationOfficeResponsibleConfiguration } from 'src/core/store/modules/circularizationOfficeResponsibleConfiguration/selector';
import { addCircularizationOfficeResponsibleConfiguration, fetchCircularizationOfficeResponsibleConfiguration } from 'src/core/store/modules/circularizationOfficeResponsibleConfiguration/thunks';
import { useAreasWitchGroups } from 'src/hooks/fetchLists';

const CircularizationOfficeResponsibleList = () => {

	const history = useHistory();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const list = useSelector(getListCircularizationOfficeResponsibleConfiguration);
	const loading = useSelector(getLoadingCircularizationOfficeResponsibleConfiguration);
	const { areasDEJUROptions } = useAreasWitchGroups();

	const { page, pageSize } = usePagination();

	useEffect(() => {
		dispatch(fetchCircularizationOfficeResponsibleConfiguration({ page, pageSize})) as any;
	}, [])

	const rows: any[] = list.map((item: any) => {
		return {
			id: item.id,
			officeName: item.officeName,
			officeResponsible: item.circularizationOfficeResponsible.reduce((userName: string, obj: any) => {
				return userName + obj.userName + ", ";
			}, "")
			.slice(0, -2),
			updatedDate: item.updatedDate,
			createdBy: item.createdBy,
			status: item.status,
			officeId: item.officeId,
			circularizationOfficeResponsible: item.circularizationOfficeResponsible,
			dejurArea: areasDEJUROptions?.filter((x: any) => x.value === item?.dejurAreaId)[0]?.label,
			dejurAreaId: item.dejurAreaId,
		}
	}); 

	const handleChangeStatus = async ({ status, ...row }: any) => {
		if (row.id) {
			const { type } = await dispatch(addCircularizationOfficeResponsibleConfiguration({ ...row, status: !status })) as any;
			if(type === 'circularizationOfficeResponsibleConfiguration/add/fulfilled'){
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
		{ label: "Id", field: 'id' },
		{ label: "Escritório", field: 'officeName' },
		{ label: "Área DEJUR", field: 'dejurArea'},
		{ label: "Responsáveis", field: 'officeResponsible'},
		{ label: "Data de Manutenção", field: 'updatedDate', type: 'date'},
		{ label: "Usuário", field: 'createdBy'},
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		}, 
	];

	const onEdit = (row: any) => {
		history.push(`/configuracoes/circularizacao/responsaveis-escritorios/${row.officeId}`);
	}; 

	return (
		<>
			<Panel title={"Lista de responsáveis do escritório da circularização"}>
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

export default CircularizationOfficeResponsibleList;
