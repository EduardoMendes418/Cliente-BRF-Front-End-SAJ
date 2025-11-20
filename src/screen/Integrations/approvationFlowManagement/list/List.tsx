import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';
import RefreshIcon from '@material-ui/icons/Refresh';
import CancelIcon from '@material-ui/icons/Cancel';
import { usePagination } from 'src/hooks/pagination';
import { useSnackbar } from 'notistack';
import { Grid, IconButton } from '@material-ui/core';
import { fetchApprovationFlowManagement, reprocessApprovationFlow } from 'src/core/store/modules/approvation-flow-management/thunks';
import { getListApprovationFlowManagement, getLoadingApprovationFlowManagement, getListFiltersApprovationFlowManagement } from 'src/core/store/modules/approvation-flow-management/selector';
import { Button } from 'src/components/button';
import { modal } from "src/components/modals";
import CancelModal from '../cancelModal';

enum REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS {
	PAYMENT = 1,
	AGREEMENT,
	GOODS_AND_GUARANTEES,
	PENSION,
	CONFRONTER,
	OVERSIGHT,
	ACCOUNTABILITY,
	BLOCKS_AND_TRANSFERS,
	CREDIT_RECEIPT,
	CREDIT_UPDATE,
	CIRCULARIZATION
}

enum PROCESSING_STATUS {
	REQUESTED,
	PROCESSING,
	DONE,
	DONE_WITH_ERRORS,
	LEGAL_ONE_ERROR,
	CANCELED
}

const statusTextApprovalsFlow = {
	[REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS.PAYMENT]: "Pagamentos",
	[REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS.AGREEMENT]: "Acordo",
	[REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS.GOODS_AND_GUARANTEES]: "Bens e Garantias",
	[REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS.PENSION]: "Pensão",
	[REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS.CONFRONTER]: "Confrontador",
	[REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS.OVERSIGHT]: "Fiscalização",
	[REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS.ACCOUNTABILITY]: "Prestação de Conta",
	[REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS.BLOCKS_AND_TRANSFERS]: "Bloqueio e Transferência",
	[REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS.CREDIT_RECEIPT]: "Recebimento de Crédito",
	[REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS.CREDIT_UPDATE]: "Atualização de Depósito",
	[REQUEST_TYPE_APPROVATION_FLOW_MANAGEMENTS.CIRCULARIZATION]: "Circularização"
} as any;

const processingStatusText = {
	[PROCESSING_STATUS.REQUESTED]: "Solicitado",
	[PROCESSING_STATUS.PROCESSING]: "Processando",
	[PROCESSING_STATUS.DONE]: "Concluído",
	[PROCESSING_STATUS.DONE_WITH_ERRORS]: "Concluído com Erros",
	[PROCESSING_STATUS.LEGAL_ONE_ERROR]: "Erro Legal One",
	[PROCESSING_STATUS.CANCELED]: "Cancelado"
} as any;

const ApprovationFlowManagementList = () => {

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const loading = useSelector(getLoadingApprovationFlowManagement);
	const list = useSelector(getListApprovationFlowManagement);
	const filters = useSelector(getListFiltersApprovationFlowManagement); 
	const { page, pageSize } = usePagination();

	
	const checkFilter = Object.keys(filters).length === 0;

	const search = async () => {
		const { type } = await dispatch(fetchApprovationFlowManagement({ page, pageSize, ...filters   })) as any;
		if(type === 'approvationFlowManagement/fetch/rejected'){
			return  enqueueSnackbar("Não existe registros para o filtro selecionado.", {
				variant: "error",
			})
		} 
	}

	const refreshList = async (id: any) => {
		const {type} = await dispatch(reprocessApprovationFlow(id)) as any;

		if(type === "approvationFlowManagement/reprocess/fulfilled"){
			return  enqueueSnackbar("Registro enviado para fila de contabilização", {
				variant: "success",
			})
		} else {
			return  enqueueSnackbar("Aconteceu um erro", {
				variant: "error",
			})
		}
	}

	useEffect(() => {
		if(checkFilter === true){
			dispatch(fetchApprovationFlowManagement({ pageSize: 180, ProcessingStatuses: 3}))
			return
		} else {
			search();
		}
		
	}, [page, pageSize, dispatch, filters]);  

	const rows: any[] = list?.map((item: any) => {
		return {
			...item,
			requestType: statusTextApprovalsFlow[item.requestType],
			status: processingStatusText[item.processingStatus],
			observation: item.logs[0]?.observation
		}
	});


	const columns: ColumnData[] = [
		{
			label: "Ação",
			field: "actions",
			type: "custom",
			component: (row: any) => {
				return (
					<>
					{
						row.processingStatus === 3  || row.processingStatus === 4  ? <>
						<IconButton onClick={() => refreshList(row.id)}>
								{
								<RefreshIcon/>
								}
						</IconButton>
						</> : null
					}
					</>	
				);
			},
		},
		{
			label: "Cancelar",
			field: "actions",
			type: "custom",
			component: (row: any) => {
				return (
					<>
					{
						row.requestType === "Pagamentos" && row.processingStatus === 3 || row.processingStatus === 4 ? <>
						<IconButton onClick={() =>
							modal({
								title: "Cancelar contabilização",
								buttons: [],
								dialogProps: { maxWidth: "md", showCloseButton: true, fullWidth: true },
								component: <CancelModal row={row}/>,
							})}>
								{
								<CancelIcon/>
								}
						</IconButton>
						</> : null 
					}
					</>	
				);
			},

		}, 
		{ label: "Id", field: 'id' },
		{ label: "Data", field: 'createdDate', type: 'dateHour' },
		{ label: "Status", field: 'status'},
		{ label: "Tipo do documento", field: "requestType"},
		{ label: "Pasta CTG", field: "folderNumber"},
		{ label: "Documento", field: 'requestId'},
		{ label: "Nome do aprovador", field: "createdBy"},
		{ label: "Mensagem", field: "observation"},
	];
	
	return (
		<>
			<Grid
				container
				direction="row"
				justifyContent="flex-end"

				>
			<Button
				style={{ marginTop: '10px' }}
				onClick={() => checkFilter === true ? dispatch(fetchApprovationFlowManagement({ page, pageSize, ProcessingStatuses: 3})) : dispatch(fetchApprovationFlowManagement({ page, pageSize, ...filters }))}
				variant="contained"
				color='primary'
				text="Atualizar Lista"
			/>
		
			</Grid>
			<Panel title={"Listagem de Contabilização"}>
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

export default ApprovationFlowManagementList;
