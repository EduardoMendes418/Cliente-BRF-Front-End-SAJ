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
import { getAccountType, editAccountType, addAccountType } from 'src/core/store/modules/account-type/thunks'
import {
	getItemAccountType,
	getLoadingAccountType,
} from 'src/core/store/modules/account-type/selectors'
import { TAccountType } from 'src/core/models/account-type'
import { actions, AppDispatch } from 'src/core/store'
import { useSnackbar } from 'notistack';

const defaultValues = {
	description: '',
	reference: ''
}

const AccountTypeForm = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory()

	const item = useSelector(getItemAccountType)
	const isLoading = useSelector(getLoadingAccountType)
	const isNew = id === "novo";

	useEffect(() => {
		const idNumber = parseInt(id)
		if (item?.id === undefined && !isNaN(idNumber)) {
			dispatch(getAccountType(idNumber))
		}
	}, [dispatch, item, id])

	useEffect(() => () => dispatch(actions.accountType.clear()), [dispatch])

	const onSubmit = useCallback(async (accountType: TAccountType, { setSubmitting }: FormikHelpers<TAccountType>) => {
		const { description } = accountType
		const idNumber = parseInt(id)
		if (!isNaN(idNumber)) {
			const { type, payload } = await dispatch(editAccountType({ ...item, description }))
			if (type === "accountType/edit/rejected") {
				enqueueSnackbar(payload?.error.detail || t('anErrorHasOcurred'), { variant: 'error' })
			}
			setSubmitting(false)
			return
		}

		const { type, payload } = await dispatch(addAccountType(accountType))
		if (type === "accountType/add/rejected") {
			enqueueSnackbar(payload?.error.detail || t('anErrorHasOcurred'), { variant: 'error' })
			setSubmitting(false);
			return
		}

		setSubmitting(false);
		history.goBack()
	}, [id, dispatch, item, enqueueSnackbar, t, history])

	const initialValues = item ? item : defaultValues as TAccountType
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
							title={t('goodsAndGuarantees:accountType.accountTypeRegistration')}
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{isLoading && <CircularProgress className='margin-top-16 align-center' />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={9} xs={12}>
										<TextField
											label={t('goodsAndGuarantees:accountType.accountType')}
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

export default AccountTypeForm