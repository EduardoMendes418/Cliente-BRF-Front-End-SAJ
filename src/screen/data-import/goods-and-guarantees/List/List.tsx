import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Panel from 'src/components/Panel';

import {
	getDataImportList,
	getDataImportStatus
} from 'src/core/store/modules/data-import/selectors';

import { useTranslation } from 'src/locale/i18n';
import { typeFlowText } from 'src/screen/settings/constants'
import { useGuaranteeModality } from 'src/hooks/fetchLists';
import { toCurrency } from 'src/core/utils/func';
import { statusTextInsurance } from 'src/screen/goods-and-guarantees/constants';
import { optionsFolderText } from 'src/screen/settings/constants';

const GoodsGuarantees = () => {
	const { t } = useTranslation();

	const list = useSelector(getDataImportList);
	const loading = useSelector(getDataImportStatus);

	const { guaranteeModalityTypeFlowAsObject } = useGuaranteeModality();

	const rows = useMemo(() => list.map(({
		statusId,
		guaranteeModeId,
		goodsGuaranteesRequestStatus,
		processNumber,
		oldNumber,
		goodLocation,
		guaranteeTypeId,
		...item
	}) => {
		const typeFlow = guaranteeModalityTypeFlowAsObject[guaranteeModeId] ?? '';

		return ({
			...item,
			goodLocation: goodLocation || undefined,
			guaranteeMode: typeFlowText[typeFlow],
			processNumber: processNumber || oldNumber || '-',
			valueGuarantee: toCurrency(item.valueGuarantee),
			accountingBalance: toCurrency(item.accountingBalance),
			legalBalance: toCurrency(item.legalBalance),
			goodsGuaranteesRequest: (statusTextInsurance as any)[goodsGuaranteesRequestStatus],
			statusId: optionsFolderText[statusId]
		})
	}), [list, guaranteeModalityTypeFlowAsObject]);

	const columns: ColumnData[] = [
		{ label: t('dataImport:goodsAndGuarantees.form.id'), field: 'id' },
		{ label: t('dataImport:goodsAndGuarantees.form.originArea'), field: 'originArea' },
		{ label: t('dataImport:goodsAndGuarantees.form.legalDepartmentArea'), field: 'legalDepartmentArea' },
		{ label: t('dataImport:goodsAndGuarantees.form.folderNumber'), field: 'folderNumber' },
		{ label: t('dataImport:goodsAndGuarantees.form.oppositeParty'), field: 'oppositeParty', noWrap: true },
		{ label: t('dataImport:goodsAndGuarantees.form.processNumber'), field: 'processNumber', noWrap: true},
		{ label: t('dataImport:goodsAndGuarantees.form.statusId'), field: 'statusId' },
		{ label: t('dataImport:goodsAndGuarantees.form.guaranteeModeId'), field: 'guaranteesModalitiesDescription', noWrap: true},
		{ label: t('goodsAndGuarantees:form.guaranteeType'), field: 'guaranteeType', noWrap: true},
		{
			label: t('dataImport:goodsAndGuarantees.form.guaranteeDate'),
			field: 'guaranteeDate',
			type: 'date',
		},
		{ label: t('dataImport:goodsAndGuarantees.form.goodStatus'), field: 'statusBemDescription' },
		{ label: t('dataImport:goodsAndGuarantees.form.goodsGuaranteesRequestStatus'), field: 'goodsGuaranteesRequest', noWrap: true },
		{ label: t('dataImport:goodsAndGuarantees.search.valueGuarantee'), field: 'valueGuarantee' },
		{ label: t('goodsAndGuarantees:management.accountingBalance'), field: 'accountingBalance' },
		{ label: t('goodsAndGuarantees:management.legalBalance'), field: 'legalBalance' },
		{ label: t('goodsAndGuarantees:depositUpdate.fieldBank'), field: 'bankName', noWrap: true},
		{ label: t('goodsAndGuarantees:tasks.insuranceCompany'), field: 'insuranceCompany'}
	];

	return (
		<Panel title={t('dataImport:goodsAndGuarantees.form.title')}>
			<Table
				columns={columns}
				rows={rows}
				isLoading={loading === 'fetching'}
			/>
		</Panel>
	);
};

export default GoodsGuarantees;
