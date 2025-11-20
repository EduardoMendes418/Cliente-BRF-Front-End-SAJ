import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Grid } from '@material-ui/core';

import { DateField, TextField, RadioGroup } from 'src/components/form';
import { Submit } from 'src/components/button';
import { t } from 'src/locale/i18n';

import { dateValidator, textValidator } from 'src/core/utils/yup-validations';
import { TBudget } from 'src/core/models/goods-guarantee-estimates';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { actions } from 'src/core/store';

const validationSchema = yup.object({
	insuranceCompanyName: textValidator,
	requestDate: dateValidator,
	observation: yup.string().notRequired()
});

type TFormEditModal = {
	initialValues: TBudget;
	onSubmitEdit: any;
}

const FormEditModal = ({ initialValues, onSubmitEdit }: TFormEditModal) => {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);

	const onSubmit = (values: TBudget) => {
		onSubmitEdit(values);
		dispatch(actions.modal.close({ modalId }));
	}

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			enableReinitialize
			onSubmit={onSubmit}
		>
			{({ handleSubmit, dirty }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={2} alignItems='flex-start'>
						<Grid item xs={12} md={4}>
							<TextField
								name='insuranceCompanyName'
								label={t('goodsAndGuarantees:tasks.brokerageName')}
								placeholder={t('form.typeHere')}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<DateField
								name='requestDate'
								label={t('goodsAndGuarantees:tasks.date')}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<TextField
								name='observation'
								label={t('form.comments')}
								placeholder={t('form.typeHere')}
							/>
						</Grid>
						<Grid item xs={12} md={12}>
							<RadioGroup name="isApproved" label={t('goodsAndGuarantees:form.favorite')} />
						</Grid>
					</Grid>
					<Grid
						container
						direction='row'
						justifyContent='flex-end'
						className='margin-top-24'
					>
						<Submit disabled={!dirty} />
					</Grid>
				</form>
			)}
		</Formik>
	)
}

export default FormEditModal;