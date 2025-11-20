import { Form, FormikProvider, useFormik } from "formik";
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Panel from "src/components/Panel";
import { LegalDocumentEletronicProcurationLegalGranteds, LegalDocumentEletronicProcurationOtherAreaExtraData } from "src/core/models/legal-document-request";
import { getEletronicOtherArea, getEletronicOtherAreaGranteds } from "src/core/store/modules/legal-document-request/selectors";
import { useTranslation } from "src/locale/i18n";
import BestowedData from "./BestowedData";
import BestowedForm from "./BestowedForm";
import BestowedTable from "./BestowedTable";

type BestowedPanelProps = {
	note: string
}

export type BestowedPanelHandler = {
	getList: () => LegalDocumentEletronicProcurationLegalGranteds[]
	getExtraData: () => LegalDocumentEletronicProcurationOtherAreaExtraData
}

const BestowedPanelComponent: ForwardRefRenderFunction<BestowedPanelHandler, BestowedPanelProps> = (props, ref) => {
	const { t } = useTranslation()
	const [list, setList] = useState<LegalDocumentEletronicProcurationLegalGranteds[]>([])
	const [data, setData] = useState<LegalDocumentEletronicProcurationLegalGranteds | undefined>()
	const { id } = useParams<{ id: string }>()
	const isNew = id === "novo"
	const granteds = useSelector(getEletronicOtherAreaGranteds)
	const item = useSelector(getEletronicOtherArea)

	const extraData = useFormik<LegalDocumentEletronicProcurationOtherAreaExtraData>({
		initialValues: {
			justification: "",
			powers: ""
		},
		onSubmit: () => {

		}
	})

	const {
		setValues
	} = extraData

	useEffect(() => {
		if (!isNew && granteds) {
			setList(granteds ?? [])
			setValues({
				powers: item?.powers ?? "",
				justification: item?.justification ?? "",
				validityEnd: item?.validityEnd,
				validityStart: item?.validityStart
			})
		}
	}, [granteds, isNew, item?.justification, item?.powers, item?.validityEnd, item?.validityStart, setValues])

	useImperativeHandle(ref, () => ({
		getExtraData: () => extraData.values,
		getList: () => list
	}), [extraData.values, list])

	const onAdd = (values: LegalDocumentEletronicProcurationLegalGranteds) => {
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
		<Panel title={t("legalDocs:bestowed.title")}>
			<BestowedForm onAdd={onAdd} data={data} />
			<BestowedTable edit={onEdit} delete={onDelete} list={list} />
			<FormikProvider value={extraData}>
				<Form noValidate>
					<BestowedData note={props.note} />
				</Form>
			</FormikProvider>
		</Panel>
	)
}

const BestowedPanel = forwardRef(BestowedPanelComponent);

export default BestowedPanel