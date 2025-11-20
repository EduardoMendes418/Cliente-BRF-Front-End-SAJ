import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AccordionPanel from "src/components/AccordionPanel";
import Pagination from "src/components/Pagination";
import TableComponent, { ColumnData } from "src/components/Table";

import { getListEqualizationResult, getStatusEqualizationResult } from "src/core/store/modules/equalization-result/selectors";
import { fetchEqualizationResultList } from "src/core/store/modules/equalization-result/thunks";
import { toNegativeCurrency } from "src/core/utils/func";
import { t } from "src/locale/i18n";

const equalizedColumns: ColumnData[] = [
	{ label: t('closure:runEqualization.list.folderCTG'), field: 'folderNumber' },
	{ label: t('closure:runEqualization.list.processNumber'), field: 'processNumber' },
	{ label: t('closure:runEqualization.list.oppositeParty'), field: 'oppositePart' },
	{ label: t('closure:runEqualization.list.dejurArea'), field: 'area' },
	{ label: t('closure:runEqualization.list.costCenter'), field: 'costCenter'},
	{ label: t('closure:runEqualization.list.internalLawyer'), field: 'internalLawyer' },
	{ label: t('closure:runEqualization.list.equalizedValue'), field: 'equalizedValue', noWrap: true },
	{ label: t('closure:runEqualization.list.responsibleLegalLawyer'), field: 'responsible' },
];

const notEqualizedColumns: ColumnData[] = [
	{ label: t('closure:runEqualization.list.folderCTG'), field: 'folderNumber' },
	{ label: t('closure:runEqualization.list.reason'), field: 'reason' }
];

type TEqualizationResultList = {
	equalizationId: number;
	equalization?: boolean;
	areasDEJURAsObject: object;
}

const EqualizationResultList = ({ equalizationId, equalization = false, areasDEJURAsObject }: TEqualizationResultList) => {
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [pageCount, setPageCount] = useState(1);

	const type = equalization ? 'equalized' : 'notEqualized';

	const list = useSelector(getListEqualizationResult);
	const status = useSelector(getStatusEqualizationResult);

	const normalizeItem = useCallback((item) => ({
		...item,
		area: (areasDEJURAsObject as any)[item.areaId],
		equalizedValue: item.equalization ? toNegativeCurrency(item.equalizedValue) : null,
	}), [areasDEJURAsObject])

	const rows = useMemo(() => list[type]?.items?.map(normalizeItem) ?? [], [list, normalizeItem, type])

	const onPageChange = useCallback((page: number) => setPage(page), [])
	const onPageSizeChange = useCallback((pageSize: number) => setPageSize(pageSize), [])

	useEffect(() => {
		if (equalizationId)
			dispatch(fetchEqualizationResultList({ equalizationId, equalization, page, pageSize }))
	}, [dispatch, equalization, equalizationId, page, pageSize])

	useEffect(() => {
		if (list && list[type])
			setPageCount(list[type].pageCount ?? 0)
	}, [list, type, setPageCount])
	
	if (!rows || rows.length <= 0) return null;

	return (
		<>
			<AccordionPanel title={t(`closure:runEqualization.list.${equalization ? 'equalizationReport' : 'notEqualized'}`)} noContentMargin startExpanded>
				<TableComponent
					columns={equalization ? equalizedColumns : notEqualizedColumns}
					rows={rows}
					isLoading={status[type] === 'fetching'}
				/>
			</AccordionPanel>
			<Pagination
				page={page}
				pageSize={pageSize}
				pageCount={pageCount}
				onChangePage={onPageChange}
				onChangePageSize={onPageSizeChange}
			/>
		</>
	)
}

export default EqualizationResultList;