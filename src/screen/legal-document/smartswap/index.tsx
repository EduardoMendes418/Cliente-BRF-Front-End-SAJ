import { Form, FormikProvider, useFormik } from "formik"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Pagination from "src/components/Pagination"
import ScreenTemplate from "src/components/Screen"
import { TLegalDocumentSwapEdit, TLegalDocumentSwapFilter } from "src/core/models/legal-document-swap"
import { actions } from "src/core/store"
import { getErrorMessageLegalDocSmartSwap, getIsFetchingLegalDocSmartSwap, getListLegalDocSmartSwap, getStatusLegalDocSmartSwap } from "src/core/store/modules/legal-document-swap/selectors"
import { fetchLegalDocumentSwap, updateLegalDocumentSwap } from "src/core/store/modules/legal-document-swap/thunks"
import { useRegisterDefault } from "src/hooks"
import { usePagination } from "src/hooks/pagination"
import Edit from "./Edit"
import List from "./List"
import Search from "./Search"

const SmartSwap = () => {
	const dispatch = useDispatch()
	const list = useSelector(getListLegalDocSmartSwap)
	const fetching = useSelector(getIsFetchingLegalDocSmartSwap)
	const { page, pageSize } = usePagination()

	useRegisterDefault({
		action: "legalDocSwap",
		getErrorMessage: getErrorMessageLegalDocSmartSwap,
		getStatus: getStatusLegalDocSmartSwap,
		route: ""
	})

	const filter = useFormik<TLegalDocumentSwapFilter>({
		initialValues: {
			requestStatus: []
		},
		onSubmit: (values, { setSubmitting }) => {
			dispatch(fetchLegalDocumentSwap({
				...values,
				page: page,
				pageSize: pageSize
			}))
			setSubmitting(false)
		}
	})

	const edit = useFormik<TLegalDocumentSwapEdit>({
		initialValues: {},
		onSubmit: (values, { setSubmitting }) => {
			dispatch(updateLegalDocumentSwap({
				...values,
				filter: filter.values
			}))
			dispatch(fetchLegalDocumentSwap({
				...values,
				page: page,
				pageSize: pageSize
			}))
			setSubmitting(false)
		}
	})

	const { submitForm } = filter

	useEffect(() => {
		submitForm()
	}, [page, pageSize, submitForm])

	useEffect(() => {
		dispatch(actions.legalDocSwap.clearList());
	}, [dispatch])

	return (
		<ScreenTemplate>
			<FormikProvider value={filter}>
				<Form noValidate>
					<Search fetching={fetching} submitForm={submitForm}/>
				</Form>
			</FormikProvider>
			<List list={list}/>
			<Pagination />
			<FormikProvider value={edit}>
				<Form noValidate>
					<Edit fetching={fetching} />
				</Form>
			</FormikProvider>
		</ScreenTemplate>
	)
}

export default SmartSwap