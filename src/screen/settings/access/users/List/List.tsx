import { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";

import { switchUsers, generateUsersExcel } from "src/core/store/modules/users/thunks";
import {
	getListFiltersUsers,
	getListUsers,
	getLoadingUsers,
} from "src/core/store/modules/users/selectors";
import { TUser } from "src/core/models/users";
import { useTranslation } from "src/locale/i18n";
import { getListProfiles } from "src/core/store/modules/profiles/selectors";
import { useAreasResponsible, useAreasWitchGroups } from "src/hooks/fetchLists";
import {
	getAreaByID,
	getAreaResponsibleByID,
} from "src/core/store/modules/areas/selectors";
import { Button } from "src/components/button";
import { AppDispatch } from "src/core/store";
import { useSnackbar } from "notistack";
import FileSaver from "file-saver";
import { convertToBlob } from "src/core/utils/func";
import { overFlowArrayText } from "src/core/utils/array";

const Users = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch<AppDispatch>();

	useAreasWitchGroups();
	useAreasResponsible();

	const list = useSelector(getListUsers);
	const loading = useSelector(getLoadingUsers);
	const areas = useSelector(getAreaByID);
	const responsibleAreas = useSelector(getAreaResponsibleByID);
	const savedFilters = useSelector(getListFiltersUsers);
	const snackbar = useSnackbar();
	const [isExporting, setIsExporting] = useState<boolean>(false);

	const listProfiles = useSelector(getListProfiles);
	const rows = useMemo(
		() =>
			list.map(({ profileId, ...item }) => ({
				...item,
				profileId,
				profile: item.profileName,
				dejur: overFlowArrayText(item.dejurAreas, 2),
				offices: overFlowArrayText(item.responsibleAreas, 2),
				email: overFlowArrayText(item.emails, 2)
			})),
		[areas, list, listProfiles, responsibleAreas]
	);

	const handleChangeStatus = ({ isActive, ...row }: TUser) => {
		if (row.id) dispatch(switchUsers({ ...row, isActive: !isActive }));
	};

	const exportExcelHandler = useCallback(async () => {
		setIsExporting(true);
		const {payload, type} = await dispatch(generateUsersExcel(savedFilters));

		if(type === 'users/generate-excel/rejected') return snackbar.enqueueSnackbar('Erro ao gerar excel', {variant: 'error'});
		setIsExporting(false);
		return FileSaver.saveAs(convertToBlob(payload), 'usuarios.xlsx');
	}, [dispatch, savedFilters, snackbar]);

	const columns: ColumnData[] = [
		{ label: "ID", field: "id" },
		{
			label: t("settings:users.form.contributorId"),
			field: "contributorId",
		},
		{ label: t("settings:users.name"), field: "name" },
		{ label: t("settings:users.email"), field: "email" },
		{ label: t("settings:users.profile"), field: "profileName" },
		{ label: t("settings:users.form.office"), field: "office" },
		{ label: t("settings:users.form.dejurArea"), field: "dejur" },
		{ label: t("settings:users.office"), field: "offices" },
		{
			label: t("settings:users.lastAccess"),
			field: "lastAccess",
			type: "dateHour",
		},
		{
			label: "Status",
			field: "isActive",
			type: "switch-button",
			onChange: handleChangeStatus,
		},
		{
			label: t("settings:users.createdDate"),
			field: "createdDate",
			type: "dateHour"
		},
		{
			label: t("settings:users.deactivationDate"),
			field: "deactivationDate",
			type: "dateHour"
		}
	];

	const onEdit = ({ id }: TUser) => {
		history.push(`/configuracoes/acessos/usuarios/${id}`);
	};

	return (
		<>
			<Panel
				title={t("settings:users.titleList")}
				slotTopRight={
					<Button
						onClick={exportExcelHandler}
						text={t("settings:users.generateExcelButton")}
						submitting={isExporting}
					/>
				}
				slotTopRightPermission="view"
			>
				<TableComponent
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

export default Users;
