import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import List from "src/components/List";
import { ColumnData } from "src/components/Table";
import { useTranslation } from "src/locale/i18n";

import { usePagination } from "src/hooks/pagination";
import { AppDispatch } from "src/core/store";
import { cancelReportExecution, fetchReport } from "src/core/store/modules/report/thunks";
import { getListReports, getLoadingReports } from "src/core/store/modules/report/selectors";
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/GetApp";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import CloseIcon from "@material-ui/icons/Close";
import useReportTypes from "src/screen/settings/general/report-orders/hooks/useReportTypes";
import EmailModal from "./emailModal";
import { modal } from "src/components/modals";
import { fetchActivesUsers } from "src/core/store/modules/users/thunks";
import { useSnackbar } from "notistack";
import { confirm } from "src/components/modals";

const nameStatus = {
	0: "Solicitado",
	1: "Em processamento",
	2: "Finalizado",
	3: "Erro",
	4: "Cancelado"
}
const ReportConfigurationList = () => {

	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const list = useSelector(getListReports);
	const loading = useSelector(getLoadingReports);
	const { reportTypeOptions } = useReportTypes();
	const { page, pageSize } = usePagination();
	const { enqueueSnackbar } = useSnackbar();

	reportTypeOptions.push({label: "Pedidos", value: 38})
	reportTypeOptions.push({label: "Requisições", value: 76})

	useEffect(() => {
		dispatch(fetchReport({page, pageSize}));
		dispatch(fetchActivesUsers());
	},[page, pageSize, dispatch])

	const onCancelReportExecution = async (executionId: string) => {

		if(await confirm('Cancelar execuão do relatório?')){
			const { payload } = await dispatch(cancelReportExecution({executionId})) as any;

		if(payload?.error?.status === 500){
			return enqueueSnackbar(`${payload?.error?.detail}`, {
				variant: "error",
			});
		} else {
			return enqueueSnackbar(`Execução cancelada com sucesso`, {
				variant: "success",
			});
		}
		} else 
			return
	}

	const columns: ColumnData[] = [
		{
			label: t("reports:actions"),
			field: "actions",
			type: "custom",
			component: (row: any) => {
				if (!row.reportUrl) return null
				return (
					<>
						<IconButton onClick={() => window.open(row.reportUrl)}>
							<VisibilityIcon color="primary" />
						</IconButton>
					</>
				);
			},
		},
		{
			label: "Compartilhamento",
			field: "email",
			type: "custom",
			component: (row: any) => (
				<>
				{
					row.statusExecution === 4 ? null : <>
						<IconButton aria-label="edit" onClick={() => modal({
							title: "Enviar email",
							component: <EmailModal executionId={row.executionId}/>,
							buttons: [],
							dialogProps: {
								maxWidth: "xl",
								showCloseButton: true,
								fullWidth: true,
							},
				})}>
							<MailOutlineIcon color="primary" />
						</IconButton>
				{
					row.statusExecution === 0 ? 
					<IconButton aria-label="edit" onClick={() => onCancelReportExecution(row.executionId)}>
						<CloseIcon style={{fill: "red"}}/>
					</IconButton> : null
				}
				</>
					
				}
				</>
			),
		},
		{ label: "Nome do relatório", field: "reportName"},
		{ label: "Filtro", field: "reportFilterName"},
		{ label: "Quantidade de linhas", field: "rows"},
		{ label: "Relatório criado", field: "createdDate", type: "dateHour"},
		{ label: "Finalizado", field: "endExecution", type: "dateHour"},
		{ label: "Solicitante", field: "requesterUserName"},
		{ label: "Status", field: "status"},	
	];

	const rows = useMemo(() => list.map((item) => ({
		...item, 
		status: (nameStatus as any)[item.statusExecution], 
		reportName: reportTypeOptions.find((rt)=> rt.value=== item.reportComponent)?.label
	})), [list, reportTypeOptions])

	return (
		<List
			title={"Listagem de relatórios gerados"}
			columns={columns}
			items={rows}
			loading={loading}
		/>
	);
};

export default ReportConfigurationList;
