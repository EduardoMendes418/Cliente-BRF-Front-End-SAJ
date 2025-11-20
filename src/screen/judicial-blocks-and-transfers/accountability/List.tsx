import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import { useTranslation } from 'src/locale/i18n';
import useProcessFilterOptions from 'src/hooks/useProcessFilterOptions';
import { FormLabel } from '@mui/material';
import { optionsFolderStatus } from "src/screen/settings/constants";

type TList = {
	list: any;
	loading: boolean;
	options?: ReturnType<typeof useProcessFilterOptions>;
}

const List = ({ loading, list }: TList) => {
	
	const { t } = useTranslation();

	const statusTextApprovals = {
		"-1": "Pendente",
		"0": "Reprovado",
		"1": "Aprovado",
		"20": "Não se aplica",
	};

	 const rows = list?.items?.map((item: any) => ({
		...item,
		processStatus: optionsFolderStatus.filter((x) => x.value === item.processStatus)[0].label ?? '-',
		statusContability: (statusTextApprovals as any)[item.statusApprovalId ?? "10"]
	}));

	const columns: ColumnData[] = [
		{
			label: t('dataImport:accountability.form.solicitationNumber'),
			field: 'id',
		},
		{
			label: t('dataImport:accountability.form.blockOrTransfDate'),
			field: 'blockOrTransfDate',
			type: 'date'
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
			label: t('dataImport:accountability.form.dejurArea'),
			field: 'legalDepartmentArea'

		},
		{
			label: t('dataImport:accountability.form.occurrenceTypeDescription'),
			field: 'occurrenceTypeDescription',
		},
		{
			label: t('dataImport:accountability.form.occurrenceReasonDescription'),
			field: 'occurrenceReasonDescription',			
		},
		{
			label: t('dataImport:accountability.form.value'),
			field: 'value',	
			type: 'currency'		
		},
		{
			label: t('dataImport:accountability.form.statusFlowDescription'),
			field: 'statusFlowDescription',	
		},
		{
			label: t('dataImport:accountability.form.processStatus'),
			field: 'statusContability',	
		},
	];

	return (
		<>
			<Panel title={t('dataImport:processSheet.listTitle')}>
			    <FormLabel style={{fontWeight:'bold', display:'flex', margin:'3% 3% 0 1.5%'}}>
			      {t('dataImport:common.itemListCount')} {list !== undefined ? list.itemCount : 0}
				</FormLabel>
				<Table
					rows={rows}
					columns={columns}
					isLoading={loading}
				/>
			</Panel>
		</>
	)
}

export default List;