import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import Grid from '@material-ui/core/Grid';

import Form, { TextField } from 'src/components/form';
import { Submit } from 'src/components/button';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { useTranslation } from 'src/locale/i18n';

import {
	addFormOfCorrection,
	editFormOfCorrection,
} from 'src/core/store/modules/pensions/form-of-correction/thunks';
import {
	getFormOfCorrectionIsFetching,
	getFormOfCorrectionIsSaving,
	getFormOfCorrectionStatus,
} from 'src/core/store/modules/pensions/form-of-correction/selectors';
import { TFormOfCorrection } from 'src/core/models/pensions';
import { AppDispatch } from 'src/core/store';
import { textValidator } from 'src/core/utils/yup-validations';
import {
	useActionFormOfCorrection,
	useFormOfCorrectionInitialValues,
} from 'src/hooks/formOfCorrection';

const validationSchema = yup.object({ descricao: textValidator });

const FormOfCorrectionForm = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch<AppDispatch>();

	useActionFormOfCorrection();
	const initialValues = useFormOfCorrectionInitialValues();

	const isFetching = useSelector(getFormOfCorrectionIsFetching);
	const isSubmitting = useSelector(getFormOfCorrectionIsSaving);
	const statusSubmit = useSelector(getFormOfCorrectionStatus);

	const isNew = id === 'novo';
	const title = t(isNew ? 'tituloFormularioNovo' : 'tituloFormularioEdicao', {
		title: t('pension:request.configurations.formOfCorrection').toLowerCase(),
	});

	const handleSubmit = (form: TFormOfCorrection, { setSubmitting }: any) => {
		if (isNew) {
			dispatch(addFormOfCorrection(form));
		} else {
			dispatch(editFormOfCorrection({ ...form, id: Number(id) }));
		}
		setSubmitting(false);
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ handleSubmit, setSubmitting, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={title}
							slotBottomRight={<Submit submitting={isSubmitting} isNew={isNew} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							{!isFetching && (
								<Grid container spacing={2}>
									<Grid item md={3} xs={12}>
										<TextField
											label={t('pension:request.configurations.formOfCorrection')}
											name='descricao'
											inputProps={{ maxLength: 200 }}
											required
										/>
									</Grid>
								</Grid>
							)}
						</Panel>
						{statusSubmit === 'failure' && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default FormOfCorrectionForm;
