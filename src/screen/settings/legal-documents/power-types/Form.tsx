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
	getErrorMessageLegalDocPowerTypes as getErrorMessage,
	getItemLegalDocPowerTypes,
	getLoadingLegalDocPowerTypes,
	getStatusLegalDocPowerTypes as getStatus,
} from 'src/core/store/modules/legal-document-power-types/selectors'
import {
	addLegalDocPowerTypes,
	editLegalDocPowerTypes,
	getLegalDocPowerTypes,
} from 'src/core/store/modules/legal-document-power-types/thunks'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

const defaultValues = { name: "" }

type TForm = typeof defaultValues

export default function CoverageForm() {
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()

	useRegisterDefault({
		action: 'legalDocPowerTypes',
		getStatus,
		getErrorMessage,
	})

	const item = useSelector(getItemLegalDocPowerTypes)
	const isLoading = useSelector(getLoadingLegalDocPowerTypes)

	const isNew = id === 'novo'
	const initialValues: TForm = item || defaultValues

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!item && !isNaN(idNumber))
			dispatch(getLegalDocPowerTypes({ id: idNumber }))
	}, [dispatch, id, item])

	useEffect(() => () => dispatch(actions.legalDocPowerTypes.setItem(undefined)), [dispatch])

	const onSubmit = async (values: TForm, { setSubmitting }: FormikHelpers<TForm>) => {
		if (isNew) {
			await dispatch(addLegalDocPowerTypes({ ...values, isActive: true }))
		}
		if (item) {
			await dispatch(editLegalDocPowerTypes({ ...item, ...values }))
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
							title={t('legalDocs:powerTypes.formTitle')}
							slotBottomRight={<Submit submitting={isSubmitting} isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									{isLoading && <CircularProgress />}
									{!isLoading && (
										<TextField name='name' label={t('legalDocs:powerTypes.field.powerTypes')} />
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
