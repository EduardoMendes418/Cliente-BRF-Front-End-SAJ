import { useSelector } from 'react-redux';

import ScreenTemplate from 'src/components/Screen';
import { getLoadingAgreementAuthorization } from 'src/core/store/modules/agreement-authorization/selectors';

import Search from './Search';
import List from './List';

const AgreementAuthorization = () => {

	const loading = useSelector(getLoadingAgreementAuthorization)

	return (
		<ScreenTemplate slotTopRight>
			<Search loading={loading} />
			<List loading={loading} />
		</ScreenTemplate>
	);
};

export default AgreementAuthorization;
