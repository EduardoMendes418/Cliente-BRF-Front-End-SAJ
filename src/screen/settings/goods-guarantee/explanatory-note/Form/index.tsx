import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Grid } from '@material-ui/core'
import { useHistory, useParams } from 'react-router-dom'
import { FormikHelpers } from 'formik';

import ScreenTemplate from 'src/components/Screen'
import Form, { TextField } from 'src/components/form'
import { Submit } from 'src/components/button'
import Panel from 'src/components/Panel'
import { useTranslation } from 'src/locale/i18n'
import { getExplanatoryNote, editExplanatoryNote, addExplanatoryNote } from 'src/core/store/modules/explanatory-note/thunks'
import {
	getItemExplanatoryNote,
	getLoadingExplanatoryNote,
} from 'src/core/store/modules/explanatory-note/selectors'
import { TExplanatoryNote } from 'src/core/models/explanatory-note'
import { actions, AppDispatch } from 'src/core/store'
import { useSnackbar } from 'notistack';

const defaultValues = {
	description: '',
	reference: ''
}

const ExplanatoryNoteForm = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory()

	const isNew = id === "novo";

	const item = useSelector(getItemExplanatoryNote)
	const isLoading = useSelector(getLoadingExplanatoryNote)

	useEffect(() => {
		const idNumber = parseInt(id)
		if (item?.id === undefined && !isNaN(idNumber)) {
			dispatch(getExplanatoryNote(idNumber))
		}
	}, [dispatch, item, id])

	useEffect(() => () => dispatch(actions.explanatoryNote.clear()), [dispatch])

	const onSubmit = useCallback(async (explanatoryNote: TExplanatoryNote, { setSubmitting }: FormikHelpers<TExplanatoryNote>) => {
		const { description, reference } = explanatoryNote
		const idNumber = parseInt(id)
		if (!isNaN(idNumber)) {
			const { type, payload } = await dispatch(editExplanatoryNote({ ...item, description, reference }))
			if (type === "explanatoryNote/edit/rejected") {
				enqueueSnackbar(payload?.error.detail || t('anErrorHasOcurred'), { variant: 'error' })
			} else {
				history.goBack()
			}
			setSubmitting(false)
			return
		}

		const { type, payload } = await dispatch(addExplanatoryNote(explanatoryNote))
		if (type === "explanatoryNote/add/rejected") {
			setSubmitting(false);
			enqueueSnackbar(payload?.error.detail || t('anErrorHasOcurred'), { variant: 'error' })
			return
		}

		setSubmitting(false);
		history.goBack()
	}, [id, dispatch, history, item, enqueueSnackbar, t])

	const initialValues = item ? item : defaultValues as TExplanatoryNote
	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, isValid }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t('goodsAndGuarantees:explanatoryNote.explanatoryNoteRegistration')}
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={9} xs={12}>
										<TextField
											label={t('goodsAndGuarantees:explanatoryNote.explanatoryNote')}
											name='description'
											maxLength={16}
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											label={t('goodsAndGuarantees:explanatoryNote.reference')}
											name='reference'
											required
										/>
									</Grid>
								</Grid>
							)}
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate>
	)
}

export default ExplanatoryNoteForm
