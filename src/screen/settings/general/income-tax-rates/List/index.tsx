import { useSelector } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';
import { useTranslation } from 'src/locale/i18n';

import { getListFiltersIncomeTaxRates, getLoadingIncomeTaxRates } from 'src/core/store/modules/income-tax-rates/selectors';

import ValueParametersSearch from '../../components/ValueParametersSearch';
import List from './List'

const IncomeTaxRates = () => {
	const { t } = useTranslation();

	const loading = useSelector(getLoadingIncomeTaxRates);
	const filters = useSelector(getListFiltersIncomeTaxRates)

	return (
		<ScreenTemplate slotTopRight>
			<ValueParametersSearch
				title={t('Pagamentos:incomeTaxRates.titleSearch')}
				action='incomeTaxRates'
				loading={loading}
				savedFilters={filters}
			/>
			<List />
		</ScreenTemplate>
	);
}

export default IncomeTaxRates;
