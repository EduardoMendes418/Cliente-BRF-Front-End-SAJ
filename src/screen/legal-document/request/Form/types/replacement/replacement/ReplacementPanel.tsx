import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Panel from "src/components/Panel";
import { LegalDocumentPrepositionReplacementParties, LegalDocumentPrepositionReplacementPartyEnum } from "src/core/models/legal-document-request";
import { getReplacementParties } from "src/core/store/modules/legal-document-request/selectors";
import { useTranslation } from "src/locale/i18n";
import ReplacementForm from "./ReplacementForm";
import ReplacementTable from "./ReplacementTable";

export type ReplacementPanelHandler = {
	getList: () => LegalDocumentPrepositionReplacementParties[]
}

const ReplacementPanelComponent: ForwardRefRenderFunction<ReplacementPanelHandler, {}> = (props, ref) => {
	const { t } = useTranslation();
	const [list, setList] = useState<LegalDocumentPrepositionReplacementParties[]>([])
	const [data, setData] = useState<LegalDocumentPrepositionReplacementParties | undefined>()
	const { id } = useParams<{ id: string }>()
	const isNew = id === "novo"
	const item = useSelector(getReplacementParties)

	useImperativeHandle(ref, () => ({
		getList: () => list
	}), [list])

	useEffect(() => {
		if (!isNew && item) {
			setList(item.filter(x => x.partyType === LegalDocumentPrepositionReplacementPartyEnum.Replacements) ?? [])
		}
	}, [isNew, item])

	const onAdd = (values: LegalDocumentPrepositionReplacementParties) => {
		setList(list.concat(values))
		setData(undefined)
	}

	const onEdit = (index: number) => {
		const values = list[index]
		setList(list.filter((_, i) => index !== i))
		setData(values)
	}

	const onDelete = (index: number) => {
		setList(list.filter((_, i) => index !== i))
	}

	return (
		<Panel title={`${t("legalDocs:substabelecimento.title")} (${list.length})`}>
			<ReplacementForm onAdd={onAdd} data={data} />
			<ReplacementTable list={list} edit={onEdit} delete={onDelete} />
		</Panel>
	);
};

const ReplacementPanel = forwardRef(ReplacementPanelComponent);

export default ReplacementPanel