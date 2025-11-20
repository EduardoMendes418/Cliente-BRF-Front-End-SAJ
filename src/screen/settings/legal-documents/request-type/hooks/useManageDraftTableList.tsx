import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useFormikContext } from 'formik'
import { v4 } from 'uuid'

import { getItemLegalDocReqTypes } from 'src/core/store/modules/legal-document-request-types/selectors'

export type Option = { label: string, value: number }

export type Item = {
	id?: number,
	transientId?: string
	docuSignKey: string,
	legalDocumentDraftTypeId: number,
	isActive: boolean,
	legalDocumentDraftType?: {  name: string },
}

export default function useManageDraftTableList() {
	const item = useSelector(getItemLegalDocReqTypes)

	const [list, setList] = useState<Item[]>([])
	const [itemOnEdit, setItemOnEdit] = useState<Item>()
	const { setFieldValue } = useFormikContext()

	useEffect(() => {
		const draftTypesList = item?.legalDocumentRequestTypeDrafts
		if (draftTypesList && draftTypesList.length) {
			setList(draftTypesList)
		}
	}, [item])

	useEffect(() => {
		setFieldValue('legalDocumentRequestTypeDrafts', list)
	}, [list, setFieldValue])

	const setItemToEdit = (item: Item) => setItemOnEdit(item)

	const clear = () => setItemOnEdit(undefined)

	const addItem = (option: Option, docuSignKey: string) => setList([...list, {
		transientId: v4(),
		legalDocumentDraftTypeId: option.value,
		docuSignKey,
		isActive: true,
		legalDocumentDraftType: { name: option.label }
	}])

	const editItem = (option: Option, docuSignKey: string) => {
		if (!itemOnEdit) return
		const newList = list.map(i => {
			const idAttr = i.id ? 'id' : 'transientId'
			return i[idAttr] !== itemOnEdit[idAttr] ? i : {
				...i,
				docuSignKey,
				legalDocumentDraftTypeId: option.value,
				legalDocumentDraftType: { name: option.label }
			}
		})
		setList(newList)
	}

	const toggleIsActive = (item: Item) => {
		const newList = list.map(i => {
			const idAttr = i.id ? 'id' : 'transientId'
			return i[idAttr] !== item[idAttr] ? i : { ...i, isActive: !i.isActive }
		})
		setList(newList)
	}

	return {
		list,
		isOnEdit: Boolean(itemOnEdit),
		setItemToEdit,
		addItem,
		toggleIsActive,
		editItem,
		clear
	}
}
