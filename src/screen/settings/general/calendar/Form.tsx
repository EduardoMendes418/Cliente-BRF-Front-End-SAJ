import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import Form, { DateField, TextField } from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';

import { useTranslation } from 'src/locale/i18n';
import { addNonWorkingDays, editNonWorkingDays, getNonWorkingDays } from 'src/core/store/modules/non-working-days/thunks';
import {
	getItemNonWorkingDays,
	getLoadingNonWorkingDays,
	getStatusNonWorkingDays as getStatus,
	getErrorMessageNonWorkingDays as getErrorMessage,
} from 'src/core/store/modules/non-working-days/selectors';
import { TNonWorkingDays } from 'src/core/models/non-working-days';
import { useRegisterDefault } from 'src/hooks';
import { actions } from 'src/core/store';

const CalendarForm = () => {

	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const loading = useSelector(getLoadingNonWorkingDays);
	const statusSubmit = useSelector(getStatus);
	const { date, description } = useSelector(getItemNonWorkingDays);

	const isNew = id === 'novo';

	useEffect(() => {
		if (id && !isNew) dispatch(getNonWorkingDays(id));
		return () => { dispatch(actions.nonWorkingDays.clear()) };
	}, [dispatch, id, isNew]);

	useRegisterDefault({
		action: 'nonWorkingDays',
		getStatus,
		getErrorMessage,
	})

	const onSubmit = (values: TNonWorkingDays) => {
		dispatch(actions.nonWorkingDays.setFilters({ date: values.date }))
		if (isNew) dispatch(addNonWorkingDays(values));
		else dispatch(editNonWorkingDays({ ...values, id: Number(id) }))
	};

	const initialValues: TNonWorkingDays = {
		date: date ?? null,
		description: description ?? '',
	}

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, setSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t('settings:calendary.titleForm')}
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting || loading} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<DateField
										label={t('settings:calendary.date')}
										name='date'
										required
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										label={t('settings:calendary.description')}
										name='description'
										required
									/>
								</Grid>
							</Grid>
						</Panel>
						{statusSubmit === 'failure' && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default CalendarForm;
