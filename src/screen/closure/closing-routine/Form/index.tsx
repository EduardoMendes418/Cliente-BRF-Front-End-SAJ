import { Formik, FormikHelpers } from 'formik';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import { useTranslation } from 'src/locale/i18n';

import { getStatusClosures } from 'src/core/store/modules/closures/selectors';
import { addClosure } from 'src/core/store/modules/closures/thunks';
import { TClosures } from 'src/core/models/closures';
import Fields from './Fields';

type TForm = {
	fetchList: () => void
	addEnable: boolean
}
const ensureFirstDayOfMonth = (closures: TClosures): TClosures => {
	if (closures.period !== null) {
		const yearMonth = closures.period.substring(0, 7);
		closures.period = yearMonth + "-01";
	}
	return closures;
};
const Form = ({ fetchList, addEnable }: TForm) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const status = useSelector(getStatusClosures)
	const onSubmit = async (
		values: TClosures,
		{ resetForm }: FormikHelpers<TClosures>
	) => {
		await dispatch(addClosure(ensureFirstDayOfMonth(values)));
		resetForm();
		fetchList();
	}

	const initialValues: TClosures = {
		status: '',
		period: null,
		startDateCompetence: null,
		endDateCompetence: null,
		dataHoraAgendamento: null,
	}

	return (
		<Panel title={t('closure:closingRoutine.title')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Fields />
							{
								addEnable && (
								<Grid item md={2} xs={12}>
									<Submit type="add" submitting={status === 'fetching'} />
								</Grid>
								)
							}
						</Grid>

					</form>
				)
				}
			</Formik>
		</Panel>
	);
};

export default Form;