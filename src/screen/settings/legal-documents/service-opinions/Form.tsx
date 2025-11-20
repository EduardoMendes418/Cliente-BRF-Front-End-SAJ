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
	getErrorMessageLegalDocServiceOpinions as getErrorMessage,
	getItemLegalDocServiceOpinions,
	getLoadingLegalDocServiceOpinions,
	getStatusLegalDocServiceOpinions as getStatus,
} from 'src/core/store/modules/legal-document-service-opinions/selectors'
import {
	addLegalDocServiceOpinions,
	editLegalDocServiceOpinions,
	getLegalDocServiceOpinions,
} from 'src/core/store/modules/legal-document-service-opinions/thunks'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

const defaultValues = {
	name: "",
	description: ""
}

type TForm = typeof defaultValues

export default function CoverageForm() {
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()

	useRegisterDefault({
		action: 'legalDocServiceOpinions',
		getStatus,
		getErrorMessage,
	})

	const item = useSelector(getItemLegalDocServiceOpinions)
	const isLoading = useSelector(getLoadingLegalDocServiceOpinions)

	const isNew = id === 'novo'
	const initialValues: TForm = item || defaultValues

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!item && !isNaN(idNumber))
			dispatch(getLegalDocServiceOpinions({ id: idNumber }))
	}, [dispatch, id, item])

	useEffect(() => () => dispatch(actions.legalDocServiceOpinions.setItem(undefined)), [dispatch])

	const onSubmit = async (values: TForm, { setSubmitting }: FormikHelpers<TForm>) => {
		if (isNew) {
			await dispatch(addLegalDocServiceOpinions({ ...values, isActive: true }))
		}
		if (item) {
			await dispatch(editLegalDocServiceOpinions({ ...item, ...values }))
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
							title={t('legalDocs:serviceOpinion.formTitle')}
							slotBottomRight={<Submit submitting={isSubmitting} isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{isLoading && <CircularProgress />}
							{!isLoading && (
								<>
									<Grid container spacing={3}>
										<Grid item md={3} xs={12}>
											<TextField
												name='name'
												label={t('legalDocs:serviceOpinion.field.serviceOpinion')}
											/>
										</Grid>
									</Grid>
									<Grid container spacing={3}>
										<Grid item lg>
											<TextField
												multiline
												rows={3}
												name='description'
												label={t('legalDocs:serviceOpinion.field.description')}
											/>
										</Grid>
									</Grid>
								</>
							)}
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate >
	)
}
