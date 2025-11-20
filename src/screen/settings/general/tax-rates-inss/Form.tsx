import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldArray } from 'formik';
import { useParams } from 'react-router-dom';
import { pick } from 'ramda';
import moment from 'moment';
import {
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@material-ui/core';

import Form, { DateField, CurrencyField, PercentageField } from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';

import { useTranslation } from 'src/locale/i18n';
import {
	getTaxRatesINSS,
	addTaxRatesINSS,
	editTaxRatesINSS,
} from 'src/core/store/modules/tax-rates-inss/thunks';
import {
	getItemTaxRatesINSS,
	getLoadingTaxRatesINSS,
	getStatusTaxRatesINSS as getStatus,
	getErrorMessageTaxRatesINSS as getErrorMessage,
} from 'src/core/store/modules/tax-rates-inss/selectors';
import { TTaxRatesINSS } from 'src/core/models/tax-rates-inss';
import { toNumber, valuesToNumber } from 'src/core/utils/func';
import { actions } from 'src/core/store';
import { useRegisterDefault } from 'src/hooks';

const inssValueFields = ['initialValue', 'finalValue', 'aliquot'];

const validate = (values: TTaxRatesINSS) => {
	const initialDate = moment(values.initialDate)
	const finalDate = moment(values.finalDate)

	if (initialDate.isValid() && finalDate.isValid() && initialDate.isAfter(finalDate))
		return { finalDate: 'Data deve ser maior que vigência inicial' }
}

const TaxRatesINSSForm = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();

	const item = useSelector(getItemTaxRatesINSS);
	const loading = useSelector(getLoadingTaxRatesINSS);
	const statusSubmit = useSelector(getStatus);

	const isNew = id === 'novo';

	const initialValues: TTaxRatesINSS = {
		initialDate: item.initialDate ?? null,
		finalDate: item.finalDate ?? null,
		taxRatesINSSValues: item.taxRatesINSSValues
			? item.taxRatesINSSValues.map(pick(inssValueFields))
			: Array(4).fill({ initialValue: 0, finalValue: 0, aliquot: 0 }),
	}

	useEffect(() => {
		if (id && !isNew) dispatch(getTaxRatesINSS(Number(id)));
		return () => { dispatch(actions.taxRatesINSS.clear()) };
	}, [dispatch, id, isNew]);

	useRegisterDefault({
		action: 'taxRatesINSS',
		getStatus,
		getErrorMessage,
	})

	const onSubmit = ({ taxRatesINSSValues, ...taxRatesINSS }: TTaxRatesINSS) => {
		const normalizedValues = {
			...taxRatesINSS,
			taxRatesINSSValues: taxRatesINSSValues.map(item => valuesToNumber(inssValueFields, item))
		} as TTaxRatesINSS

		if (isNew) dispatch(addTaxRatesINSS(normalizedValues));
		else dispatch(editTaxRatesINSS({ ...normalizedValues, id: Number(id) }));
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				validate={validate}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, setSubmitting, values }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t('settings:taxRatesINSS.titleForm')}
							slotBottomRight={
								<Submit
									isNew={isNew}
									submitting={isSubmitting || loading}
									disabled={!dirty}
								/>
							}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							withPadding
						>
							<Grid container spacing={2}>
								<Grid item md={3}>
									<DateField
										name="initialDate"
										label={t('settings:shared.initialDate')}
										placeholder={t('select')}
										required
									/>
								</Grid>
								<Grid item md={3}>
									<DateField
										name="finalDate"
										label={t('settings:shared.finalDate')}
										placeholder={t('select')}
									/>
								</Grid>
							</Grid>
							<br />
							<TableContainer>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell component="th">
												{t('settings:taxRatesINSS.form.taxpayerSalary')}
											</TableCell>
											<TableCell component="th">
												{t('settings:shared.aliquot')}
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<FieldArray name="taxRatesINSSValues">
											{() => Array(4).fill(null).map((_, index) => (
												<TableRow key={`tablerow_${index}`}>
													<TableCell component="td">
														<Grid container spacing={2} alignItems="flex-start">
															<Grid item md={6}>
																<CurrencyField
																	label="De"
																	name={`taxRatesINSSValues.${index}.initialValue`}
																	min={0.01}
																	required
																/>
															</Grid>
															<Grid item md={6}>
																<CurrencyField
																	label="Até"
																	name={`taxRatesINSSValues.${index}.finalValue`}
																	min={toNumber(values.taxRatesINSSValues[index].initialValue) || 0.01}
																	required
																/>
															</Grid>
														</Grid>
													</TableCell>
													<TableCell component="td">
														<PercentageField
															label="%"
															name={`taxRatesINSSValues.${index}.aliquot`}
															noSymbol
															required
														/>
													</TableCell>
												</TableRow>
											))}
										</FieldArray>
									</TableBody>
								</Table>
							</TableContainer>
							{statusSubmit === 'failure' && isSubmitting && setSubmitting(false)}
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};


export default TaxRatesINSSForm;
