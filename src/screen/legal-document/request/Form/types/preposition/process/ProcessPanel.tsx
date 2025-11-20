import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Panel from "src/components/Panel";
import { LegalDocumentPrepositionLetterProcess } from "src/core/models/legal-document-request";
import { getPrepositionProcess } from "src/core/store/modules/legal-document-request/selectors";
import { getProvisionsProcesses } from "src/core/store/modules/provision-order/selectors";
import { useTranslation } from "src/locale/i18n";
import ProcessForm from "./ProcessForm";
import ProcessTable from "./ProcessTable";

export type ProcessPanelHandler = {
	getList: () => LegalDocumentPrepositionLetterProcess[]
}

const ProcessPanelComponent: ForwardRefRenderFunction<ProcessPanelHandler, {}> = (props, ref) => {
	const { t } = useTranslation()
	const [list, setList] = useState<LegalDocumentPrepositionLetterProcess[]>([])
	const [data, setData] = useState<LegalDocumentPrepositionLetterProcess | undefined>()
	const { id } = useParams<{ id: string }>()
	const isNew = id === "novo"
	const processes = useSelector(getPrepositionProcess)
	const folderProcesses = useSelector(getProvisionsProcesses)

	useImperativeHandle(ref, () => ({
		getList: () => list
	}), [list])

	useEffect(() => {
		if (!isNew && processes) {
			setList(processes ?? [])
		} else {
			const folders = folderProcesses?.map<LegalDocumentPrepositionLetterProcess>(x => ({
				processNumber: x.processNumber ?? "",
				actionType: x.type,
				legalCourt: `${x.courtPanelNumber}ª ${x.courtPanelDescription}`,
				district: x.jurisdictionName
			}))

			setList(folders)
		}
	}, [isNew, processes, folderProcesses])

	const onAdd = (values: LegalDocumentPrepositionLetterProcess) => {
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
		<Panel title={`${t("legalDocs:process.title")} (${list?.length})`}>
			<ProcessForm onAdd={onAdd} data={data} />
			<ProcessTable edit={onEdit} delete={onDelete} list={list} />
		</Panel>
	)
}

const ProcessPanel = forwardRef(ProcessPanelComponent);

export default ProcessPanel