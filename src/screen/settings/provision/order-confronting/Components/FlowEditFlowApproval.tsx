import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { Formik } from 'formik';
import * as yup from 'yup';


import { SelectField, TOptionsSelect } from 'src/components/form'
import { Submit } from 'src/components/button'

import { t } from 'src/locale/i18n';

import { getLastModalOpen } from 'src/core/store/modules/modals/selectors'
import { actions } from 'src/core/store';

import { flowOptions } from '../utils/constants';

type TFieldsAdd = {
	flowTypeEdit: string,
	hierarchyEdit: string,
	confrontingParameterId?: number | string,
	transcienteId: number,
	id: number,
}

type FormEditFlowApprovalProps = {
	optionsField: TOptionsSelect[];
	initialValues: TFieldsAdd;
	onSubmitEdit: any;
}

const validationSchema = yup.object({
	flowTypeEdit: yup.string().required(t('required')),
	hierarchyEdit: yup.string().required(t('required')),
});

const FormEditFlowApproval = ({
	initialValues,
	onSubmitEdit,
	optionsField,
}: FormEditFlowApprovalProps) => {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);

	const onSubmit = (values: TFieldsAdd, { setFieldError, setSubmitting }: any) => {
		const normalizedValues = {
			...values,
			flowTypeEdit: values.flowTypeEdit,
			hierarchyEdit: values.hierarchyEdit,
		}

		if (onSubmitEdit(normalizedValues)) {
			dispatch(actions.modal.close({ modalId }));
		} else {
			setFieldError('hierarchy', t('provisions:orderConfrontingParameters.flowAlreadyRegistered'))
			setSubmitting(false)
		}
	}

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
			enableReinitialize
		>
			{({ handleSubmit, dirty, isSubmitting }) => (
				<form onSubmit={handleSubmit} noValidate className="modal-form" >
					<Grid container spacing={3} >
						<Grid item lg={6} >
							<SelectField
								name="flowTypeEdit"
								label={t('provisions:orderConfrontingParameters.flowType')}
								options={flowOptions}
								required
							/>
						</Grid>
						< Grid item lg={6} >
							<SelectField
								name="hierarchyEdit"
								label={t('provisions:orderConfrontingParameters.flowHierarchyType')}
								options={optionsField}
								required
							/>
						</Grid>
					</Grid>
					< Grid
						container
						direction='row'
						justifyContent='flex-end'
						className='margin-top-24'
					>
						<Submit text={t('btnSalvarEdicao')} submitting={isSubmitting} disabled={!dirty} />
					</Grid>
				</form>
			)}
		</Formik>
	)
}

export default FormEditFlowApproval
