import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import { useTranslation } from "src/locale/i18n";

import { getListHelpFiles, getLoadingHelpFiles } from "src/core/store/modules/HelpFiles/selectors";
import { editHelpFiles } from "src/core/store/modules/HelpFiles/thunks";


const List = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListHelpFiles);
	const loading = useSelector(getLoadingHelpFiles);

	const rows = useMemo(
		() =>
			list,
		[list]
	);

	const onEdit = ({ id }: any) => {
		history.push(`/configuracoes/geral/ajuda/${id}`);
	};

	const handleChangeStatus = ({
		status,
		...row
	}: any & { id: number;}) => {
		if (row.id)
			dispatch(editHelpFiles({ ...row, isActive: !row.isActive }));
	};

	const columns: ColumnData[] = [
		{
			label: t("settings:evaluationReason.form.id"),
			field: "id",
		},
		{
			label: t("settings:helpFiles.form.documentName"),
			field: "documentName",
		},
		{
			label: t("settings:helpFiles.form.keywords"),
			field: "keyWords"
		},
		{
			label: t("settings:evaluationReason.form.status"),
			field: "isActive",
			type: "switch-button",
			onChange: handleChangeStatus,
		},
	];

	return (
		<>
			<Panel title={"Listagem da gestão de conhecimento"}>
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

export default List;
