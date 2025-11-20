import { useSelector } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';
import { useTranslation } from 'src/locale/i18n';

import { getListFiltersTaxRatesINSS, getLoadingTaxRatesINSS } from 'src/core/store/modules/tax-rates-inss/selectors';

import ValueParametersSearch from '../../components/ValueParametersSearch';
import List from './List'

const TaxRatesINSS = () => {
	const { t } = useTranslation();

	const loading = useSelector(getLoadingTaxRatesINSS);
	const filters = useSelector(getListFiltersTaxRatesINSS);

	return (
		<ScreenTemplate slotTopRight>
			<ValueParametersSearch
				title={t('settings:taxRatesINSS.titleSearch')}
				action='taxRatesINSS'
				loading={loading}
				savedFilters={filters}
			/>
			<List />
		</ScreenTemplate>
	);
}

export default TaxRatesINSS;
