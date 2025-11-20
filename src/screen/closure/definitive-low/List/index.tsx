import React, {useMemo} from "react";
import { useSelector } from "react-redux";

import Panel from "src/components/Panel";
import TableComponent, {ColumnData} from "src/components/Table";
import Pagination from "src/components/Pagination";
import {
	FormLabel,
} from '@material-ui/core';
import {
	getList, 
	getLoading,
} from "src/core/store/modules/provision-accounting/selectors";
import {useTranslation} from "src/locale/i18n";
import {getPagination} from 'src/core/store/modules/pagination/selectors';
import {Button} from "../../../../components/button";

type Props = {
	onExportExcel: () => void;
}

const getStatus = (isCompleted: boolean, isError: boolean) => {
	if (isError) return "Erro"
	if (isCompleted) return "Executado"
	return "Fila/executando"
}

const List: React.FC<Props> = (props) => {
	const {t} = useTranslation();
	
	const items = useSelector(getList);
	const loading = useSelector(getLoading);
	const {itemCount, errorsCount} = useSelector(getPagination);
	
	
	const columns: ColumnData[] = [
		
		{label: "ID", field: "id"},
		{label: t("solicitacaoPagamento:pastaCTG"), field: "folderNumber"},
		{label: "Área DEJUR", field: "legalDepartmentArea"},
		{label: "Data execução", field: "createdDate", type: "dateHour"},
		{label: "Solicitante", field: "requesterName"},
		{label: "Mensagem", field: "message"},
		{label: t("status"), field: "status"},
	];
	
	
	const rows = useMemo(
		() =>
			items.map(
				({
					 requester,
					 ...item
				 }: any) => {
					return {
						...item,
						requesterName: requester.name,
						status: getStatus(item.isCompleted, item.isError)
					}
				}
			),
		[items]
	);
	
	return (
		<>
			<Panel title={"Listagem da baixa definitiva"} slotTopRight={
				<Button
					onClick={props.onExportExcel}
					text="Gerar Relatório"
				/>
			} slotTopRightPermission="view">
				<FormLabel style={{fontWeight: 'bold', display: 'flex', margin: '3% 3% 0 1.5%'}}>
					{`Baixas totais encontradas ${itemCount}`}
				</FormLabel>
				<FormLabel style={{fontWeight: 'bold', display: 'flex', margin: '3% 3% 0 1.5%', color: "red"}}>
					{`Erros totais encontrados ${errorsCount}`}
				</FormLabel>
				<TableComponent
					columns={columns}
					rows={rows}
					isLoading={loading}
				/>
			</Panel>
			<Pagination/>
		</>
	);
};

export default List;
