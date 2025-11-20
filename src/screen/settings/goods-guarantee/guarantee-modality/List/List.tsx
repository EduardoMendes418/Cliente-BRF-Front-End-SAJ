import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import Panel from 'src/components/Panel';

import { fetchGuaranteeModality, editGuaranteeModality } from 'src/core/store/modules/guarantee-modality/thunks';
import {
	getListGuaranteeModality,
	getLoadingGuaranteeModality,
	getStatusGuaranteeModality as getStatus,
	getErrorMessageGuaranteeModality as getErrorMessage,
	getListFiltersGuaranteeModality,
} from 'src/core/store/modules/guarantee-modality/selectors';
import { usePagination } from 'src/hooks/pagination';
import { TGuaranteeModality } from 'src/core/models/guarantee-modality';
import { useTranslation } from 'src/locale/i18n';
import { useRegisterDefault } from 'src/hooks';
import { useGuaranteeMethod } from 'src/hooks/fetchLists';

const GuaranteesModality = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListGuaranteeModality);
	const loading = useSelector(getLoadingGuaranteeModality);
	const filters = useSelector(getListFiltersGuaranteeModality);

	const { page, pageSize } = usePagination();
	const { guaranteeMethod } = useGuaranteeMethod()

	useRegisterDefault({
		action: 'guaranteeModality',
		getStatus,
		getErrorMessage,
		route: '',
		updateInListCallback: () => dispatch(fetchGuaranteeModality({ page, pageSize, ...filters, notPaginate: true }))
	})

	useEffect(() => {
		dispatch(fetchGuaranteeModality({ page, pageSize, ...filters, notPaginate: true }))
	}, [page, pageSize, dispatch, filters]);

	const punctuation = (item: TGuaranteeModality) => {
		return Number(item.status) * 1000;
	}

	const rows = useMemo(() => list.map(item => ({
		...item,
		guaranteeMethods: item.guaranteeMethodIds
			.map(methodId => guaranteeMethod.find(({ id }) => id === methodId)?.description)
	})).sort((x, y) => punctuation(y) - punctuation(x) + x.description.localeCompare(y.description))
		, [list, guaranteeMethod])


	const handleChangeStatus = ({ status, ...row }: TGuaranteeModality) => {
		if (row.id) dispatch(editGuaranteeModality({ ...row, status: !status }));
	};

	const columns: ColumnData[] = [
		{ label: t('goodsAndGuarantees:id'), field: 'id' },
		{ label: t('goodsAndGuarantees:guaranteeModality'), field: 'description' },
		{ label: t('goodsAndGuarantees:guaranteeMethod'), field: 'guaranteeMethods', type: 'array' },
		{ label: t('Pagamentos:tipoPagamentoForm.processType'), field: 'processType' },
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];

	const onEdit = (row: TGuaranteeModality) => {
		history.push(`/configuracoes/bens-e-garantias/modalidade-garantia/${row.id}`);
	};

	return (
		<>
			<Panel title={t('goodsAndGuarantees:guaranteeModality')}>
				<Table
					onEdit={onEdit}
					columns={columns}
					rows={rows}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default GuaranteesModality;
