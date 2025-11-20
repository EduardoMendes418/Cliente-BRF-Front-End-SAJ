import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from '@material-ui/icons/Visibility';

import { usePagination } from 'src/hooks/pagination';
import { useAreasWitchGroups } from 'src/hooks/fetchLists';
import { getListCircularizationBaseGenerationHeader, getListFiltersCircularizationBaseGenerationHeader, getLoadingCircularizationBaseGenerationHeader, getCircularizationBaseGenerationState } from 'src/core/store/modules/circularizationBaseGenerationHeader/selector';

import { IconButton } from '@material-ui/core';
import ApproversModal from '../../components/approversModal';
import { modal } from 'src/components/modals';
import {  circularizationStatusToShow } from '../../constants';
import { actions } from 'src/core/store';

const CircularizationBaseGenerationList= () => {

	const history = useHistory();
	const dispatch = useDispatch();
	const { areasDEJUROptions } = useAreasWitchGroups();

	const loading = useSelector(getLoadingCircularizationBaseGenerationHeader);
	const list = useSelector(getListCircularizationBaseGenerationHeader);
	const filters = useSelector(getListFiltersCircularizationBaseGenerationHeader); 
	const state = useSelector(getCircularizationBaseGenerationState);
	
	const { page, pageSize } = usePagination();

	useEffect(() => {
		dispatch(actions.CircularizationBaseGenerationHeader.setFilters({...filters, page, pageSize}));
	
	}, [page, pageSize]); 

	const rows: any[] = list?.map((item: any) => {
		return {
			...item,
			circularizationDate: item?.circularizationDate,
			dejurArea: areasDEJUROptions?.filter((x: any) => x.value === item?.dejurAreaId)[0]?.label,
			officeName: item?.office?.name,
			statusId: circularizationStatusToShow?.filter((x: any) => x.value === item?.status)[0]?.label,
		}
	});

	const columns: ColumnData[] = [
		{
			label: "Ações",
			field: "actions",
			type: "custom",
			component: (row: any) => {
				return (
					<>
					{
						row.status === 2 ? <>
						<IconButton onClick={() => onVisualize(row)}>
								 <EditIcon/> 
						</IconButton>
						
						</> : <>
						<IconButton onClick={() => onVisualize(row)}>
								 <VisibilityIcon color="primary"/> 
						</IconButton>	
						</>
					}
						
					</>
				);
			},
		},
		{
			label: "Aprovadores",
			field: "actions",
			type: "custom",
			component: (row: any) => {
				return (
					<>
					{
						row.approvers.length > 0 && row.status === 4 ? <>
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
		history.push(`/circularizacao/lancamento-juridico/${row.id}`);
	}; 

	return (
		<>
			<Panel title={"Listagem de Circularização"}>
				<Table
					columns={columns}
					rows={state === "failure" ? [] : rows}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default CircularizationBaseGenerationList;
