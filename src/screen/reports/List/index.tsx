import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';
import { t } from 'src/locale/i18n';
import {
	getLoadingReportConfiguration
} from 'src/core/store/modules/report-configuration/selectors';

import Search from './Search';
import List from './List';

const ReportConfiguration = () => {
	const { location: { pathname } } = useHistory();

	const loading = useSelector(getLoadingReportConfiguration)

	return (
		<ScreenTemplate slotTopRight={t('reports:createReportButton')}>
			<Search loading={loading} pathname={pathname} />
			<List loading={loading} pathname={pathname} />
		</ScreenTemplate>
	);
};

export default ReportConfiguration;
