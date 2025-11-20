import { ChangeEvent, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FormikHelpers } from 'formik'
import { CircularProgress, Grid, Typography } from '@material-ui/core'

import ScreenTemplate from 'src/components/Screen'
import Form, { CheckboxesAutocompleteField, NumericField, RadioGroup, SelectField, TextField } from 'src/components/form'
import Panel from 'src/components/Panel'
import { Button, Submit } from 'src/components/button'
import { useRegisterDefault } from 'src/hooks'
import {
	getErrorMessageLegalDocReqTypes as getErrorMessage,
	getItemLegalDocReqTypes,
	getLoadingLegalDocReqTypes,
	getStatusLegalDocReqTypes as getStatus,
} from 'src/core/store/modules/legal-document-request-types/selectors'
import {
	addLegalDocReqTypes,
	editLegalDocReqTypes,
	getLegalDocReqTypes,
} from 'src/core/store/modules/legal-document-request-types/thunks'
import { useUsersActives } from 'src/hooks/fetchLists'
import { modal } from 'src/components/modals'
import { TLegalDocRequestType } from 'src/core/models/legal-document-request-types'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

import InfoToUserModal from './components/InfoToUserModal'
import DraftTypesTables from './components/DraftTypeTables'
import { toForm } from './utils/toForm'
import { countDeadlineAsOptions, COUNT_DEADLINE, RESPONSIBLE_TYPE, resposibleAsOptions } from '../../general/request-parameters/constants'
import { legalDocFormTypeOptions } from '../utils/constants'

const defaultValues: TLegalDocRequestType = {
	name: '',
	formType: '',
	attachmentRequired: '',
	folderNumberRequired: '',
	hasDeadline: '',
	hoursDeadline: '',
	countDeadline: '',
	autoReproval: '',
	responsibleType: '',
	responsibleUserId: '',
	requestHelp: '',
	informativeNote: '',
	administrativeControlResponsiblesIds: [],
	userInformation: ''
}

export default function CoverageForm() {
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()
	const { usersActivesAsOptionsById } = useUsersActives()

	useRegisterDefault({
		action: 'legalDocReqTypes',
		getStatus,
		getErrorMessage,
	})

	const item = useSelector(getItemLegalDocReqTypes)
	const isLoading = useSelector(getLoadingLegalDocReqTypes)

	const isNew = id === 'novo'
	const initialValues: TLegalDocRequestType = toForm(item || defaultValues)

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!item && !isNaN(idNumber))
			dispatch(getLegalDocReqTypes({ id: idNumber }))
	}, [dispatch, id, item])

	useEffect(() => () => dispatch(actions.legalDocReqTypes.setItem(undefined)), [dispatch])

	const onSubmit = async (values: TLegalDocRequestType, { setSubmitting }: FormikHelpers<TLegalDocRequestType>) => {
		const form = { ...values }
		if (!form.hasDeadline) {
			form.countDeadline = COUNT_DEADLINE.NONE
			form.hoursDeadline = null
		}
		if (isNew) {
			await dispatch(addLegalDocReqTypes({ ...form, isActive: true }))
		}
		if (item) {
			await dispatch(editLegalDocReqTypes({ ...item, ...form }))
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
				{({ dirty, handleSubmit, isSubmitting, values, setFieldValue }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t('legalDocs:requestTypes.formTitle')}
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
												required
												name="name"
												label={t('legalDocs:requestTypes.field.requestType')}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<SelectField
												required
												label={t('legalDocs:requestTypes.field.form')}
												name="formType"
												options={legalDocFormTypeOptions}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<RadioGroup
												required
												label={t('legalDocs:requestTypes.field.requiredAttachment')}
												name="attachmentRequired"
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<RadioGroup
												required
												label={t('legalDocs:requestTypes.field.requiredCTGFolder')}
												name="folderNumberRequired"
											/>
										</Grid>
									</Grid>

									<Grid container spacing={3}>
										<Grid item md={12} xs={12}>
											<Typography variant='h3'>
												{t('legalDocs:requestTypes.section.deadline')}
											</Typography>
										</Grid>
										<Grid item md={2} xs={12}>
											<RadioGroup
												required
												label={t('legalDocs:requestTypes.field.withDeadline')}
												name="hasDeadline"
											/>
										</Grid>
										<Grid item md={1} xs={12}>
											<NumericField
												label={t('legalDocs:requestTypes.field.hours')}
												name="hoursDeadline"
												minLength={1}
												maxLength={2}
												placeholder=""
												disabled={!values.hasDeadline}
												required={!!values.hasDeadline}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<SelectField
												label={t('legalDocs:requestTypes.field.countDeadline')}
												name="countDeadline"
												options={countDeadlineAsOptions}
												disabled={!values.hasDeadline}
												required={!!values.hasDeadline}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<RadioGroup
												required
												label={t('legalDocs:requestTypes.field.autoDisapprove')}
												name="autoReproval"
											/>
										</Grid>
									</Grid>

									<Grid container spacing={3}>
										<Grid item md={12} xs={12}>
											<Typography variant='h3'>
												{t('legalDocs:requestTypes.section.responsible')}
											</Typography>
										</Grid>
										<Grid item md={3} xs={12}>
											<SelectField
												required
												label={t('field.responsible')}
												name="responsibleType"
												options={resposibleAsOptions}
												onChange={(event: ChangeEvent<{ value: RESPONSIBLE_TYPE }>) => {
													if (event.target.value !== RESPONSIBLE_TYPE.CUSTOM)
														setFieldValue('responsibleUserId', '')
												}}
											/>
										</Grid>
										<Grid item md={9} xs={12}>
											{values.responsibleType === RESPONSIBLE_TYPE.ADMINISTRATIVE_CONTROL ?
												<CheckboxesAutocompleteField
													options={usersActivesAsOptionsById}
													label={t('settings:requestParameters.form.administrativeControl')}
													name='administrativeControlResponsiblesIds' /> :
												<SelectField
													label={t('settings:requestParameters.form.responsibleName')}
													name='responsibleUserId'
													options={usersActivesAsOptionsById}
													required={values.responsibleType === RESPONSIBLE_TYPE.CUSTOM}
													disabled={values.responsibleType !== RESPONSIBLE_TYPE.CUSTOM}
												/>
											}
										</Grid>
										<Grid item xs={12}>
											<TextField
												required
												multiline
												rows={3}
												label={t('legalDocs:requestTypes.field.helpRequest')}
												name="requestHelp"
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												required
												multiline
												rows={3}
												label={t('legalDocs:requestTypes.field.informativeNote')}
												name="informativeNote"
											/>
										</Grid>
										<Grid item xs={12}>
											<Button
												color='secondary'
												text={t('legalDocs:requestTypes.button.infoToUser')}
												onClick={() => modal({
													title: 'Informação ao usuário',
													component: <InfoToUserModal
														initialValue={values.userInformation || ''}
														onSubmit={(info: string) => setFieldValue('userInformation', info)}
													/>,
													buttons: [],
													dialogProps: { maxWidth: 'lg', showCloseButton: true, fullWidth: true },
												})}
											/>
										</Grid>
									</Grid>

									<DraftTypesTables />
								</>
							)}
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate >
	)
}
