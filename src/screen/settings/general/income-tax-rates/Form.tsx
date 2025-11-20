import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldArray } from 'formik';
import { useParams } from 'react-router-dom';
import { pick } from 'ramda';
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
	getIncomeTaxRates,
	addIncomeTaxRates,
	editIncomeTaxRates,
} from 'src/core/store/modules/income-tax-rates/thunks';
import {
	getItemIncomeTaxRates,
	getLoadingIncomeTaxRates,
	getStatusIncomeTaxRates as getStatus,
	getErrorMessageIncomeTaxRates as getErrorMessage,
} from 'src/core/store/modules/income-tax-rates/selectors';
import { TIncomeTaxRates } from 'src/core/models/income-tax-rates';
import { useRegisterDefault } from 'src/hooks';
import { valuesToNumber } from 'src/core/utils/func';
import { actions } from 'src/core/store';
import moment from 'moment';

const validate = (values: TIncomeTaxRates) => {
	const initialDate = moment(values.initialDate)
	const finalDate = moment(values.finalDate)

	if (initialDate.isValid() && finalDate.isValid() && initialDate.isAfter(finalDate))
		return { finalDate: 'Data deve ser maior que vigência inicial' }
}

const IncomeTaxRatesForm = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();

	const item = useSelector(getItemIncomeTaxRates);
	const loading = useSelector(getLoadingIncomeTaxRates);
	const statusSubmit = useSelector(getStatus);

	const isNew = id === 'novo';
	const initialValues: TIncomeTaxRates = {
		initialDate: item.initialDate ?? null,
		finalDate: item.finalDate ?? null,
		incomeTaxRateValues: item.incomeTaxRateValues
			? item.incomeTaxRateValues.map(pick([
				'initialValue',
				'finalValue',
				'aliquot',
				'portion',
			]))
			: [],
	}

	useEffect(() => {
		if (id && !isNew) dispatch(getIncomeTaxRates(Number(id)));
		return () => { dispatch(actions.incomeTaxRates.clear()) };
	}, [dispatch, id, isNew]);

	useRegisterDefault({
		action: 'incomeTaxRates',
		getStatus,
		getErrorMessage,
	})

	const onSubmit = ({ incomeTaxRateValues, ...values }: TIncomeTaxRates) => {
		const normalizedValues = {
			...values,
			incomeTaxRateValues: incomeTaxRateValues.map(item => valuesToNumber([
				'initialValue',
				'finalValue',
				'aliquot',
				'portion',
			], item))
		} as TIncomeTaxRates
		if (isNew) dispatch(addIncomeTaxRates(normalizedValues));
		else dispatch(editIncomeTaxRates({ ...normalizedValues, id: Number(id) }));
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				validate={validate}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, setSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t('Pagamentos:incomeTaxRates.form.title')}
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
										label={t('Pagamentos:incomeTaxRates.initialDate')}
										placeholder={t('select')}
										required
									/>
								</Grid>
								<Grid item md={3}>
									<DateField
										name="finalDate"
										label={t('Pagamentos:incomeTaxRates.finalDate')}
										placeholder={t('select')}
										required
									/>
								</Grid>
							</Grid>
							<br />
							<TableContainer>
								<Table>
									<TableHead>
										<TableRow data-testid="table-row-header">
											<TableCell component="th">
												{t('Pagamentos:incomeTaxRates.form.calculationBase')}
											</TableCell>
											<TableCell component="th">
												{t('Pagamentos:incomeTaxRates.form.aliquot')}
											</TableCell>
											<TableCell component="th">
												{t('Pagamentos:incomeTaxRates.form.portion')}
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<FieldArray name="incomeTaxRateValues">
											{() => Array(5).fill(null).map((_, index) => (
												<TableRow key={`tablerow_${index}`}>
													<TableCell component="td">
														<Grid container spacing={2} alignItems="flex-start">
															<Grid item md={6}>
																<CurrencyField
																	label="De"
																	name={`incomeTaxRateValues.${index}.initialValue`}
																/>
															</Grid>
															<Grid item md={6}>
																<CurrencyField
																	label="Até"
																	name={`incomeTaxRateValues.${index}.finalValue`}
																/>
															</Grid>
														</Grid>
													</TableCell>
													<TableCell component="td">
														<PercentageField
															label="%"
															name={`incomeTaxRateValues.${index}.aliquot`}
															noSymbol
														/>
													</TableCell>
													<TableCell component="td">
														<CurrencyField
															label="R$"
															name={`incomeTaxRateValues.${index}.portion`}
															noSymbol
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


export default IncomeTaxRatesForm;
