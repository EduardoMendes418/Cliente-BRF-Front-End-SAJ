import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import List from "src/components/List";
import { useTranslation } from "src/locale/i18n";

import { usePagination } from "src/hooks/pagination";
import { AppDispatch } from "src/core/store";
import { getSmartSwapExecution, getLoadingSmartSwapExecution, getListFiltersSmartSwapExecution } from "src/core/store/modules/smart-swap-execution/selectors";
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { fetchsmartSwapExecution, fetstatusExecutionSmartSwap, fetstatusstatusProcessSmartSwap } from "src/core/store/modules/smart-swap-execution/thunks";
import { SmartSwapChangesParameters,  SmartSwapExecution } from "src/core/models/smart-swap-execution";
import { modal } from "src/components/modals";
import { ColumnData } from 'src/components/Table';
import { useSnackbar } from "notistack";
import FileSaver from "file-saver";
import { exportSmartSwap } from "src/core/store/modules/smart-swap/thunks";
import GetApp from "@material-ui/icons/GetApp";
import Modal from "./Modal";


const ReportConfigurationList = () => {
	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch<AppDispatch>();
	const list = useSelector(getSmartSwapExecution) as SmartSwapExecution[];
	const filters = useSelector(getListFiltersSmartSwapExecution) as SmartSwapChangesParameters;
	const loading = useSelector(getLoadingSmartSwapExecution)
	const { page, pageSize } = usePagination();

	useEffect(() => {
		dispatch(fetstatusExecutionSmartSwap())
		dispatch(fetstatusstatusProcessSmartSwap())
	}, [])

	const handleNotify = useCallback((notificationType: 'success' | 'error') => {
		enqueueSnackbar(
			t(notificationType === 'success' ? 'successfulOperation' : 'anErrorHasOcurred'),
			{ variant: notificationType }
		)
	}, [enqueueSnackbar, t]);

	useEffect(() => {
		dispatch(fetchsmartSwapExecution({ page, pageSize, ...filters }))
	}, [page, pageSize, dispatch, filters])

	const columns: ColumnData[] = [
		{
			label: t("reports:actions"),
			field: "actions",
			type: "custom",
			component: (row: SmartSwapExecution) => {

				return (
					<>
						<IconButton onClick={() => {
							modal({
								title: 'Pastas executadas',
								component: <Modal id={row.id} />,
								buttons: [],
								dialogProps: { maxWidth: 'xl', showCloseButton: true, fullWidth: true },
							})
						}}>
							<VisibilityIcon color="primary" />
						</IconButton>
					</>
				);
			},
		},
		{
			label: "Exportar",
			field: "actions",
			type: "custom",
			component: (row: SmartSwapExecution) => {
				return (
					<>
						<IconButton onClick={async () => {
							const { payload, type } = await dispatch(exportSmartSwap({ smartSwapId: row.smartSwapId, handleNotify }));
							if (type === 'smartSwap/export-excel/rejected') return;
							FileSaver.saveAs(payload as Blob, `troca_inteligente.xlsx`)
						}}>
							<GetApp color="primary" />
						</IconButton>
					</>
				);
			},
		},
		{ label: "Id", field: "id" },
		{ label: "Data solicitação", field: "startExecution", type: "dateHour" },
		{ label: "Nome solicitante", field: "requesterUserName" },
		{ label: "Quantidade de linhas", field: "rows" },
		{ label: "Data da execução", field: "endExecution", type: "dateHour" },
		{ label: "Status", field: "statusExecutionDescription" },

	];

	const rows = useMemo(() => list.map((item) => ({
		...item,
	})), [list])
	return (
		<List
			title={"Listagem da execução"}
			columns={columns}
			items={rows}
			loading={loading}
		/>
	);
};

export default ReportConfigurationList;
