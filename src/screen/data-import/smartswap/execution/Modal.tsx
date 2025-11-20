import { useState, useCallback, useMemo } from "react";

import { Button } from "src/components/button";
import {
	Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SmartSwapChangesParameters, SmartSwapChangesProcess, SmartSwapChangesResponse, SmartSwapExecution } from "src/core/models/smart-swap-execution";
import Table from 'src/components/Table';
import { useDispatch, useSelector } from "react-redux";
import { reprocessSmartSwap, updateSmartSwap } from "src/core/store/modules/smart-swap/thunks";
import { useTranslation } from 'src/locale/i18n'
import { useSnackbar } from "notistack";
import { getListFiltersSmartSwapExecution, getLoadingSmartSwapExecution, getSmartSwapExecution } from "src/core/store/modules/smart-swap-execution/selectors";
import { fetchsmartSwapExecution } from "src/core/store/modules/smart-swap-execution/thunks";
import { usePagination } from "src/hooks/pagination";
import {  ButtonDiv, ModalMainDiv, TableDiv } from "./styled";

const useStyles = makeStyles((theme: any) => ({
	button: {
		marginLeft: theme.spacing(1),
	},
}));
const Modal = ({ id }: { id: number }) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();
	const list = useSelector(getSmartSwapExecution) as SmartSwapExecution[];
	const loading = useSelector(getLoadingSmartSwapExecution)

	const row = useMemo(() => list.find(item => item.id === id) ?? null, [list, id]);
	const { pageSize, page } = usePagination();
	const filters = useSelector(getListFiltersSmartSwapExecution) as SmartSwapChangesParameters;
	const [checkedItems, setCheckedItems] = useState<number[]>([]);

	const handleNotify = useCallback((notificationType: 'success' | 'error') => {
		enqueueSnackbar(
			t(notificationType === 'success' ? 'successfulOperation' : 'anErrorHasOcurred'),
			{ variant: notificationType }
		)
	}, [enqueueSnackbar, t]);

	const handleCheckboxChange = (id: number) => {
		if (checkedItems.includes(id)) {
			setCheckedItems(checkedItems.filter(id => id !== id));
		} else {
			setCheckedItems([...checkedItems, id]);
		}
	};
	
	const selectAll = (row: SmartSwapExecution | null) => {
		if (!row) return;
		if (checkedItems.length > 0) {
			setCheckedItems([]);
		} else {
			const selectedIds = row.smartSwapChangesProcesses
				? row.smartSwapChangesProcesses
					.filter(item => ![1, 2, 3].includes(item.statusExecution))
					.map(item => item.processId)
				: [];
			setCheckedItems(selectedIds);
		}
	};
	return (<ModalMainDiv>
		<ButtonDiv>
			<Button
				style={{ marginRight: "auto" }}
				className={classes.button}
				onClick={() => selectAll(row)}
				text={checkedItems.length > 0 ? "Desmarcar Todos" : "Selecionar Todos"}
			/>
			<Button
				style={{ marginRight: 10 }}
				onClick={() => dispatch(fetchsmartSwapExecution({ page, pageSize, ...filters }))}
				variant="contained"
				color='primary'
				text="Atualizar Lista"
			/>
			<Button
				className={classes.button}
				onClick={async () => {
					if (!row) return;
					await dispatch(reprocessSmartSwap({ smartSwapId: row.smartSwapId, data: row.smartSwapData, processIds: checkedItems, handleNotify }));
					dispatch(fetchsmartSwapExecution({ page, pageSize, ...filters }))
					setCheckedItems([])

				}}
				text={"Reprocessar erros"}
				disabled={!checkedItems.length}
			/>
		</ButtonDiv>
		<TableDiv>
			<Table
				columns={[
					{
						label: "Selecionar",
						field: "Selecionar",
						type: "custom",
						component: (row: SmartSwapChangesProcess) => {
							if ([1, 2, 3].includes(row.statusExecution)) return null
							return (<Checkbox
								color="primary"
								checked={checkedItems.includes(row.processId)}
								onClick={() => handleCheckboxChange(row.processId)}
							/>)
						}
					},
					{ label: "Id", field: "id" },
					{ label: "Pasta CTG", field: "folderNumber" },
					{ label: "Troca", field: "fromToChangedFields" },
					{ label: "Mensagem", field: "message" },
					{ label: "Inicio da execução", field: "startExecution", type: "dateHour" },
					{ label: "Fim da execução", field: "endExecution", type: "dateHour" },
					{ label: "Status", field: "statusExecutionDescription" },

				]}
				rows={row?.smartSwapChangesProcesses ?? []}
				isLoading={loading}
			/>
		</TableDiv>
	</ModalMainDiv>

	)
}
export default Modal;