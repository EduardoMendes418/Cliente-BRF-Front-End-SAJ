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
import { getReleaseType, editReleaseType, addReleaseType } from 'src/core/store/modules/release-type/thunks'
import {
	getItemReleaseType,
	getLoadingReleaseType,
} from 'src/core/store/modules/release-type/selectors'
import { TReleaseType } from 'src/core/models/release-type'
import { actions, AppDispatch } from 'src/core/store'
import { useSnackbar } from 'notistack';

const defaultValues = {
	description: '',
	reference: ''
}

const ReleaseTypeForm = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()
	const { enqueueSnackbar } = useSnackbar()
	const history = useHistory()

	const item = useSelector(getItemReleaseType)
	const isLoading = useSelector(getLoadingReleaseType)
	const isNew = id === "novo";

	useEffect(() => {
		const idNumber = parseInt(id)
		if (item?.id === undefined && !isNaN(idNumber)) {
			dispatch(getReleaseType(idNumber))
		}
	}, [dispatch, item, id])

	useEffect(() => () => dispatch(actions.releaseType.clear()), [dispatch])

	const onSubmit = useCallback(async (releaseType: TReleaseType, { setSubmitting }: FormikHelpers<TReleaseType>) => {
		const { description } = releaseType
		const idNumber = parseInt(id)
		if (!isNaN(idNumber)) {
			const { type, payload } = await dispatch(editReleaseType({ ...item, description }))
			if (type === "releaseType/edit/rejected") {
				enqueueSnackbar(payload?.error.detail, { variant: 'error' })
			} else {
				history.goBack()
			}

			setSubmitting(false)
			return
		}
		const { type, payload } = await dispatch(addReleaseType(releaseType))
		if (type === "releaseType/add/rejected") {
			enqueueSnackbar(payload?.error.detail, { variant: 'error' })
			setSubmitting(false);
			return
		}
		setSubmitting(false);
		history.goBack()
	}, [id, dispatch, history, item, enqueueSnackbar])

	const initialValues = item ? item : defaultValues as TReleaseType
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
							title={t('goodsAndGuarantees:releaseType.title')}
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={9} xs={12}>
										<TextField
											label={t('goodsAndGuarantees:releaseType.title')}
											name='description'
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

export default ReleaseTypeForm