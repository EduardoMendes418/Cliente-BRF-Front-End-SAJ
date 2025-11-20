import { useMemo } from 'react';
import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { useTranslation } from 'src/locale/i18n';
import { getOptionsAsObject } from 'src/core/utils/func';
import useProcessFilterOptions from 'src/hooks/useProcessFilterOptions';
import { usePagination } from 'src/hooks/pagination';
import { FormLabel } from '@mui/material';

type TList = {
	list: any[];
	loading: boolean;
	options: ReturnType<typeof useProcessFilterOptions>;
}

const List = ({ loading, list, options }: TList) => {
	const { t } = useTranslation();
	const { itemCount } = usePagination();

	const {
		statusDictionary,
		areasResponsibleDictionary,
		actionClassesDictionary,
		natureDictionary
	} = useMemo(() => {
		const {
			areasDEJUROptions,
			statusesOptions,
			areasResponsibleOptions,
			actionClassesOptions,
			natureOptions
		} = options;

		return {
			areaDictionary: getOptionsAsObject(areasDEJUROptions),
			statusDictionary: getOptionsAsObject(statusesOptions),
			areasResponsibleDictionary: getOptionsAsObject(areasResponsibleOptions),
			actionClassesDictionary: getOptionsAsObject(actionClassesOptions),
			natureDictionary: getOptionsAsObject(natureOptions)
		};
	}, [options])

	const rows = list.map((item) => ({
		...item,
		status: statusDictionary[item.statusId],
		responsibleArea: areasResponsibleDictionary[item.responsibleAreaId],
		actionClassTypeName: actionClassesDictionary[item.actionTypeId],
		natureName: natureDictionary[item.natureId]
	}));

	const columns: ColumnData[] = [
		{
			label: t('dataImport:processSheet.form.ctgFolder'),
			field: 'folderNumber',
		},
		{
			label: t('dataImport:processSheet.form.originArea'),
			field: 'originAreaName',
		},
		{
			label: t('dataImport:processSheet.form.dejurArea'),
			field: 'legalDepartmentAreaName',
		},
		{
			label: t('dataImport:processSheet.form.company'),
			field: 'companyName',
		},
		{
			label: t('dataImport:processSheet.form.judgmentDateList'),
			field: 'distributionDate',
			type: 'date',
		},
		{
			label: t('dataImport:processSheet.form.compDateList'),
			field: 'registrationCompletionDate',
			type: 'date',
		},
		{
			label: t('dataImport:processSheet.form.dischargeDateList'),
			field: 'terminationDate',
			type: 'date',
		},
		{
			label: t('dataImport:processSheet.form.closingDateList'),
			field: 'closingDate',
			type: 'date',
		},
		{
			label: t('dataImport:processSheet.form.contingencyType'),
			field: 'contingency',
		},
		{
			label: t('dataImport:processSheet.form.status'),
			field: 'status',
		},
		{
			label: t('dataImport:processSheet.form.type'),
			field: 'type',
		},
		{
			label: t('dataImport:processSheet.form.agent'),
			field: 'agentName',
		},
		{
			label: t('dataImport:processSheet.form.inhouseLawyer'),
			field: 'internalLawyerName',
		},
		{
			label: t('dataImport:processSheet.form.legalResponsible'),
			field: 'legalResponsibleName',
		},
		{
			label: t('dataImport:processSheet.form.lawFirm'),
			field: 'responsibleArea',
		},
		{
			label: t('dataImport:processSheet.form.lawFirmResponsible'),
			field: 'responsibleOfficeName',
		},
		{
			label: t('dataImport:processSheet.form.actionClass'),
			field: 'actionClassTypeName',
		},
		{
			label: t('dataImport:processSheet.form.sphere'),
			field: 'sphere',
		},
		{
			label: t('dataImport:processSheet.form.closing'),
			field: 'closure',
		},
		{
			label: t('dataImport:processSheet.form.nature'),
			field: 'natureName',
		},
		{
			label: t('dataImport:processSheet.form.provisionClass'),
			field: 'provisionClass',
		},
		{
			label: t('dataImport:processSheet.form.result'),
			field: 'result',
		},
		{
			label: t('dataImport:processSheet.form.location'),
			field: 'location',
		}
	];

	return (
		<>
			<Panel title={t('dataImport:processSheet.listTitle')}>
			    <FormLabel style={{fontWeight:'bold', display:'flex', margin:'3% 3% 0 1.5%'}}>
			      {t('dataImport:common.itemListCount')} {itemCount}
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

export default List;