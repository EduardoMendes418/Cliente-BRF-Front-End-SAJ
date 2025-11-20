import Grid from '@material-ui/core/Grid';
import { FormikHelpers } from 'formik';

import Form, { NumericField, PercentageField } from 'src/components/form';
import Panel from 'src/components/Panel';
import ScreenTemplate from 'src/components/Screen';
import { t } from 'src/locale/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/core/store';
import {
	editParameterization,
	fetchParameterization,
} from 'src/core/store/modules/parameterization/thunks';
import { useActionParameterization } from 'src/hooks/parameterization';
import { useEffect } from 'react';
import { actions } from 'src/core/store';
import { getParameterizationItems } from 'src/core/store/modules/parameterization/selectors';
import { toNumber } from 'src/core/utils/func';
import { Submit } from 'src/components/button';

type TIndex = {
	indiceInssGpsRatAjustado: number;
	indiceInssGpsReclamado: number;
	indiceInssGpsRat: number;
	indiceInssGpsOutrasEntidades: number;
}

const IndiceInssGpsConfig = () => {
	useActionParameterization();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(
			fetchParameterization([
				'indiceInssGpsRatAjustado',
				'indiceInssGpsReclamado',
				'indiceInssGpsRat',
				'indiceInssGpsOutrasEntidades',
			])
		);
		return () => {
			dispatch(actions.parameterization.clear());
		};
	}, [dispatch]);

	const {
		indiceInssGpsRatAjustado,
		indiceInssGpsReclamado,
		indiceInssGpsRat,
		indiceInssGpsOutrasEntidades,
	} = useSelector(getParameterizationItems);

	const initialValues = {
		indiceInssGpsRatAjustado: Number(indiceInssGpsRatAjustado) ?? 0,
		indiceInssGpsReclamado: Number(indiceInssGpsReclamado) ?? 0,
		indiceInssGpsRat: Number(indiceInssGpsRat) ?? 0,
		indiceInssGpsOutrasEntidades: Number(indiceInssGpsOutrasEntidades) ?? 0,
	};

	const onSubmit = (
		values: TIndex,
		{ setSubmitting }: FormikHelpers<TIndex>
	) => {
		const params = [
			{
				name: 'indiceInssGpsRatAjustado',
				value: toNumber(values.indiceInssGpsRatAjustado).toString(),
			},
			{
				name: 'indiceInssGpsReclamado',
				value: toNumber(values.indiceInssGpsReclamado).toString(),
			},
			{
				name: 'indiceInssGpsRat',
				value: toNumber(values.indiceInssGpsRat).toString(),
			},
			{
				name: 'indiceInssGpsOutrasEntidades',
				value: toNumber(values.indiceInssGpsOutrasEntidades).toString(),
			},
		];
		params.forEach((param) => {
			dispatch(editParameterization(param));
		});
		setSubmitting(false)
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t('Pagamentos:indiceInssGps.title')}
							slotBottomRight={<Submit disabled={!dirty} />}
							slotBottonRightPermission='edit'
							withPadding
							cancelAndGoBack
						>
							<Grid container spacing={2}>
								<Grid item sm={12} md={3}>
									<PercentageField
										fullWidth
										required
										name='indiceInssGpsReclamado'
										label={t('Pagamentos:indiceInssGps.reclamado')}
									/>
								</Grid>
								<Grid item sm={12} md={3}>
									<PercentageField
										fullWidth
										required
										name='indiceInssGpsRat'
										label={t('Pagamentos:indiceInssGps.rat')}
									/>
								</Grid>
								<Grid item sm={12} md={3}>
									<NumericField
										fullWidth
										required
										name='indiceInssGpsRatAjustado'
										label={t('Pagamentos:indiceInssGps.ratAjustado')}
									/>
								</Grid>
								<Grid item sm={12} md={3}>
									<PercentageField
										fullWidth
										required
										name='indiceInssGpsOutrasEntidades'
										label={t('Pagamentos:indiceInssGps.outrasEntidades')}
									/>
								</Grid>
							</Grid>
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default IndiceInssGpsConfig;
