import { Form, FormikProvider, useFormik } from "formik";
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Panel from "src/components/Panel";
import { LegalDocumentPrepositionLetterProcess, LegalDocumentPrepositionReplacementExtraData } from "src/core/models/legal-document-request";
import { getReplacement, getReplacementProcess } from "src/core/store/modules/legal-document-request/selectors";
import { getProvisionsProcesses } from "src/core/store/modules/provision-order/selectors";
import { useTranslation } from "src/locale/i18n";
import ProcessData from "./ProcessData";
import ProcessForm from "./ProcessForm";
import ProcessTable from "./ProcessTable";

export type ProcessPanelProps = {
	note: string
}

export type ProcessPanelHandler = {
	getList: () => LegalDocumentPrepositionLetterProcess[]
	getExtraData: () => LegalDocumentPrepositionReplacementExtraData
}

const ProcessPanelComponent: ForwardRefRenderFunction<ProcessPanelHandler, ProcessPanelProps> = (props, ref) => {
	const { t } = useTranslation()
	const [list, setList] = useState<LegalDocumentPrepositionLetterProcess[]>([])
	const [data, setData] = useState<LegalDocumentPrepositionLetterProcess | undefined>()
	const { id } = useParams<{ id: string }>()
	const isNew = id === "novo"
	const processes = useSelector(getReplacementProcess)
	const folderProcesses = useSelector(getProvisionsProcesses)
	const item = useSelector(getReplacement)

	const extraData = useFormik<LegalDocumentPrepositionReplacementExtraData>({
		initialValues: {
			powers: "",
			observationProcess: ""
		},
		onSubmit: () => {

		}
	})

	const {
		setValues
	} = extraData

	useEffect(() => {
		if (!isNew && processes) {
			setList(processes ?? [])
			setValues({
				powers: item?.powers ?? "",
				observationProcess: item?.observationProcess ?? ""
			})
		} else {
			const folders = folderProcesses?.map<LegalDocumentPrepositionLetterProcess>(x => ({
				processNumber: x.processNumber ?? "",
				actionType: x.type,
				legalCourt: `${x.courtPanelNumber}ª ${x.courtPanelDescription}`,
				district: x.jurisdictionName
			}))

			setList(folders)
		}
	}, [folderProcesses, isNew, item?.observationProcess, item?.powers, processes, setValues])

	useImperativeHandle(ref, () => ({
		getExtraData: () => extraData.values,
		getList: () => list
	}), [extraData.values, list])

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
			<FormikProvider value={extraData}>
				<Form noValidate>
					<ProcessData note={props.note} />
				</Form>
			</FormikProvider>
		</Panel>
	)
}

const ProcessPanel = forwardRef(ProcessPanelComponent);

export default ProcessPanel