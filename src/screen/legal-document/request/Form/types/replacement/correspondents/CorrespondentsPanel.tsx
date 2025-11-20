import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Panel from "src/components/Panel";
import { LegalDocumentPrepositionReplacementParties, LegalDocumentPrepositionReplacementPartyEnum } from "src/core/models/legal-document-request";
import { getReplacementParties } from "src/core/store/modules/legal-document-request/selectors";
import { useTranslation } from "src/locale/i18n";
import CorrespondentsForm from "./CorrespondentsForm";
import CorrespondentsTable from "./CorrespondentsTable";

export type CorrespondentsPanelHandler = {
	getList: () => LegalDocumentPrepositionReplacementParties[]
}

const CorrespondentsPanelComponet: ForwardRefRenderFunction<CorrespondentsPanelHandler, {}> = (props, ref) => {
	const { t } = useTranslation();
	const [list, setList] = useState<LegalDocumentPrepositionReplacementParties[]>([])
	const [data, setData] = useState<LegalDocumentPrepositionReplacementParties | undefined>()
	const { id } = useParams<{ id: string }>()
	const isNew = id === "novo"
	const parties = useSelector(getReplacementParties)

	useImperativeHandle(ref, () => ({
		getList: () => list
	}), [list])

	useEffect(() => {
		if (!isNew && parties) {
			setList(parties.filter(x => x.partyType === LegalDocumentPrepositionReplacementPartyEnum.Correspondents) ?? [])
		}
	}, [isNew, parties])

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
		<Panel title={`${t("legalDocs:correspondents.title")} (${list.length})`}>
			<CorrespondentsForm onAdd={onAdd} data={data} />
			<CorrespondentsTable edit={onEdit} delete={onDelete} list={list} />
		</Panel>
	);
};

const CorrespondentsPanel = forwardRef(CorrespondentsPanelComponet);

export default CorrespondentsPanel