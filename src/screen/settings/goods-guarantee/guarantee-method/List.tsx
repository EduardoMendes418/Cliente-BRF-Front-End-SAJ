import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import ScreenTemplate from 'src/components/Screen';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';

import { fetchGuaranteeMethod, editGuaranteeMethod } from 'src/core/store/modules/guarantee-method/thunks';
import {
	getListGuaranteeMethod,
	getLoadingGuaranteeMethod,
	getStatusGuaranteeMethod as getStatus,
	getErrorMessageGuaranteeMethod as getErrorMessage,
	getListFiltersLoadingGuaranteeMethod,
} from 'src/core/store/modules/guarantee-method/selectors';
import { usePagination } from 'src/hooks/pagination';
import { TGuaranteeMethod } from 'src/core/models/guarantee-method';
import { useTranslation } from 'src/locale/i18n';
import { useRegisterDefault } from 'src/hooks';
import { rejectNoValues } from 'src/core/utils/func';

const GuaranteesMethod = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListGuaranteeMethod);
	const loading = useSelector(getLoadingGuaranteeMethod);
	const filters = useSelector(getListFiltersLoadingGuaranteeMethod);

	const { page, pageSize } = usePagination();

	useEffect(
		() => {
			const result = rejectNoValues({ page, pageSize, ...filters })
			dispatch(fetchGuaranteeMethod(result))
		}, [page, pageSize, dispatch, filters]
	);

	useRegisterDefault(({
		action: 'guaranteeMethod',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchGuaranteeMethod({ page, pageSize }))
	}))

	const handleChangeStatus = ({ status, ...row }: TGuaranteeMethod) => {
		if (row.id) dispatch(editGuaranteeMethod({ ...row, status: !status }));
	};

	const columns: ColumnData[] = [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: t('goodsAndGuarantees:guaranteeMethod'), field: 'description' },
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];

	const onEdit = (row: TGuaranteeMethod) => {
		history.push(`/configuracoes/bens-e-garantias/formas-garantia/${row.id}`);
	};

	const punctuation = (item: TGuaranteeMethod) => {
		return Number(item.status) * 1000;
	}

	const rows = useMemo(() =>
		list.slice().sort((x, y) => punctuation(y) - punctuation(x) + x.description.localeCompare(y.description))
		, [list])

	return (
		<ScreenTemplate slotTopRight>
			<Panel title={t('goodsAndGuarantees:guaranteeMethod')}>
				<Table
					onEdit={onEdit}
					columns={columns}
					rows={rows}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</ScreenTemplate>
	);
};

export default GuaranteesMethod;
