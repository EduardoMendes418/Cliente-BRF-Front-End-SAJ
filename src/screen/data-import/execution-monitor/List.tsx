import { MutableRefObject, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Panel from 'src/components/Panel';

import {
	getDataImportStatus
} from 'src/core/store/modules/data-import/selectors';

import { useTranslation } from 'src/locale/i18n';
import { useHistory } from 'react-router-dom';
import { moduleToProcessAsOptions, statusAsOptions } from './options';
import { confirm } from 'src/components/modals';
import { deleteBackgroundWorkerImport, getBackgroundWorkerImport } from "src/core/store/modules/background-worker-import/thunks";
import { useSnackbar } from 'notistack';
import { Submit } from "src/components/button";

const ExecutionMonitorList = ({ pathname, data, formRef, setRequest, setData, setPageCount }: { pathname: string, data: any, formRef: MutableRefObject<any>, setRequest: any, setData: any, setPageCount: any }) => {
	const { t } = useTranslation();

	const loading = useSelector(getDataImportStatus);
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const history = useHistory();

	const rows = useMemo(() => data?.map(({
		...item
	}) => {
		return ({
			...item,
			moduleToProcess: moduleToProcessAsOptions.filter((x) => x.value === item?.moduleToProcess)[0]?.label,
			status: statusAsOptions.filter((x) => x.value === item?.status)[0]?.label
			,
			rowsLeftProcess: item.rowsLeftProcess !== 0 ? item.rowsLeftProcess : "0"
		})
	}), [data]);

	const columns: ColumnData[] = [
		{ label: t("dataImport:executionMonitor.form.moduleToProcess"), field: 'moduleToProcess' },
		{ label: t("dataImport:executionMonitor.form.fileName"), field: 'fileName' },
		{ label: t("dataImport:executionMonitor.form.hourAndDate"), field: 'createdDate', type: 'dateHour' },
		{ label: t("dataImport:executionMonitor.form.hourAndDateStart"), field: 'processDate', type: 'dateHour' },
		{ label: t("dataImport:executionMonitor.form.linesTotal"), field: 'rowsCount'},
		{ label: t("dataImport:executionMonitor.form.linesTotalRemaining"), field: 'rowsLeftProcess'},
		{ label: t("dataImport:executionMonitor.form.hourAndDateEnd"), field: 'conclusionDate', type: 'dateHour' },
		{ label: t("dataImport:executionMonitor.form.responsible"), field: 'createdBy'},
		{ label: t("dataImport:executionMonitor.form.status"), field: 'status'},		
	];

	const handleView = (row: any) => {
		history.push(`${pathname}/${row.id}`);
	};

	const deleteWorkerImport = async (row: any) => {
		const isConfirmed = await confirm('Todas as linhas já processadas serão mantidas, apenas as ainda não processadas serão canceladas. Deseja continuar?', 'Atenção:')
		if(isConfirmed){
		const { payload } = (await dispatch(deleteBackgroundWorkerImport(row.id))) as any;
		
		if(payload.status === 200){
			setRequest(formRef?.current?.initialValues)
			return enqueueSnackbar("Linhas excluidas com sucesso!", {
				variant: "success",
			});
		}}
	}

	const refreshList = async () => {
		const { payload } = await dispatch(getBackgroundWorkerImport({...formRef.current?.values, page: 1, pageSize: 10})) as any
		setData(payload?.items)
		setPageCount(payload?.pageCount)
	}

	return (
		<Panel title={t("dataImport:executionMonitor.listTitle")}  
				slotTopRight={ 
					<Submit
						click={refreshList}
						text='Atualizar a Lista'
		  />}
		  slotTopRightPermission={'view'}
		  >
			<Table
				columns={columns}
				rows={rows}
				isLoading={loading === 'fetching'}
				onVisualize={handleView}
				onDelete={deleteWorkerImport}
			/>
		</Panel>
	);
};

export default ExecutionMonitorList;
