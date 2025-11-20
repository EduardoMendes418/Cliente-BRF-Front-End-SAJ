import Grid from '@material-ui/core/Grid';
import { FormikHelpers } from 'formik';

import Form, { PercentageField } from 'src/components/form';
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
import { actions } from 'src/core/store';
import { useEffect } from 'react';
import { getParameterizationItems } from 'src/core/store/modules/parameterization/selectors';
import { toNumber } from 'src/core/utils/func';
import { Submit } from 'src/components/button';
import CancelButton from 'src/components/button/Cancel';

const IndiceFgtsConfig = () => {
	useActionParameterization();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(fetchParameterization(['indiceFgts']));
		return () => {
			dispatch(actions.parameterization.clear());
		};
	}, [dispatch]);

	const { indiceFgts } = useSelector(getParameterizationItems);
	const initialValues = { indiceFgts: Number(indiceFgts) ?? 0 };

	const onSubmit = (
		values: { indiceFgts: number },
		{ setSubmitting }: FormikHelpers<{ indiceFgts: number }>
	) => {
		const params = {
			name: 'indiceFgts',
			value: toNumber(values.indiceFgts).toString(),
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
							title={t('Pagamentos:indiceFgts.title')}
							slotBottomRight={<Submit disabled={!dirty} />}
							slotBottonRightPermission='edit'
							withPadding
							cancelAndGoBack
						>
							<Grid container>
								<Grid item sm={12} md={3}>
									<PercentageField
										fullWidth
										required
										name='indiceFgts'
										label={t('Pagamentos:indiceFgts.label')}
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

export default IndiceFgtsConfig;
