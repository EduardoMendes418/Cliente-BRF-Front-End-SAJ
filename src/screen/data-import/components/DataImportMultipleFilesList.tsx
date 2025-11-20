import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { useTranslation } from 'src/locale/i18n';

import { usePagination } from 'src/hooks/pagination';
import { FormLabel } from '@mui/material';

type TList = {
	list: any[];
	loading: boolean;

}

const DataImportMultipleFilesList = ({ loading, list }: TList) => {
	const { t } = useTranslation();
	const { itemCount } = usePagination();


	const rows = list.map((item:any) => ({
		...item

	}));

	const columns: ColumnData[] = [
		{
			label: "ID",
			field: "id",
		},
		{
			label: "Área de Origem",
			field: "originAreaName",
		},
		{
			label: "Área DEJUR",
			field: "legalDepartmentAreaName",
		},
		{
			label: "Pasta CTG",
			field: "folderNumber",
		},
		{
			label: "Status Processo",
			field: "statusName",
		},
		{
			label: "N° Processo",
			field: "processNumber",
		},
		{
			label: "Nome da Parte",
			field: "otherPartContactName",
		},
		{
			label: "Data da Solicitação",
			field: "requestDate",
			type: 'date'
		},
		{
			label: "Solicitante",
			field: "createdBy"
		},
		{
			label: "Tipo de Pagamento",
			field: "paymentTypeName",
		},
		{
			label: "Data Avaliação",
			field: "evaluatorDate",
			type: 'date'
		},
		{
			label: "Conta Banco",
			field: "evaluatorAccount",
		},
		{
			label: "Valor",
			field: "creditValue",
			type: 'currency',
		},
		{
			label: "Status do Recebimento",
			field: "statusFlowId",
		},
		{
			label: "Status da Contabilização",
			field: "statusApprovalId",
		},
		{
			label: "Data da Contabilização",
			field: "sapRequestDate"
		}
	];

	return (
		<>
			<Panel title={t('dataImport:processSheet.listTitle')}>
			    <FormLabel style={{fontWeight:'bold', display:'flex', margin:'3% 3% 0 1.5%'}}>
			     Recebimentos de crédito encontrados: {itemCount}
				</FormLabel>
				<Table
					rows={rows}
					columns={columns}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	)
}

export default DataImportMultipleFilesList;