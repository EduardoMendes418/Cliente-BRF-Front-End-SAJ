import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { SelectField } from 'src/components/form';
import { Submit, Clean } from 'src/components/button';
import { useTranslation } from 'src/locale/i18n';
import {
	getListFormulaCorrectionRuleAsOptions,
	getLoadingFormulaCorrectionRule
} from 'src/core/store/modules/formula-correction-rule/selectors';
import { actions, AppDispatch } from 'src/core/store';
import { useEffect } from 'react';
import { fetchFormulaCorrectionRuleOptions } from 'src/core/store/modules/formula-correction-rule/thunks';

const statusAsOptions = [
	{ value: 'true', label: 'Ativo' },
	{ value: 'false', label: 'Inativo' }
];

const Search = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();

	const loading = useSelector(getLoadingFormulaCorrectionRule);
	const formulaCorrectionRulesAsOptions = useSelector(getListFormulaCorrectionRuleAsOptions);

	useEffect(() => {
		dispatch(fetchFormulaCorrectionRuleOptions({}))
	}, [dispatch])

	const onSubmit = ({ id, status }: { id: number | "", status?: string | "" }) => {
		dispatch(actions.formulaCorrectionRule.setFilters({ id, isActive: status }));
	};

	return (
		<Panel title={t('settings:formulaCorrectionRule.titleSearch')} withPadding>
			<Formik
				initialValues={{id: '', status: ''}}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, setSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t('settings:formulaCorrectionRule.form.formulaName')}
									name='id'
									options={formulaCorrectionRulesAsOptions.sort((x, y) => {
										return x.label.toString().localeCompare(y.label.toString())
									})}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
							 <SelectField
									label={t('settings:formulaCorrectionRule.form.status')}
									name='status'
									options={statusAsOptions}
								/>
								</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" submitting={loading || isSubmitting} />
							</Grid>
						</Grid>
						<Clean  action='formulaCorrectionRule' />
						{!loading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
