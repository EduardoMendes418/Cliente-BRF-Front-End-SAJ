import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FormikHelpers } from 'formik'
import { CircularProgress, Grid } from '@material-ui/core'

import ScreenTemplate from 'src/components/Screen'
import Form, { TextField } from 'src/components/form'
import Panel from 'src/components/Panel'
import Submit from 'src/components/button/Submit'
import { useRegisterDefault } from 'src/hooks'
import {
	getErrorMessageLegalDocReqStatus as getErrorMessage,
	getItemLegalDocReqStatus,
	getLoadingLegalDocReqStatus,
	getStatusLegalDocReqStatus as getStatus,
} from 'src/core/store/modules/legal-document-request-status/selectors'
import {
	addLegalDocReqStatus,
	editLegalDocReqStatus,
	getLegalDocReqStatus,
} from 'src/core/store/modules/legal-document-request-status/thunks'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

const defaultValues = { name: "" }

type TForm = typeof defaultValues

export default function StatusForm() {
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()

	useRegisterDefault({
		action: 'legalDocReqStatus',
		getStatus,
		getErrorMessage,
	})

	const item = useSelector(getItemLegalDocReqStatus)
	const isLoading = useSelector(getLoadingLegalDocReqStatus)

	const isNew = id === 'novo'
	const initialValues: TForm = item || defaultValues

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!item && !isNaN(idNumber))
			dispatch(getLegalDocReqStatus({ id: idNumber }))
	}, [dispatch, id, item])

	useEffect(() => () => dispatch(actions.legalDocReqStatus.setItem(undefined)), [dispatch])

	const onSubmit = async (values: TForm, { setSubmitting }: FormikHelpers<TForm>) => {
		if (isNew) {
			await dispatch(addLegalDocReqStatus({ ...values, isActive: true }))
		}
		if (item) {
			await dispatch(editLegalDocReqStatus({ ...item, ...values }))
		}
		setSubmitting(false)
	}

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ dirty, handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t('legalDocs:status.title')}
							slotBottomRight={<Submit submitting={isSubmitting} isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									{isLoading && <CircularProgress />}
									{!isLoading && (
										<TextField name='name' label={t('legalDocs:status.field.status')} />
									)}
								</Grid>
							</Grid>
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate >
	)
}
