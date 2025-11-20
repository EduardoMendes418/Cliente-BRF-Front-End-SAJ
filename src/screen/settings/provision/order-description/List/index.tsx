import ScreenTemplate from 'src/components/Screen'
import { useTranslation } from 'src/locale/i18n';

import Search from './Search';
import List from './List';
const OrderDescription = () => {
	const { t } = useTranslation()
	return (
		<ScreenTemplate slotTopRight={t("provision:orderDescription.new")}>
			<Search />
			<List />
		</ScreenTemplate>
	)
}

export default OrderDescription;
