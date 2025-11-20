import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { LegalDocumentFormTypeEnum } from "src/core/models/legal-document-request";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { getItemLegalDocRequest, getPrepositionCompany, getReplacentCompany } from "src/core/store/modules/legal-document-request/selectors";
import { TLegalDocForm } from "../Form";

export const useInitialValues = (): TLegalDocForm => {
	const user = useSelector(getDataCurrentUser);
	const item = useSelector(getItemLegalDocRequest)
	const { id } = useParams<{ id: string }>()
	const isNew = id === "novo"

	const replacementCompany = useSelector(getReplacentCompany)
	const prepositionCompany = useSelector(getPrepositionCompany)
	
	const values = useMemo<TLegalDocForm>(() => {
		let values: TLegalDocForm = {
			requestDate: new Date(),
			requestTime: new Date(),
			requestUserId: user.id ?? 0,
			requestUserName: user.name,
			folderNumbers: [],
			folderNumber: '',
			processNumber: "",
			legalDocumentRequestTypeId: null,
			signatureType: null, 
			eletronicProcurationOtherArea: {
				physicalProcuration: false,
				grantorName: "",
				grantorCNPJ: "",
				folderNumber: ""
			},
			inputs: {
				company: {
					addressName: '',
					addressNeighborhood: '',
					addressNumber: '',
					addressPostalCode: '',
					identificationNumber: '',
					name: '',
					addressCityId: 0,
					addressStateId: 0
				}
			}
		}

		if (!isNew && item) {
			values = {
				...values,
				...item,
				requestTime: item.requestDate,
				folderNumbers: item.folderNumber ? [item.folderNumber] : null,
				requestUserName: item.requestUser?.name
			}

			const docType = item.legalDocumentRequestType?.formType

			if (docType === LegalDocumentFormTypeEnum.Replacement && replacementCompany) {
				values.inputs = {
					company: replacementCompany
				}
			} else if (docType === LegalDocumentFormTypeEnum.PrepositionLetter && prepositionCompany) {
				values.inputs = {
					company: prepositionCompany
				}
			} 
		}

		return values
	}, [isNew, item, prepositionCompany, replacementCompany, user.id, user.name])

	return values
}