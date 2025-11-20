import * as yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { Submit } from 'src/components/button';
import { t } from 'src/locale/i18n';
import TextField from 'src/components/form/TextField';
import Panel from 'src/components/Panel';
import { actions } from 'src/core/store';
import { fetchProcessFolder } from 'src/core/store/modules/process/thunks';
import SearchInfo from 'src/components/SearchInfo';
import { getProcessError } from 'src/core/store/modules/process/selectors';

const validationSchema = yup.object({
	folderNumber: yup.string().required(t('pension:request.validations.folderNumber')),
});

type Props = {
	folderNumber: string;
	readOnly: boolean;
	loading: boolean;
	closed: boolean;
};

const SeekPensionsForm = ({ folderNumber, readOnly, loading, closed }: Props) => {
	const dispatch = useDispatch();

	const error = useSelector(getProcessError);

	const onSubmit = (
		values: { folderNumber: string },
		{ setSubmitting }: FormikHelpers<{ folderNumber: string }>,
	) => {
		if (values.folderNumber !== folderNumber) {
			dispatch(actions.process.clear());
			dispatch(fetchProcessFolder({ folderNumber: values.folderNumber }));
		}
		setSubmitting(false)
	};

	return (
		<Panel title={t('pension:request.form.title')} withPadding>
			<Formik
				enableReinitialize
				initialValues={{ folderNumber: folderNumber ?? '' }}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2} alignItems='flex-start'>
							<Grid item xs={10} md={3}>
								<TextField
									required
									name='folderNumber'
									label={t('form.CTGFolder')}
									readOnly={readOnly}
								/>
							</Grid>
							{!readOnly && (
								<Grid item xs={2}>
									<Submit type="search" disabled={!!folderNumber || !dirty} submitting={loading} />
								</Grid>
							)}
						</Grid>
					</form>
				)}
			</Formik>
			{!loading && <SearchInfo closed={closed} error={error} />}
		</Panel>
	);
};

export default SeekPensionsForm;
