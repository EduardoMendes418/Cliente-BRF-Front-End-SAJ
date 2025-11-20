import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";

import { editProfiles, getProfileReport } from "src/core/store/modules/profiles/thunks";
import {
	getListFiltersProfiles,
	getListProfiles,
	getLoadingProfiles,
} from "src/core/store/modules/profiles/selectors";
import { TProfiles } from "src/core/models/profiles";
import { useTranslation } from "src/locale/i18n";
import { Button } from "src/components/button";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { AppDispatch } from "src/core/store";
import FileSaver from "file-saver";
import { convertToBlob } from "src/core/utils/func";

const Profile = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch<AppDispatch>();
	const snackbar = useSnackbar()

	const list = useSelector(getListProfiles);
	const loading = useSelector(getLoadingProfiles);
	const savedFilters = useSelector(getListFiltersProfiles);

	const handleChangeStatus = ({ status, ...row }: TProfiles) => {
		if (row.id) dispatch(editProfiles({ ...row, status: !status }));
	};

	const columns: ColumnData[] = [
		{ label: t("settings:profiles.profile"), field: "description" },
		{
			label: "Status",
			field: "status",
			type: "switch-button",
			onChange: handleChangeStatus,
		},
	];

	const onEdit = ({ id }: TProfiles) => {
		history.push(`/configuracoes/acessos/perfis/${id}`);
	};

	const exportExcelHandler = useCallback(async () => {
		const {payload, type} = await dispatch(getProfileReport(savedFilters));

		if(type === 'profiles/getReport/rejected') return snackbar.enqueueSnackbar('Erro ao gerar excel', {variant: 'error'});

		return FileSaver.saveAs(convertToBlob(payload), 'Perfis_de_Acesso.xlsx');
	}, [dispatch, savedFilters, snackbar]);


	return (
		<>
			<Panel
				title={t("settings:profiles.titleList")}
				slotTopRight={
					<Button
						onClick={exportExcelHandler}
						text={t("settings:users.generateExcelButton")}
					/>
				}
				slotTopRightPermission="view"
			>
				<TableComponent
					onEdit={onEdit}
					columns={columns}
					isLoading={loading}
					rows={list}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default Profile;
