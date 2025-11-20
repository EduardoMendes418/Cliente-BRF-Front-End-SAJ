import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import TableComponent, { ColumnData } from "src/components/Table";
import { LockSystem } from "src/core/models/lock-system";
import {
	getErrorLockSystem,
	getListLockSystem,
	getStatusLockSystem,
} from "src/core/store/modules/lock-system/selectors";
import {
	editLockSystem,
	fetchLockSystem,
} from "src/core/store/modules/lock-system/thunks";
import { getListProfiles } from "src/core/store/modules/profiles/selectors";
import { fetchProfiles } from "src/core/store/modules/profiles/thunks";
import { useRegisterDefault } from "src/hooks";
import { useTranslation } from "src/locale/i18n";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const LockSystemList = () => {
	const dispatch = useDispatch();
	const lockSystems = useSelector(getListLockSystem);
	const userProfiles = useSelector(getListProfiles);
	const { t } = useTranslation();
	const history = useHistory();

	useRegisterDefault({
		action: "lockSystem",
		getStatus: getStatusLockSystem,
		getErrorMessage: getErrorLockSystem,
		route: "noRedirect",
		updateInListCallback() {
			dispatch(fetchLockSystem());
		},
	});

	useEffect(() => {
		dispatch(fetchLockSystem());
		dispatch(
			fetchProfiles({
				notPaginate: true,
			})
		);
	}, []);

	const onSwitchActive = (row: LockSystem) => {
		dispatch(editLockSystem({ ...row, isActive: !row.isActive }));
	};

	const onEdit = (row: LockSystem) => {
		history.push(`/configuracoes/geral/bloqueio-sistema/${row.id}`);
	};

	const columns = useMemo<ColumnData[]>(
		() => [
			{
				label: t("settings:lockSystem.id"),
				field: "id",
			},
			{
				label: t("settings:lockSystem.userProfiles"),
				field: "userProfiles",
				type: "array",
			},
			{
				label: t("settings:lockSystem.startDate"),
				field: "startDate",
				type: "dateHour",
			},
			{
				label: t("settings:lockSystem.endDate"),
				field: "endDate",
				type: "dateHour",
			},
			{
				label: t("settings:lockSystem.isActive"),
				field: "isActive",
				type: "switch-button",
				onChange: onSwitchActive,
			},
		],
		[]
	);

	const list = useMemo(
		() =>
			lockSystems.map((x) => ({
				...x,
				userProfiles: x.userProfileIds.map(
					(x) => userProfiles.find((y) => y.id == x)?.description
				),
				isEditButtonHidden: !x.isActive
			})),
		[lockSystems, userProfiles]
	);

	return (
		<ScreenTemplate slotTopRight>
			<Panel title={t("settings:lockSystem.listTitle")}>
				<TableComponent columns={columns} rows={list} onEdit={onEdit} />
			</Panel>
		</ScreenTemplate>
	);
};

export default LockSystemList;
