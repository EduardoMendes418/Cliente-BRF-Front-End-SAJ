import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import PersonIcon from '@material-ui/icons/Person';
import { usePagination } from 'src/hooks/pagination';
import { useAreasWitchGroups } from 'src/hooks/fetchLists';
import { getListCircularizationBaseGenerationHeader, getListFiltersCircularizationBaseGenerationHeader, getLoadingCircularizationBaseGenerationHeader } from 'src/core/store/modules/circularizationBaseGenerationHeader/selector';
import { fetchCircularizationBaseGenerationHeader } from 'src/core/store/modules/circularizationBaseGenerationHeader/thunks';
import { useSnackbar } from 'notistack';
import { IconButton } from '@material-ui/core';
import ApproversModal from '../../components/approversModal';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from "@material-ui/icons/Edit";
import { modal } from 'src/components/modals';
import {  circularizationStatusToShow } from '../../constants';

const CircularizationBaseGenerationList= () => {

	const history = useHistory();
	const dispatch = useDispatch();
	const { areasDEJUROptions } = useAreasWitchGroups();
	const { enqueueSnackbar } = useSnackbar();

	const loading = useSelector(getLoadingCircularizationBaseGenerationHeader);
	const list = useSelector(getListCircularizationBaseGenerationHeader);
	const filters = useSelector(getListFiltersCircularizationBaseGenerationHeader); 
	const { page, pageSize } = usePagination();

	const search = async () => {
		const { type } = await dispatch(fetchCircularizationBaseGenerationHeader({ page, pageSize, ...filters})) as any;
		if(type === 'circularizationBaseGenerationHeader/fetch/rejected'){
			return  enqueueSnackbar("Não existe registros para o filtro selecionado.", {
				variant: "error",
			})
		} 
	}

	useEffect(() => {
		search();
	}, [page, pageSize, dispatch, filters]); 

	const rows: any[] = list?.map((item: any) => {
		return {
			...item,
			circularizationDate: item?.circularizationDate,
			dejurArea: areasDEJUROptions?.filter((x: any) => x.value === item?.dejurAreaId)[0]?.label,
			statusId: circularizationStatusToShow?.filter((x: any) => x.value === item?.status)[0]?.label,
			officeName: item?.office?.name,
			filterStatusCtg: item?.filterStatusCtg?.replace(/,/g, ', ')
		}
	});

	const columns: ColumnData[] = [
		{
			label: 'Ações',
			field: 'action',
			component: (row: any) => {
				return (
					<>
						<IconButton aria-label='edit' onClick={() => onVisualize(row)}>
							{row.status === 10 ? <EditIcon color='primary'/> : <VisibilityIcon color='primary'/>}
						</IconButton>
					</>
				)
			},
			type: 'custom'
		}, 
		{
			label: "Aprovadores",
			field: "actions",
			type: "custom",
			component: (row: any) => {
				return (
					<>
					{
						row?.approvers?.length > 0 && row.status === 4 ? <>
						<IconButton onClick={() => modal({
								title: "Possíveis aprovadores",
								component: <ApproversModal approvers={row.approvers}/>,
								buttons: [],
								dialogProps: {
									maxWidth: "xl",
									showCloseButton: true,
									fullWidth: true,
								},
							})}>
								{
									row.status === 5 ? <PersonIcon style={{fill: "green"}}/> : <PersonIcon color="primary"/>
								}
						</IconButton>
						</> : null
					}
					</>	
				);
			},
		},
		{ label: "Mês Competência", field: 'circularizationDate', type: 'dateMonthYear' },
		{ label: "Área DEJUR", field: 'dejurArea' },
		{ label: "Escritório", field: "officeName"},
		{ label: "Tipo da Contingência", field: "filterContigency"},
		{ label: "Classe da Provisão", field: "filterClassProvision"},
		{ label: "Esfera", field: "filterSphere"},
		{ label: "Fechamento", field: "closure"},
		{ label: "Status da Pasta/CTG", field: "filterStatusCtg"},
		{ label: 'Status', field: 'statusId'},
	];

	const onVisualize = (row: any) => {
		history.push(`/circularizacao/geracao-base-circularizacao/${row.id}`);
	}; 

	return (
		<>
			<Panel title={"Listagem de Circularização"}>
				<Table
					columns={columns}
					rows={rows}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default CircularizationBaseGenerationList;
