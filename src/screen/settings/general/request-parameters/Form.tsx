import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';

import Form, { TextField, SelectField, RadioGroup, NumericField, CheckboxesAutocompleteField } from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';

import { useTranslation } from 'src/locale/i18n';
import {
	getRequestParameters,
	addRequestParameters,
	editRequestParameters,
} from 'src/core/store/modules/request-parameters/thunks';
import {
	getItemRequestParameters,
	getLoadingRequestParameters,
	getStatusRequestParameters as getStatus,
	getErrorMessageRequestParameters as getErrorMessage,
	getHasItemRequestParameters,
} from 'src/core/store/modules/request-parameters/selectors';
import { TRequestParameters } from 'src/core/models/request-parameters';
import { useRegisterDefault } from 'src/hooks';
import { actions } from 'src/core/store';
import { useEffect, useMemo } from 'react';
import { fillIfValue } from 'src/core/utils/func';
import {
	statusFolderNumberAsOptions,
	countDeadlineAsOptions,
	resposibleAsOptions,
	RESPONSIBLE_TYPE,
} from './constants';
import { useUsersActives } from 'src/hooks/fetchLists';
import ReceiverWithCopiesForm from './ReceiverWithCopies';


const RequestParametersForm = () => {

	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const loading = useSelector(getLoadingRequestParameters);
	const statusSubmit = useSelector(getStatus);
	const item = useSelector(getItemRequestParameters);
	const hasItem = useSelector(getHasItemRequestParameters);

	const { usersActivesAsOptionsById } = useUsersActives()

	const isNew = id === 'novo';

	useEffect(() => {
		if (id && !isNew) dispatch(getRequestParameters(id));
		return () => { dispatch(actions.requestParameters.clear()) };
	}, [dispatch, id, isNew]);

	useRegisterDefault({
		action: 'requestParameters',
		getStatus,
		getErrorMessage,
	})

		const modifyRequestParameterEmails = (array: any[]): any[] => {
		return array.map(obj => {
			const { id, ...requestParameterEmailsIds } = obj;
			return requestParameterEmailsIds;
		});
	};

	

	const onSubmit = async (values: TRequestParameters) => {
		const updatedArray = await modifyRequestParameterEmails(values.requestParameterEmailsIds);
		if (isNew) dispatch(addRequestParameters({...values, requestParameterEmailsIds: updatedArray}));
		else dispatch(editRequestParameters({ ...values, requestParameterEmailsIds: updatedArray, id: Number(id) }));
	};


	const initialValues: TRequestParameters = useMemo(() => {
		const initialValues: TRequestParameters = {
			requestType: '',
			description: '',
			statusFolderNumber: 0,
			requestHelp: '',
			responsibleType: '',
			responsibleUserId: '',
			hoursDeadline: 0,
			countDeadline: '',
			hasDeadline: '',
			resultReport: '',
			attachmentRequired: '',
			folderNumberRequired: '',
			processComplement: '',
			status: true,
			administrativeControlResponsiblesIds: [],
			requestParameterEmailsIds: [],
		}
		return {
			...fillIfValue<TRequestParameters>(item, initialValues),
			countDeadline: item.hasDeadline ? item.countDeadline : '',
		}
	}, [item, hasItem])

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, setSubmitting, values }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							slotBottonRightPermission="add"
							title={t('settings:titles.requestParameters')}
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting || loading} disabled={!dirty} />}
							withPadding
						>
							<Grid container spacing={3}>
								<Grid item md={12} xs={12}>
									<Grid container item spacing={3}>
										<Grid item md={12} xs={12}>
											<Typography variant='h3'>
												{t('settings:requestParameters.request')}
											</Typography>
										</Grid>
										<Grid item md={6} xs={12}>
											<TextField
												label={t('settings:requestParameters.form.requestType')}
												name='requestType'
												required
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<SelectField
												label={t('settings:requestParameters.form.statusFolderNumber')}
												name='statusFolderNumber'
												options={statusFolderNumberAsOptions}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item md={6} xs={12}>
									<Grid container item spacing={3}>
										<Grid item md={12} xs={12}>
											<Typography variant='h3'>
												{t('settings:requestParameters.deadline')}
											</Typography>
										</Grid>
										<Grid item md={6} xs={12}>
											<RadioGroup
												label={t('settings:requestParameters.form.hasDeadline')}
												name='hasDeadline'
												required
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<NumericField
												label={t('settings:requestParameters.form.hoursDeadline')}
												name='hoursDeadline'
												placeholder=''
												disabled={!values.hasDeadline}
												required={!!values.hasDeadline}
											/>
										</Grid>
										<Grid item md={12} xs={12}>
											<SelectField
												label={t('settings:requestParameters.form.countDeadline')}
												name='countDeadline'
												options={countDeadlineAsOptions}
												disabled={!values.hasDeadline}
												required={!!values.hasDeadline}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item md={6} xs={12}>
									<Grid container item spacing={3}>
										<Grid item md={12} xs={12}>
											<Typography variant='h3'>
												{t('settings:requestParameters.form.parameters')}
											</Typography>
										</Grid>
										<Grid item md={4} xs={12}>
											<RadioGroup
												label={t('settings:requestParameters.form.resultReport')}
												name='resultReport'
												required
											/>
										</Grid>
										<Grid item md={4} xs={12}>
											<RadioGroup
												label={t('settings:requestParameters.form.attachmentRequired')}
												name='attachmentRequired'
												required
											/>
										</Grid>
										<Grid item md={4} xs={12}>
											<RadioGroup
												label={t('settings:requestParameters.form.folderNumberRequired')}
												name='folderNumberRequired'
												required
											/>
										</Grid>
										<Grid item md={4} xs={12}>
											<RadioGroup
												label={t('settings:requestParameters.form.processComplement')}
												name='processComplement'
												required
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item md={12} xs={12}>
									<Grid container item spacing={3}>
										<Grid item md={12} xs={12}>
											<Typography variant='h3'>
												{t('settings:requestParameters.responsible')}
											</Typography>
										</Grid>
										<Grid item md={3} xs={12}>
											<SelectField
												label={t('settings:requestParameters.responsible')}
												name='responsibleType'
												options={resposibleAsOptions}
												required
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
												/>}
										</Grid>
									</Grid>
								</Grid>
								<Grid container item spacing={3}>
									<Grid item md={6} xs={12}>
										<TextField
											label={t('settings:requestParameters.form.requestHelp')}
											name='requestHelp'
											multiline
											rows={16}
											maxLength={2500}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											multiline
											rows={16}
											label={t('settings:requestParameters.form.description')}
											name='description'
											maxLength={2500}
										/>
									</Grid>
								</Grid>
							</Grid>
							<ReceiverWithCopiesForm
								title={"Destinatários com cópia"}
								isNew={isNew}
								disabled={!dirty}
								submitting={isSubmitting}
							/>
						</Panel>
						{statusSubmit === 'failure' && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default RequestParametersForm;
