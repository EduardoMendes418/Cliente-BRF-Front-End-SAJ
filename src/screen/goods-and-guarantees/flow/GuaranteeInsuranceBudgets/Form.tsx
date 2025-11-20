import { Formik } from "formik";
import * as yup from 'yup';
import AddIcon from '@material-ui/icons/Add';
import { Box, Grid, IconButton } from "@material-ui/core";

import { DateField, TextField, RadioGroup, SelectField, TOptionsSelect } from "src/components/form";

import { t } from "src/locale/i18n";
import { dateValidator, numberValidator } from "src/core/utils/yup-validations";
import { TBudget } from "src/core/models/goods-guarantee-estimates";
import { useDispatch, useSelector } from "react-redux";
import { getGoodguaranteesCompanies } from "src/core/store/modules/goods-guarantee/selectors";
import { useEffect, useMemo } from "react";
import { fetchGoodGuarantiesCompanies } from "src/core/store/modules/goods-guarantee/thunks";

const validationSchema = yup.object({
	insuranceCompanyId: numberValidator,
	requestDate: dateValidator,
	observation: yup.string().notRequired()
});

const initialValues: TBudget = {
	id: 0,
	insuranceCompanyName: '',
	insuranceCompanyId: "",
	requestDate: null,
	observation: '',
	description: '',
	description02: '',
	description03: '',
	description04: '',
	files: [],
	isApproved: true
}

type TForm = {
	onAdd: Function;
}

export const Form = ({ onAdd }: TForm) => {
	const dispatch = useDispatch()

	const companies = useSelector(getGoodguaranteesCompanies);

	const onSubmit = (values: TBudget, { setSubmitting, resetForm }: any) => {
		values.insuranceCompanyName = companies.find(x => x.id === values.insuranceCompanyId)?.value ?? ""

		const isSuccessfulOperation = onAdd(values);
		if (isSuccessfulOperation) resetForm();
		setSubmitting(false);
	}

	useEffect(() => {
		dispatch(fetchGoodGuarantiesCompanies())
	}, [dispatch])

	const companiesOptions = useMemo<TOptionsSelect[]>(() => companies.slice().map(x => ({
		label: x.value,
		value: x.id
	})), [companies])

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			enableReinitialize
			onSubmit={onSubmit}
		>
			{({ handleSubmit }) => (
				<form noValidate>
					<Grid container spacing={2} alignItems='flex-start'>
						<Grid item xs={12} md={3}>
							<SelectField
								name='insuranceCompanyId'
								label={t('goodsAndGuarantees:tasks.brokerageName')}
								placeholder={t('form.typeHere')}
								options={companiesOptions}
								required
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<DateField
								name='requestDate'
								label={t('goodsAndGuarantees:tasks.date')}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<TextField
								name='observation'
								label={t('form.comments')}
								placeholder={t('form.typeHere')}
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<Box display="flex" justifyContent="space-between" alignItems="center">
								<RadioGroup name="isApproved" label={t('goodsAndGuarantees:form.favorite')} />
								<IconButton color="primary" onClick={() => handleSubmit()} type="button">
									<AddIcon />
								</IconButton>
							</Box>
						</Grid>
					</Grid>
				</form>
			)}
		</Formik>
	)
}

export default Form;