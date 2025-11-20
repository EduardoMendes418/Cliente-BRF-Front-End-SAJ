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
import { getLicenseType, editLicenseType, addLicenseType } from 'src/core/store/modules/license-type/thunks'
import {
	getItemLicenseType,
	getLoadingLicenseType,
} from 'src/core/store/modules/license-type/selectors'
import { TLicenseType } from 'src/core/models/license-type'
import { actions, AppDispatch } from 'src/core/store'
import { useSnackbar } from 'notistack';

const defaultValues = {
	description: '',
}

const LicenseTypeForm = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory()

	const licenseTypeItem = useSelector(getItemLicenseType)
	const isLoading = useSelector(getLoadingLicenseType)

	const isNew = id === "novo";

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!licenseTypeItem && !isNaN(idNumber)) {
			dispatch(getLicenseType(idNumber))
		}
	}, [dispatch, licenseTypeItem, id])

	useEffect(() => () => dispatch(actions.licenseType.setItem(undefined)), [dispatch])

	const onSubmit = useCallback(async (licenseType: TLicenseType, { setSubmitting }: FormikHelpers<TLicenseType>) => {
		const { description } = licenseType
		if (licenseTypeItem) {
			const { type, payload } = await dispatch(editLicenseType({ ...licenseTypeItem, description }))
			if (type === "licenseType/edit/rejected") {
				enqueueSnackbar(payload?.error.detail, { variant: 'error' })
			} else {
				history.goBack();
			}
			setSubmitting(false)
			return
		}

		const { type, payload } = await dispatch(addLicenseType(description))
		if (type === "licenseType/add/rejected") {
			enqueueSnackbar(payload?.error.detail, { variant: 'error' })
		} else {
			history.goBack();
		}
		setSubmitting(false);
	}, [dispatch, enqueueSnackbar, history, licenseTypeItem])

	const initialValues = licenseTypeItem ? licenseTypeItem : defaultValues as TLicenseType
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
							title={t('goodsAndGuarantees:licenseType.formTitle')}
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<TextField
											label={t('goodsAndGuarantees:licenseType.title')}
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

export default LicenseTypeForm
