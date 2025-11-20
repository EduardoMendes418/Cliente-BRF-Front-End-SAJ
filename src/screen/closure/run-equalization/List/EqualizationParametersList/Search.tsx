import { useDispatch, useSelector } from 'react-redux';

import DejurAreaFilter from 'src/components/DejurAreaFilter';
import { useTranslation } from 'src/locale/i18n';

import { getListFiltersEqualizationParameters, getLoadingEqualizationParameters } from 'src/core/store/modules/equalization-parameters/selectors';
import { actions } from 'src/core/store';
import { TDejurAreaFilter } from 'src/core/models';

const Search = ({ pathname }: { pathname: string }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const loading = useSelector(getLoadingEqualizationParameters);
	const savedFilters = useSelector(getListFiltersEqualizationParameters);

	const onSubmit = (values: TDejurAreaFilter) => {
		dispatch(actions.equalizationParameters.setFilters({ filters: values, page: pathname }));
	};

	return (
		<DejurAreaFilter
			title={t('settings:equalizationParameters.titleSearch')}
			isLoading={loading}
			handleSubmit={onSubmit}
			savedFilters={(savedFilters ?? {})[pathname]}
			action='equalizationParameters'
			pathname={pathname}
		/>
	);
};

export default Search;
