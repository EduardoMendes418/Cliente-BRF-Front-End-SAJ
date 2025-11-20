import { useHistory, useParams } from "react-router-dom";
import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import { Formik} from "formik";
import { Grid } from "@material-ui/core";
import {
	SelectField,
	NumericField,
} from "src/components/form";
import { useTranslation } from "src/locale/i18n";
import { Clean, Submit } from "src/components/button";
import Table, { ColumnData } from 'src/components/Table';
import { useEffect, useMemo, useState } from "react";
import { getWorkerLog } from "src/core/store/modules/background-worker-import/thunks";
import { useDispatch } from "react-redux";
import Pagination from "../../../../components/Pagination";


const RequestListForm = () => {

	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const [pageCurrent, setPageCurrent] = useState(1)
	const [pageCount, setPageCount] = useState(0)
	const [pageSize, setPageSize] = useState(10)
	const [list, setList] = useState<any>();
	const [filter, setFilter] = useState<any>()
	const {
		location: { pathname },
	} = useHistory();
	const statusAsOptions = [
		{label: 'Erro', value: 0},
		{label: 'Sucesso', value: 1}
	]

	const initialValues: any = {
		NumberOfRow: '',
		Status: null,
		id: id
	};

	const getWorkerLogs = async () => {
		const { payload } = ( await dispatch(
			getWorkerLog(initialValues)
		)) as any; 
		setList(payload?.items)
		setPageCount(payload?.pageCount)
	}

	const getWithPagination = async () => {
		const { payload } = ( await dispatch(
			getWorkerLog({NumberOfRow: filter?.NumberOfRow, Status: filter?.Status, id: id, page: pageCurrent, itemsPerPage: pageSize})
		)) as any; 
		setList(payload?.items)
		setPageCount(payload?.pageCount)
	}

	useEffect(() => {
		getWithPagination()
	
	}, [pageCurrent, pageSize])
	
	 useEffect(() => {
		 getWorkerLogs()
	
	}, []) 

	const onSubmit = async (values: any) => {
		const { payload } = ( await dispatch(
			getWorkerLog(values)
		)) as any; 

		setList(payload?.items)
		setPageCount(payload?.pageCount)
	}
	const cleanList = () => {
		getWorkerLogs()
	}

	const columns: ColumnData[] = [
		{ label: t("dataImport:executionMonitor.form.line"), field: 'rowNumber' },
		{ label: t("dataImport:executionMonitor.form.status"), field: 'statusFlowId'},
		{ label: t("dataImport:executionMonitor.form.return"), field: 'observation' },
	];
	
	const rows = useMemo(() => list?.map((item: any) => ({
		...item,
		statusFlowId: item.statusFlowId === 0 ? 'Erro' : "Sucesso",
		rowNumber: item.rowNumber !== 0 ? item.rowNumber : "0"
	})
	), [list]);


	return (
		<ScreenTemplate>
		<Panel title={t("dataImport:executionMonitor.requestTitle")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, values}) => {
					setFilter(values)
					return (
						<form noValidate onSubmit={handleSubmit}>
							<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<NumericField
								name="NumberOfRow"
								label={"Linha"}
								/>
							</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={t("dataImport:executionMonitor.form.status")}
										name="Status"
										options={statusAsOptions}
									/>
								</Grid>
							</Grid>
							<Grid container spacing={2} alignItems="center">
								<Grid item md={6} xs={6}>
									<Clean action="clear" page={pathname} onClick={cleanList} />
								</Grid>
								<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
									<Submit type="search"/>
								</Grid>

							</Grid>
						</form>
					);
				}}
			</Formik>
		</Panel>
		<Panel title={t("dataImport:executionMonitor.listing")}>
			<Table
				columns={columns}
				rows={rows}
			/>
		</Panel>
		<Pagination
		page={pageCurrent}
		pageCount={pageCount}
		pageSize={pageSize}
		onChangePageSize={setPageSize}
		onChangePage={setPageCurrent}
		/>
		</ScreenTemplate>
	)
}

export default RequestListForm;