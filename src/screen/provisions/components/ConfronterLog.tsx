import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import { getLoadingLogProvision } from "src/core/store/modules/log-provision/selectors";
import { getConfrontingOrdersLogList } from "src/core/store/modules/confronting-orders/selectors";
import { fetchConfrontingOrdersByLogs } from "src/core/store/modules/confronting-orders/thunks";
import { usePagination } from "src/hooks/pagination";
import ChangesSubtable from "./ChangesSubtable";
import { TStatusFlowConfronting } from '../utils/constantes';

type Props = {
	folderNumber?: string
}

const useStyles = makeStyles({
	root: {
		'& thead tr th': {
			fontSize: '13px',
			fontWeight: 600,
			color: '#5e5e5e'
		},
	}
})

const ProvisionLog = ({ folderNumber }: Props) => {
	const classes = useStyles()
	const dispatch = useDispatch();
  	const { page, pageSize } = usePagination();

	const list = useSelector(getConfrontingOrdersLogList);
  	const loading = useSelector(getLoadingLogProvision);

	useEffect(() => {
		if (folderNumber)
			dispatch(fetchConfrontingOrdersByLogs({ folderNumber, page, pageSize }))
	}, [dispatch, folderNumber, page, pageSize])

	const columns: ColumnData[] = [
		{ label: 'Responsável', field: 'userName', type: 'string' },
		{ label: 'Data', field: 'occurrenceDate', type: 'date' },
		{ label: 'Hora', field: 'occurrenceDate', type: 'hour' },
		{ label: 'Situação', field: 'statusFlowDescription', type: 'string' },
		{ label: 'Parecer', field: 'observation', type: 'string' },
		{ label: 'Fase', field: 'confrontationalPhase', type: 'string' },
		{ label: 'Nome do Pedido', field: 'orderDescriptionName', type: 'string' },
		{ label: 'Informações dos Pedidos Alterados', field: '', type: 'custom', component: ChangesSubtable },
	];

	const rows = useMemo(() => list.map(log => {
		const status = TStatusFlowConfronting.find((i:any) => i.id === log.statusFlowId);
		const statusLevel = status?.level ?? 0
		const confrontingOrder = log.confrontingOrder!

		const description = status?.t;
		const phase = statusLevel === 1 ? 'Confrontador Primeiro Nível'
			: statusLevel === 2 ? 'Confrontador Segundo Nível' : ''
		let opinion = statusLevel === 1 ? confrontingOrder.opinionLevel1
			: statusLevel === 2 ? confrontingOrder.opinionLevel2 : ''
		if (log.statusFlowId === 7 || log.statusFlowId === 9)
			opinion = log.observation ?? '';


		return {
		...log,
		statusFlowDescription: description,
		opinion,
		confrontationalPhase: phase,
		orderDescriptionName: confrontingOrder.toOrderDescriptionName
		}
	}), [list])

	return (
		<>
			<TableComponent className={classes}
				columns={columns}
				rows={rows}
				isLoading={loading}
			/>
			<Pagination />
		</>
	);
};

export default ProvisionLog;
