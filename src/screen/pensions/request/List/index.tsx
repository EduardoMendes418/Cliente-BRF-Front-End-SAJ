import ScreenTemplate from 'src/components/Screen';
import SeekRequestForm from './SeekRequestForm';
import List from './List'
import { useTranslation } from 'src/locale/i18n';
import { useHistory } from 'react-router-dom';

const RequestPensions = () => {
	const { t } = useTranslation();
	const {
		location: { pathname },
	} = useHistory();

	return (
		<ScreenTemplate slotTopRight={t('pension:request.buttonNew')}>
			<SeekRequestForm />
			<List pathname={pathname} />
		</ScreenTemplate>
	);
};

export default RequestPensions;
