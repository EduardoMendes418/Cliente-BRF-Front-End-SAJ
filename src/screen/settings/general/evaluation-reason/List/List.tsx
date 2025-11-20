import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import { useTranslation } from "src/locale/i18n";

import {
	getListRejectionAndReturnReason,
	getLoadingRejectionAndReturnReason,
} from "src/core/store/modules/rejection-and-return-reason/selectors";
import { TRejectionAndReturnReason } from "src/core/models/rejection-and-return-reason";
import { editRejectionAndReturnReason } from "src/core/store/modules/rejection-and-return-reason/thunks";

import { reasonTypeOptionsAsObject } from "../constants";
import { useModulos } from "src/hooks/modulo";

type TList = TRejectionAndReturnReason & {
	reasonTypeText: string;
	modulo: string;
};

const List = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();

	const list = useSelector(getListRejectionAndReturnReason);
	const loading = useSelector(getLoadingRejectionAndReturnReason);
	const { modulos } = useModulos();

	const punctuation = (item: boolean) => {
		return Number(item) * 1000;
	};

	const rows = useMemo(
		() =>
			list
				.map<TList>((item) => ({
					...item,
					reasonTypeText: reasonTypeOptionsAsObject[item.reasonType] ?? "",
					modulo: modulos.find((x) => x.id === item.moduloId)?.descricao ?? "",
				}))
				.sort((x, y) => {
					return (
						punctuation(y.status) -
						punctuation(x.status) +
						x.reasonTypeText.localeCompare(y.reasonTypeText) * 500 +
						x.description.localeCompare(y.description) * 100 +
						x.modulo.localeCompare(y.description) * 50
					);
				}),
		[list, modulos]
	);

	const onEdit = ({ id }: TRejectionAndReturnReason) => {
		history.push(`/configuracoes/geral/motivo-avaliacao/${id}`);
	};

	const handleChangeStatus = ({
		status,
		reasonTypeText,
		...row
	}: TRejectionAndReturnReason & { id: number; reasonTypeText: string }) => {
		if (row.id)
			dispatch(editRejectionAndReturnReason({ ...row, status: !status }));
	};

	const columns: ColumnData[] = [
		{
			label: t("settings:evaluationReason.form.id"),
			field: "id",
		},
		{
			label: t("settings:evaluationReason.form.modulo"),
			field: "modulo",
		},
		{
			label: t("settings:evaluationReason.form.reasonType"),
			field: "reasonTypeText",
		},
		{
			label: t("settings:evaluationReason.form.description"),
			field: "description",
		},
		{
			label: t("settings:evaluationReason.form.status"),
			field: "status",
			type: "switch-button",
			onChange: handleChangeStatus,
		},
	];

	return (
		<>
			<Panel title={t("settings:evaluationReason.titleList")}>
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
