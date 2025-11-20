import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import { useTranslation } from 'src/locale/i18n';
import { FormLabel } from '@mui/material';
import { optionsFolderStatus } from "src/screen/settings/constants";
import { situationStatusOptions, accountabilityStatusOptions } from 'src/screen/goods-and-guarantees/accountability/constants';
import { TableContex } from "src/components/TableContext";
import { useContext } from "react";

const List = () => {
	const { t } = useTranslation();

	const {
		list,
		isLoading,
		pageItensCount
	} = useContext(TableContex);

	const rows = list?.map((item: any) => ({
		...item,
		processStatus: optionsFolderStatus.filter((x) => x.value === item.processStatus)[0].label ?? '-',
		status: situationStatusOptions.filter((x) => x.value === item.status)[0].label ?? '-',
		statusFlowId: accountabilityStatusOptions.filter((x) => x.value === item.statusFlowId)[0].label ?? '-'

	}));

	const columns: ColumnData[] = [
		{
			label: "Id",
			field: 'id',
		},
		{
			label: t('dataImport:accountability.form.dejurArea'),
			field: 'legalDepartmentArea',
		},
		{
			label: t('dataImport:accountability.form.ctgFolder'),
			field: 'folderNumber',
		},
		{
			label: t('dataImport:accountability.form.ctgFolderStatus'),
			field: 'processStatus',
		},
		{
			label: t('dataImport:accountability.form.status'),
			field: 'statusGuaranteeDescription',
		},
		{
			label: t('dataImport:accountability.form.guaranteeDate'),
			field: 'guaranteeDate',
			type: 'date'
		},
		{
			label: "Data da prestação de contas",
			field: 'accountabilityDate',
			type: 'date'
		},
		{
			label: t('dataImport:accountability.form.guaranteeModality'),
			field: 'guaranteeModeDescription',
		},
		{
			label: t('dataImport:accountability.form.requestType'),
			field: 'requestTypeDescription',			
		},
		{
			label: t('dataImport:accountability.form.dischargeReason'),
			field: 'bearishReasonsDescription',			
		},
		{
			label: t('dataImport:accountability.form.totalAmountWrittenOff'),
			field: 'totalAmountWrittenOff',
			type: 'currency'			
		},
		{
			label: t('dataImport:accountability.form.situation'),
			field: 'status',	
		},
		{
			label: t('dataImport:accountability.form.accountabilityStatus'),
			field: 'statusFlowId',	
		},
		{
			label: t('dataImport:accountability.form.valuationDate'),
			field: 'valuationDate',
			type: 'date'
		},
	];

	return (
		<>
			<Panel title={t('dataImport:processSheet.listTitle')}>
			    <FormLabel style={{fontWeight:'bold', display:'flex', margin:'3% 3% 0 1.5%'}}>
				  {`${t('dataImport:common.itemListCount')} ${pageItensCount}`}
				</FormLabel>
				<Table
					rows={rows}
					columns={columns}
					isLoading={isLoading}
				/>
			</Panel>
		</>
	)
}

export default List;