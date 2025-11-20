import Grid from '@material-ui/core/Grid';
import { FormikHelpers } from 'formik';

import Form, { NumericField } from 'src/components/form';
import Panel from 'src/components/Panel';
import ScreenTemplate from 'src/components/Screen';
import { Submit } from 'src/components/button';

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
import {
	getLoadingParameterization,
	getParameterizationItems,
} from 'src/core/store/modules/parameterization/selectors';

const PrazoDiasFinanceiroConfig = () => {
	useActionParameterization();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(fetchParameterization(['prazoDiasFinanceiro']));
		return () => {
			dispatch(actions.parameterization.clear());
		};
	}, [dispatch]);

	const isFetching = useSelector(getLoadingParameterization);
	const { prazoDiasFinanceiro } = useSelector(getParameterizationItems);
	const initialValues = {
		prazoDiasFinanceiro: prazoDiasFinanceiro?.toString() ?? '',
	};

	const onSubmit = (
		values: { prazoDiasFinanceiro: string },
		{ setSubmitting }: FormikHelpers<{ prazoDiasFinanceiro: string }>
	) => {
		const params = {
			name: 'prazoDiasFinanceiro',
			value: values.prazoDiasFinanceiro,
		};
		dispatch(editParameterization(params));
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
							title={t('Pagamentos:prazoDiasFinanceiro.title')}
							loading={isFetching}
							slotBottomRight={<Submit disabled={!dirty} />}
							slotBottonRightPermission='edit'
							withPadding
							cancelAndGoBack
						>
							<Grid container>
								<Grid item sm={12} md={3}>
									<NumericField
										fullWidth
										required
										name='prazoDiasFinanceiro'
										label={t('Pagamentos:prazoDiasFinanceiro.label')}
										maxLength={5}
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

export default PrazoDiasFinanceiroConfig;
