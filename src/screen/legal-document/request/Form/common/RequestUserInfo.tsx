import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getItemContacts } from "src/core/store/modules/contacts/selectors"
import { fetchContactsWithLike } from "src/core/store/modules/contacts/thunks"
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors"
import { getRequestUserLegalDocRequest } from "src/core/store/modules/legal-document-request/selectors"
import { getListUsers } from "src/core/store/modules/users/selectors"
import { fetchUsers } from "src/core/store/modules/users/thunks"
import { useTranslation } from "src/locale/i18n"

const RequestUserInfo = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const { id } = useParams<{ id: string }>()
	const isNew = id === "novo"

	const requestUser = useSelector(getRequestUserLegalDocRequest)
	const currentUser = useSelector(getDataCurrentUser)

	const contact = useSelector(getItemContacts)
	const user = useSelector(getListUsers)[0]

	useEffect(() => {
		dispatch(fetchContactsWithLike({ partName: isNew ? currentUser.name ?? "" : requestUser?.name ?? "" }))
		dispatch(fetchUsers({ name: isNew ? currentUser.name ?? "" : requestUser?.name ?? "" }))
	}, [contact, dispatch, isNew, requestUser?.id, requestUser?.name, currentUser.id, currentUser.name])

	const idBrf = isNew
		? currentUser.idBrf
		: requestUser?.idBrf

	return (
		<>
			<span>
				<strong>{t("legalDocs:userInfo.id")}: </strong>
				{
					idBrf ? idBrf : "-"
				}
			</span>
			<br />
			<span>
				<strong>{t("legalDocs:userInfo.name")}: </strong>
				{
					user?.name ?? "-"
				}
			</span>
			<br />
			<span>
				<strong>{t("legalDocs:userInfo.cargo")}: </strong>
				{
					user?.office ? user.office : "-"
				}
			</span>
			<br />
			<span>
				<strong>{t("legalDocs:userInfo.phone")}: </strong>
				{
					user?.phone ? user.phone : "-"
				}
			</span>
			<br />
			<span>
				<strong>{t("legalDocs:userInfo.email")}: </strong>
				{
					user?.email ? user.email : "-"
				}
			</span>
			<br />
			<span>
				<strong>{t("legalDocs:userInfo.departament")}: </strong>
				{
					user?.departament ? user.departament : "-"
				}
			</span>
		</>
	)
}

export default RequestUserInfo