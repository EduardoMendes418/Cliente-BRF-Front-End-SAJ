import { Formik } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { TextField, SelectField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';

import { TGuaranteeModalityParams } from 'src/core/store/modules/guarantee-modality/thunks';
import { usePagination } from 'src/hooks/pagination';
import { useGuaranteeMethod } from 'src/hooks/fetchLists';
import { getListFiltersGuaranteeModality, getLoadingGuaranteeModality } from 'src/core/store/modules/guarantee-modality/selectors';
import { actions } from 'src/core/store';
import { rejectNoValues } from 'src/core/utils/func';

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const { pageSize } = usePagination();
	const loading = useSelector(getLoadingGuaranteeModality)
	const savedFilters = useSelector(getListFiltersGuaranteeModality);

	const { guaranteeMethodAsOptions } = useGuaranteeMethod();

	const onSubmit = (values: TGuaranteeModalityParams) => {
		const result = rejectNoValues({ pageSize, ...values })
		dispatch(actions.guaranteeModality.setFilters(result));
	};

	const initialValues = {
		description: '',
		goodsGuaranteeMethodId: '',
		processType: '',
		...(savedFilters ?? {})
	} as TGuaranteeModalityParams

	return (
		<Panel title={t('goodsAndGuarantees:searchModalityTitle')} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, setSubmitting, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('goodsAndGuarantees:guaranteeModality')}
									name='description'
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t('goodsAndGuarantees:guaranteeMethod')}
									name='goodsGuaranteeMethodId'
									options={guaranteeMethodAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									label={t('Pagamentos:tipoPagamentoForm.processType')}
									name='processType'
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" disabled={!dirty && !submitCount} submitting={isSubmitting} />
							</Grid>
						</Grid>
						<Clean action='guaranteeModality' />
						{!loading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
