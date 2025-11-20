import { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'src/locale/i18n';
import { useHistory } from 'react-router';

import Table, { ColumnData } from 'src/components/Table';
import Panel from 'src/components/Panel';
import Pagination from 'src/components/Pagination';

import {
	getListWatson,
	getStatusWatson,
} from 'src/core/store/modules/watson/selector';
import { deleteWatson } from 'src/core/store/modules/watson/thunks';
import { usePagination } from 'src/hooks/pagination';
import ScreenTemplate from 'src/components/Screen';
import { Button } from 'src/components/button';
import { fetchWatsonList } from 'src/core/store/modules/watson/thunks';
import { actions } from 'src/core/store';
import Parameters from '../components/Parameters'
import { editRawWatson } from 'src/core/store/modules/watson/thunks';
import { modal } from "src/components/modals"
import { fetchWatsonSettings, addWatsonSettings } from 'src/core/store/modules/watson-settings/thunks';
import {
	getListSettingsWatson,
} from 'src/core/store/modules/watson-settings/selector';
import {
	getStatusSettingsWatson,
	getErrorMessageSettingsWatson
} from 'src/core/store/modules/watson-settings/selector';
import { useRegisterDefault } from "src/hooks";
import { TStatus } from "src/core/models";

const List = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch()
	const { page, pageSize } = usePagination()

	const list = useSelector(getListWatson);
	const listParamters = useSelector(getListSettingsWatson);
	const status = useSelector(getStatusSettingsWatson) as TStatus;

	const loading = useSelector(getStatusWatson);

	useRegisterDefault({
		action: 'watsonSettings',
		getStatus: getStatusSettingsWatson,
		getErrorMessage: getErrorMessageSettingsWatson,
		route: 'noRedirect',
		updateInListCallback: () => fetchList()
	});
	useEffect(() => {
		if (["added", "edited", "deleted"].includes(status)){
			dispatch(fetchWatsonSettings())
		}
	}, [status, dispatch])

	const finalList = useMemo(() => {
		return list.map((item:any) => ({
			...item,
			creationDateEnd: item.createdDate,
			isActive: item.statusFilter
		}))
	}, [list])

	const finalListParamters = useMemo(() => {
		return listParamters.map((item:any) => ({
			...item,
			areaDejur: item?.areaDejur?.path ?? "",
			orderDescription: item?.orderDescription?.name ?? "",
			formulaCorrectionRule: item?.formulaCorrectionRule?.formulaName ?? ""
		}))
	}, [listParamters])

	const fetchList = useCallback(() => {
		dispatch(fetchWatsonList({ page, pageSize }))
		dispatch(fetchWatsonSettings())
	}, [dispatch, page, pageSize]);

	useEffect(() => () => dispatch(actions.watson.clear()), [dispatch]);

	useEffect(() => {
		setTimeout(() => fetchList(), 800);
	}, [fetchList]);

	const columns: ColumnData[] = [
		{ label: t('settings:watson.id'), field: 'id' },
		{ label: t('settings:watson.filterName'), field: 'nameFilter' },
		{ label: t('goodsAndGuarantees:depositUpdate.fieldAreaDejur'), field: 'areaDejur' },
		{ label: "Data cadastro filtro", field: 'creationDateEnd', type:"date" },
		{ label: t('settings:watson.user'), field: 'userName' },
		{
			label: t('settings:equalizationParameters.form.status'),
			field: 'isActive',
			type: 'switch-button',
			permission: 'edit',
			onChange: (values) => dispatch(editRawWatson({...values, statusFilter: !values.isActive})),
		},
	];
	const columnsParameters: ColumnData[] = [
		{ label: t('settings:watson.id'), field: 'id' },
		{ label: t('form.legalDepartmentArea'), field: 'areaDejur' },
		{ label: t('provisions:fields.requestDescription'), field: 'orderDescription' },
		{ label: t('provisions:fields.correctionIndex'), field: 'formulaCorrectionRule' },
		{
			label: t('settings:watson.RunningWatsonLoad'),
			field: 'generateWatsonLoad',
			type: "switch-button-yn",
		},
		{
			label: t('settings:equalizationParameters.form.status'),
			field: 'isActive',
			type: 'switch-button',
			permission: 'edit',
			onChange: async (values) => {
				delete values.orderDescription
				delete values.formulaCorrectionRule
				delete values.areaDejur
				await dispatch(addWatsonSettings({...values, isActive: !values.isActive}))
			},
		},
	];

	return (
		<ScreenTemplate
			slotTopRight={<>
				<Button
					onClick={() => modal({
						title: 'Parâmetros data lake Watson',
						component: <Parameters isNew/>,
						buttons: [],
						dialogProps: { maxWidth: "xl", showCloseButton: true, fullWidth: true },
					})}
					text={"Cadastro parâmetros data lake Watson"}
					style={{marginRight: '10px'}}
				/>
				<Button
					onClick={() => history.push(`/configuracoes/geral/watson/novo`)}
					text={t('settings:watson.registerFilter')}
				/>
			</>}
		>
			<Panel title={"Listagem parâmetros data lake Watson"}>
				<Table
					columns={columnsParameters}
					rows={finalListParamters}
					isLoading={status === 'fetching'}
					onEdit={(row: any) => modal({
						title: 'Parâmetros data lake Watson',
						component: <Parameters isNew={false} id={row.id}/>,
						buttons: [],
						dialogProps: { maxWidth: "xl", showCloseButton: true, fullWidth: true },
					})}
				/>
			</Panel>
			<Panel title={t('settings:watson.watsonFilterListing')}>
				<Table
					columns={columns}
					rows={finalList}
					isLoading={loading === 'fetching'}
					onEdit={(row: any) => history.push(`/configuracoes/geral/watson/${row.id}`)}
					onDelete={(row) => dispatch(deleteWatson(row.id))}
				/>
			</Panel>
			<Pagination />
		</ScreenTemplate>
	);
};

export default List;
