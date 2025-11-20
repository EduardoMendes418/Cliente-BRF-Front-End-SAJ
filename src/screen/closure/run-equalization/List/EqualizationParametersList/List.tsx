import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Box, CircularProgress } from '@material-ui/core';

import AccordionPanel from 'src/components/AccordionPanel';
import Table from 'src/components/Table';

import { getListFiltersEqualizationParameters, getStatusEqualizationParameters } from 'src/core/store/modules/equalization-parameters/selectors';
import { runEqualization } from 'src/core/store/modules/equalization-parameters/thunks';
import { TEqualizationParameters } from 'src/core/models/equalization-parameters';
import { useEqualizationParametersTable } from 'src/hooks/equalization';
import useSelectableTable, { TSelectableTable } from 'src/hooks/selectableTable';
import { useTranslation } from 'src/locale/i18n';
import { useCurrentUser } from 'src/config/permissions';
import { useSnackbar } from 'notistack';
import { AppDispatch } from 'src/core/store';

type TEqualizationParametersTable = TEqualizationParameters & TSelectableTable;

const List = ({ pathname }: { pathname: string }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar()

	const { currentScreenPermissions } = useCurrentUser('');

	const { rows, columns } = useEqualizationParametersTable();
	const selectableTable = useSelectableTable<TEqualizationParametersTable>(rows as TEqualizationParametersTable[]);

	const isRunEqualizationButtonDisabled = selectableTable.selectedItems.length === 0;

	const status = useSelector(getStatusEqualizationParameters);
	const equalizationParameterFilters = useSelector(getListFiltersEqualizationParameters);

	const filters = useMemo(() => (equalizationParameterFilters ?? {})[pathname], [pathname, equalizationParameterFilters])

	const handleOnCheckedChange = (id: number) => {
		selectableTable.changeSelectedItems(+id);
	}

	const handleOnCheckedAllChange = () => {
		selectableTable.handleOnSelectAllItems();
	}

	const onRunEqualization = async () => {
		const { type, payload } = await dispatch(runEqualization(selectableTable.selectedItems))
		if (type === "equalizationParameters/runEqualization/rejected") {
			enqueueSnackbar(payload?.detail || t('anErrorHasOcurred'), { variant: 'error' })
		}
	}

	useEffect(() => {
		selectableTable.unselectAllItems();
		
	}, [filters])
	
	return (
		<>
			<AccordionPanel title={t('settings:equalizationParameters.titleList')} noContentMargin startExpanded>
				<Table
					columns={columns}
					rows={selectableTable.items}
					isLoading={status === 'fetching'}
					showCheckboxColumn={currentScreenPermissions.add}
					onCheckedChange={handleOnCheckedChange}
					onCheckedAllChange={handleOnCheckedAllChange}
					isAllItemsSelected={selectableTable.areAllItemsSelected}
					isCheckboxIndeterminate={
						selectableTable.haveAnySelectedItemFromCurrentPage &&
						!selectableTable.areAllItemsSelected}
				/>
			</AccordionPanel>
			{currentScreenPermissions.add && (
				<Box display='flex' justifyContent='flex-end' paddingTop={3}>
					{status === 'saving'
						? <CircularProgress />
						: (
							<Button
								color="primary"
								disabled={isRunEqualizationButtonDisabled}
								variant={isRunEqualizationButtonDisabled ? undefined : "contained"}
								onClick={onRunEqualization}
							>
								{t('runEqualization')}
							</Button>
						)
					}
				</Box>
			)}
		</>
	);
};

export default List;
