import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Panel from "src/components/Panel";
import { LegalDocumentPrepositionLetterParties, LegalDocumentPrepositionLetterPartyEnum } from "src/core/models/legal-document-request";
import { getPrepositionParties } from "src/core/store/modules/legal-document-request/selectors";
import { useTranslation } from "src/locale/i18n";
import NominatedForm from "./NominatedForm";
import NominatedTable from "./NominatedTable";

export type NominatedPanelHandler = {
	getList: () => LegalDocumentPrepositionLetterParties[]
}

const NominatedPanelComponent: ForwardRefRenderFunction<NominatedPanelHandler, {}> = (props, ref) => {
	const { t } = useTranslation();
	const [list, setList] = useState<LegalDocumentPrepositionLetterParties[]>([])
	const [data, setData] = useState<LegalDocumentPrepositionLetterParties | undefined>()
	const { id } = useParams<{ id: string }>()
	const isNew = id === "novo"
	const parties = useSelector(getPrepositionParties)

	useImperativeHandle(ref, () => ({
		getList: () => list
	}), [list])
	
	useEffect(() => {
		if (!isNew && parties) {
			setList(parties.filter(x => x.partyType === LegalDocumentPrepositionLetterPartyEnum.Individual) ?? [])
		}
	}, [isNew, parties])
	
	const onAdd = (values: LegalDocumentPrepositionLetterParties) => {
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
		<Panel title={`${t("legalDocs:nominated.title")} (${list.length})`}>
			<NominatedForm onAdd={onAdd} data={data} />
			<NominatedTable edit={onEdit} delete={onDelete} list={list} />
		</Panel>
	);
};

const  NominatedPanel = forwardRef(NominatedPanelComponent);

export default NominatedPanel;
