import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { useTranslation } from 'src/locale/i18n';
import { getListSmartSwap, getLoadingFetchingSmartSwap } from 'src/core/store/modules/smart-swap/selectors';
import useProcessFilterOptions from 'src/hooks/useProcessFilterOptions';
import { getOptionsAsObject } from 'src/core/utils/func';
import { processPhasesOptions } from 'src/core/utils/constants';
import { FormLabel } from '@mui/material';
import { usePagination } from 'src/hooks/pagination';

type TListProps = {
	options: ReturnType<typeof useProcessFilterOptions>
}

const List = ({ options }: TListProps) => {
	const { t } = useTranslation();
	const { itemCount } = usePagination();
	const items = useSelector(getListSmartSwap)

	const resultDictionary = useMemo(() => getOptionsAsObject(options.resultsAsOptions), [options.resultsAsOptions]);
	const contingencyTypeDictionary = useMemo(() => getOptionsAsObject(options.contingenciesOptions), [options.contingenciesOptions]);
	const statusDictionary = useMemo(() => getOptionsAsObject(options.statusesOptions), [options.statusesOptions]);
	const phasesDictionary = useMemo(() => getOptionsAsObject(processPhasesOptions), []);
	const actionClassesDictionary = useMemo(() => getOptionsAsObject(options.actionClassesOptions), [options.actionClassesOptions]);
	const provisionClassesDictionary = useMemo(() => getOptionsAsObject(options.provisionClassesOptions), [options.provisionClassesOptions]);
	const closingDictionary = useMemo(() => getOptionsAsObject(options.closingOptions), [options.closingOptions]);
	const sphereDictionary = useMemo(() => getOptionsAsObject(options.spheresOptions), [options.spheresOptions]);

	const rows = items?.map((item) => ({
		...item,
		computedResult: resultDictionary[item.result],
		contType: contingencyTypeDictionary[item.contingency],
		stats: statusDictionary[item.statusId],
		phase: phasesDictionary[item.phasesId],
		actionClss: actionClassesDictionary[item.actionClassId],
		provisionClss: provisionClassesDictionary[item.provisionClass],
		closing: closingDictionary[item.closure],
		sphere: sphereDictionary[item.sphere],
		processVal: item.valuedProcess === null ? '-' : item.valuedProcess ? 'Sim' : 'Não'
	}));

	const loading = useSelector(getLoadingFetchingSmartSwap);

	const columns: ColumnData[] = [
		{
			label: t('dataImport:smartswap.filter.originArea'),
			field: 'originAreaName',
		},
		{
			label: t('dataImport:smartswap.filter.dejurArea'),
			field: 'legalDepartamenteAreaName',
		},
		{
			label: t('dataImport:smartswap.filter.folder'),
			field: 'folderNumber'
		},
		{
			label: t('dataImport:smartswap.list.distributionDate'),
			field: 'distributionDate',
			type: 'date'
		},
		{
			label: t('dataImport:smartswap.list.registrationDate'),
			field: 'creationDate',
			type: 'date'
		},
		{
			label: t('dataImport:smartswap.list.complementRegistrationDate'),
			field: 'registrationComplementDate',
			type: 'date'
		},
		{
			label: t('dataImport:smartswap.list.dischargeDate'),
			field: 'terminationDate',
			type: 'date'
		},
		{
			label: t('dataImport:smartswap.list.closingDate'),
			field: 'closingDate',
			type: 'date'
		},
		{
			label: t('dataImport:smartswap.filter.result'),
			field: 'computedResult',
		},

		{
			label: t('dataImport:smartswap.filter.contigencyType'),
			field: 'contType',
		},
		{
			label: t('dataImport:smartswap.filter.status'),
			field: 'stats',
		},
		{
			label: t('dataImport:smartswap.filter.type'),
			field: 'type',
		},
		{
			label: t('dataImport:smartswap.filter.city'),
			field: 'city',
		},
		{
			label: t('dataImport:smartswap.filter.judicialDistrict'),
			field: 'jurisdictionsName',
		},
		{
			label: t('dataImport:smartswap.filter.location'),
			field: 'locationName',
		},
		{
			label: t('dataImport:smartswap.filter.agent'),
			field: 'agentName',
		},
		{
			label: t('dataImport:smartswap.filter.internalLawyer'),
			field: 'intenalLawerName',
		},
		{
			label: t('dataImport:smartswap.filter.mainResponsible'),
			field: 'legalResponsibleName',
		},
		{
			label: t('dataImport:smartswap.filter.responsibleArea'),
			field: 'responsibleAreaName',
		},
		{
			label: t('dataImport:smartswap.filter.reponsibleAreaResponsible'),
			field: 'responsibleOfficeName',
		},
		{
			label: t('dataImport:smartswap.filter.stage'),
			field: 'phase',
		},
		{
			label: t('dataImport:smartswap.filter.actionClass'),
			field: 'actionClss',
		},
		{
			label: t('dataImport:smartswap.filter.provisionClass'),
			field: 'provisionClss',
		},
		{
			label: t('dataImport:smartswap.filter.closing'),
			field: 'closureName',
		},
		{
			label: t('dataImport:smartswap.filter.costCenter'),
			field: 'costCenter',
		},
		{
			label: t('dataImport:smartswap.filter.sphere'),
			field: 'sphere',
		},
		{
			label: t('dataImport:smartswap.filter.businessArea'),
			field: 'businessAreaName',
		},
		{
			label: t('dataImport:smartswap.filter.category'),
			field: 'categorySpeciesName',
		},
		{
			label: t('dataImport:smartswap.filter.valuedProcess'),
			field: 'processVal',
		},
	];


	return (
		<>
			<Panel title={t('dataImport:smartswap.list.title')}>
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