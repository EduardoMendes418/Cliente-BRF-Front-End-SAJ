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
	getErrorMessageLegalDocCoverage as getErrorMessage,
	getItemLegalDocCoverage,
	getLoadingLegalDocCoverage,
	getStatusLegalDocCoverage as getStatus,
} from 'src/core/store/modules/legal-document-coverages/selectors'
import {
	addLegalDocCoverage,
	editLegalDocCoverage,
	getLegalDocCoverage,
} from 'src/core/store/modules/legal-document-coverages/thunks'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

const defaultValues = { name: "" }

type TForm = typeof defaultValues

export default function CoverageForm() {
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()

	useRegisterDefault({
		action: 'legalDocCoverage',
		getStatus,
		getErrorMessage,
	})

	const item = useSelector(getItemLegalDocCoverage)
	const isLoading = useSelector(getLoadingLegalDocCoverage)

	const isNew = id === 'novo'
	const initialValues: TForm = item || defaultValues

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!item && !isNaN(idNumber))
			dispatch(getLegalDocCoverage({ id: idNumber }))
	}, [dispatch, id, item])

	useEffect(() => () => dispatch(actions.legalDocCoverage.setItem(undefined)), [dispatch])

	const onSubmit = async (values: TForm, { setSubmitting }: FormikHelpers<TForm>) => {
		if (isNew) {
			await dispatch(addLegalDocCoverage({ ...values, isActive: true }))
		}
		if (item) {
			await dispatch(editLegalDocCoverage({ ...item, ...values }))
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
							title={t('legalDocs:coverage.title')}
							slotBottomRight={<Submit submitting={isSubmitting} isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									{isLoading && <CircularProgress />}
									{!isLoading && (
										<TextField name='name' label={t('legalDocs:coverage.field.coverage')} />
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
