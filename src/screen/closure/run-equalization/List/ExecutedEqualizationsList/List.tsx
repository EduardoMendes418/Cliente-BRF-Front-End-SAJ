import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Button, Box, CircularProgress } from '@material-ui/core';

import Table from 'src/components/Table';
import Panel from 'src/components/Panel';
import Pagination from 'src/components/Pagination';

import { useEqualizationTable } from 'src/hooks/equalization';
import useSelectableTable, { TSelectableTable } from 'src/hooks/selectableTable';
import { useTranslation } from 'src/locale/i18n';
import { useCurrentUser } from 'src/config/permissions';
import { getListFiltersEqualization, getLoadingEqualization } from 'src/core/store/modules/equalization/selectors';
import { TEqualization } from 'src/core/models/equalization';

import { useGenerateEqualizationReport } from '../../hooks/useGenerateEqualizationReport';

type TEqualizationTable = TEqualization & TSelectableTable;

const List = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const { currentScreenPermissions } = useCurrentUser('');
	const { generateReport, isGeneratingReport } = useGenerateEqualizationReport();

	const { rows, columns } = useEqualizationTable();
	const selectableTable = useSelectableTable<TEqualizationTable>(rows as TEqualizationTable[]);

	const isExportReportButtonDisabled = selectableTable.selectedItems.length === 0;
	const hasAllowedItems = selectableTable.items.filter(({ notAllowed }) => !notAllowed).length > 0;

	const loading = useSelector(getLoadingEqualization);
	const filters = useSelector(getListFiltersEqualization);

	const handleOnCheckedChange = (id: number) => {
		selectableTable.changeSelectedItems(+id);
	}

	const handleOnCheckedAllChange = () => {
		selectableTable.handleOnSelectAllItems();
	}

	const exportReport = () => {
		generateReport(selectableTable.selectedItems);
	}

	const handleView = (row: any) => {
		history.push(`/fechamento/executar-equalizacao/${row.id}`);
	};

	useEffect(() => {
		selectableTable.unselectAllItems();
		
	}, [filters])

	return (
		<>
			<Panel title={t('closure:runEqualization.titleList')}>
				<Table
					columns={columns}
					rows={selectableTable.items}
					isLoading={loading}
					isPendingProp='notAllowed'
					showCheckboxColumn={currentScreenPermissions.add && hasAllowedItems}
					onCheckedChange={handleOnCheckedChange}
					onCheckedAllChange={handleOnCheckedAllChange}
					isAllItemsSelected={selectableTable.areAllItemsSelected}
					isCheckboxIndeterminate={
						selectableTable.haveAnySelectedItemFromCurrentPage &&
						!selectableTable.areAllItemsSelected}
					onVisualize={handleView}
				/>
			</Panel>
			<Pagination />
			{currentScreenPermissions.add && (
				<Box display='flex' justifyContent='flex-end' paddingTop={3}>
					{ isGeneratingReport
						? <CircularProgress />
						: (
							<Button
								color="primary"
								disabled={isExportReportButtonDisabled}
								variant={isExportReportButtonDisabled ? undefined : "contained"}
								onClick={exportReport}
							>
								{t('closure:runEqualization.list.exportReport')}
							</Button>
						)
					}					
				</Box>
			)}
		</>
	);
};

export default List;
