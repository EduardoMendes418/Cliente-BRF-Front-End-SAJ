import { useDispatch, useSelector } from 'react-redux';

import DejurAreaFilter from 'src/components/DejurAreaFilter';
import { useTranslation } from 'src/locale/i18n';

import { getListFiltersCivilMass, getLoadingCivilMass } from 'src/core/store/modules/civil-mass/selectors';
import { actions } from 'src/core/store';
import { TDejurAreaFilter } from 'src/core/models';

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const loading = useSelector(getLoadingCivilMass);
	const savedFilters = useSelector(getListFiltersCivilMass);

	const onSubmit = (values: TDejurAreaFilter) => {
		dispatch(actions.civilMass.setFilters(values));
	};

	return (
		<DejurAreaFilter
			title={t('settings:defaultOrderValue.titleSearch')}
			isLoading={loading}
			handleSubmit={onSubmit}
			savedFilters={savedFilters}
			action='civilMass'
		/>
	);
};

export default Search;
