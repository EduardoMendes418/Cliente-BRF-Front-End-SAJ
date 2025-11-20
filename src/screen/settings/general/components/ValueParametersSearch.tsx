import { Formik } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import Panel from 'src/components/Panel';
import { NumericField, DateField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';

import { actions } from 'src/core/store';
import { rejectNoValues } from 'src/core/utils/func';

type TFilters = {
	id?: number | string;
	initialDate?: string | null;
	finalDate?: string | null;
}

type TSearch = {
	loading: boolean,
	action: string;
	title: string;
	savedFilters?: TFilters
}

const ValueParametersSearch = ({ loading, action, title, savedFilters }: TSearch) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const onSubmit = (values: TFilters) => {
		const filters = rejectNoValues({ page: 1, ...values });
		dispatch(actions[action].setFilters(filters));
	};

	const initialValues = {
		id: '',
		initialDate: null,
		finalDate: null,
		...(savedFilters ?? {})
	}

	return (
		<Panel title={title} withPadding>
			<Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
				{({ handleSubmit, isSubmitting, setSubmitting, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<NumericField
									label={t('settings:shared.id')}
									name='id'
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<DateField
									label={t('settings:shared.initialDate')}
									name='initialDate'
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<DateField
									label={t('settings:shared.finalDate')}
									name='finalDate'
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" submitting={loading} disabled={!dirty && !submitCount} />
							</Grid>
						</Grid>
						<Clean action={action} />
						{!loading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default ValueParametersSearch;
