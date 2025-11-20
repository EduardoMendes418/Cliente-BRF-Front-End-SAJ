import { useMemo } from "react";
import { useSelector } from 'react-redux';
import Table, { ColumnData } from 'src/components/Table';
import { useTranslation } from 'src/locale/i18n';
import { useDispatch } from 'react-redux';
import { editHierarchy } from 'src/core/store/modules/hierarchy/thunks';
import { THierarchy } from 'src/core/models/hierarchy';
import {
    getHierarchyList,
    getHierarchyIsFetching,
    getHierarchyFilter,
} from 'src/core/store/modules/hierarchy/selectors';
import { useEffect } from 'react';
import { fetchHierarchy } from 'src/core/store/modules/hierarchy/thunks';
import { usePagination } from 'src/hooks/pagination'
import { getListAreasDEJUR } from 'src/core/store/modules/areas/selectors';
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

const List = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch<any>()
    const { enqueueSnackbar } = useSnackbar();
    
    const list = useSelector(getHierarchyList);
	const areas = useSelector(getListAreasDEJUR);
    const history = useHistory();

    const isFetching = useSelector(getHierarchyIsFetching);

    const filter = useSelector(getHierarchyFilter);
    const { page, pageSize } = usePagination();

    const row = useMemo(() => {
        return list.map((item: THierarchy) => ({...item, area: areas.find(area => area.id === item.areaId)?.path}))
    }, [list, areas]);

    const handleChangeStatus = async ({ status, ...row }: any) => {
            if(row.id){ 
                
                const { type } = await dispatch(editHierarchy({ ...row, status: !status })) as any;

                if(type === 'hierarchy/edit/fulfilled'){
                    return enqueueSnackbar("Status alterado com sucesso.", {
                        variant: "success",
                    });
                } else {
                    return enqueueSnackbar("Ocorreu um erro.", {
                        variant: "error",
                    });
                }
            }
        };
    
    const columns: ColumnData[] = [
        { label: t('approversRegistration:approverID'), field: 'approver' },
        {
            label: t('approversRegistration:approverName'),
            field: 'approverName',
        },
        { label: t('approversRegistration:hierarchy'), field: 'hierarchy' },
        {
			label: t('settings:equalizationParameters.form.status'),
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		}, 
    ];

	useEffect(() => {
		dispatch(fetchHierarchy({ page, pageSize}))
	  }, [dispatch, page, pageSize])

    useEffect(() => {
      dispatch(fetchHierarchy({...filter, page, pageSize}))
    }, [dispatch, filter, pageSize, page])

    const onEdit = (row: THierarchy) => {
            history.push(`/configuracoes/geral/cadastro-aprovadores/${row.id}`);
        };

    return (
        <Table
			onEdit={onEdit}
            isLoading={isFetching}
            columns={columns}
            rows={row}
        />
    );
};

export default List;
