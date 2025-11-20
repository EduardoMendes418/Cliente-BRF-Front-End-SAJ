import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { useSnackbar } from 'notistack';

import Form, { TextField, SelectField } from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';

import { useTranslation } from 'src/locale/i18n';
import {
	getEconomicIndices,
	addEconomicIndices,
	editEconomicIndices,
} from 'src/core/store/modules/economic-indices/thunks';
import {
	getItemEconomicIndices,
	getStatusEconomicIndices as getStatus,
	getErrorMessageEconomicIndices as getErrorMessage,
} from 'src/core/store/modules/economic-indices/selectors';
import { useRegisterDefault } from 'src/hooks';
import { actions } from 'src/core/store';
import { useEffect, useMemo } from 'react';
import { fillIfValue, valuesToNumber, hasDuplicates } from 'src/core/utils/func';
import { ECONOMIC_INDICES_PERIOD, ECONOMIC_INDICES_TYPE, periodAsOptions, typeAsOptions } from './constants';
import { TEconomicIndices } from 'src/core/models/economic-indices';
import Occurrences from './components/Occurrences'
import moment from "moment";

const EconomicIndicesForm = () => {

	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const statusSubmit = useSelector(getStatus);
	const item = useSelector(getItemEconomicIndices);

	const isNew = id === 'novo';

	useEffect(() => {
		if (id && !isNew) dispatch(getEconomicIndices(id));
		return () => { dispatch(actions.economicIndices.clear()) };
	}, [dispatch, id, isNew]);

	useRegisterDefault({
		action: 'economicIndices',
		getStatus,
		getErrorMessage,
	})

	const onSubmit = (values: TEconomicIndices) => {
		const { economicIndicesValues, period } = values;
		const dates = economicIndicesValues.map(({ date }) => new Date(date));

		switch (period) {
			case ECONOMIC_INDICES_PERIOD.MONTHLY:
				const months = dates.map(item => `${item.getUTCMonth()}-${item.getUTCFullYear()}`)
				if (hasDuplicates(months)) {
					enqueueSnackbar(t('settings:economicIndices.error.monthly'), { variant: 'error' });
					return
				}
				break;

			case ECONOMIC_INDICES_PERIOD.YEARLY:
				const years = dates.map(item => `${item.getUTCFullYear()}`)
				if (hasDuplicates(years)) {
					enqueueSnackbar(t('settings:economicIndices.error.yearly'), { variant: 'error' });
					return
				}
				break;

		}

		const normalizedValues = {
			...values,
			economicIndicesValues: values.economicIndicesValues.map(item => valuesToNumber(['value'], {
				...item,
				// item.id is string when a new item was added but has no id.
				id: typeof item.id === 'string' ? undefined : item.id
			}))
		}
		if (isNew) dispatch(addEconomicIndices(normalizedValues));
		else dispatch(editEconomicIndices({ ...normalizedValues, id: Number(id) }));
	};

	const initialValues: TEconomicIndices = useMemo(() => {
		const initialValues: TEconomicIndices = {
			id: 0,
			name: '',
			createdDate: moment(),
			period: ECONOMIC_INDICES_PERIOD.DAILY,
			type: ECONOMIC_INDICES_TYPE.FEE,
			description: '',
			economicIndicesValues: [],
			status: true
		}
		return {
			...fillIfValue<TEconomicIndices>(item, initialValues),
		}
	}, [item])

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
							title={t(`settings:economicIndices.form.${isNew ? 'title' : 'viewTitle'}`)}
							withPadding
						>
							<Grid container spacing={3}>
								<Grid item md={6} xs={12}>
									<TextField
										label={t('settings:economicIndices.name')}
										name='name'
										required
									/>
								</Grid>

								<Grid item md={3} xs={12}>
									<SelectField
										label={t('settings:economicIndices.period')}
										name='period'
										options={periodAsOptions}
										required
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={t('settings:economicIndices.type')}
										name='type'
										options={typeAsOptions}
										required
									/>
								</Grid>
								<Grid item md={12} xs={12}>
									<TextField
										label={t('settings:economicIndices.description')}
										name='description'
									/>
								</Grid>
							</Grid>
						</Panel>
						<Occurrences
							title={t('settings:economicIndices.form.occurrences')}
							economicIndiceId={id}
							valueType={values.type}
							disabled={!dirty}
							submitting={statusSubmit === 'failure' && isSubmitting}
						/>
						{statusSubmit === 'failure' && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default EconomicIndicesForm;
