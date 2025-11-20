import { useMemo } from "react";
import { useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";

import {
	getListRequestLog,
	getLoadingRequestLog,
} from "src/core/store/modules/request-log/selector";
import moment from "moment";
import { DataDiv, RowDiv } from "./styled";

const RequestParameters = () => {

	const list = useSelector(getListRequestLog);
	const loading = useSelector(getLoadingRequestLog);

	const rows = useMemo(
		() =>
			list.map((item) => {
				return {
					...item,
				};
			}),
		[list]
	);

	const columns: ColumnData[] = [
		{ label: "Nome do usuário", field: "userName",
		   component: (row: any) =>
		   <RowDiv> {row.userName} </RowDiv>,
		   type: "custom",
	   },
		{
			label: "Data",
			field: "occurrenceDate",
			component: (row: any) =>
			<DataDiv> {moment(row.occurrenceDate).format('DD/MM/YYYY HH:mm:ss')}</DataDiv>,
			type: "custom",
		},
		{ label: "Parametro", field: "changeIdentifier" },
		{ label: "Observação", field: "observation" },
	];

	return (
		<>
			<Panel title={"Logs"}>
				<TableComponent columns={columns} rows={rows} isLoading={loading} />
			</Panel>
			<Pagination />
		</>
	);
};

export default RequestParameters;
