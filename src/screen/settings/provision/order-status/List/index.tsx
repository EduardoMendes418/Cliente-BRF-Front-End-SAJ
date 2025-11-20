import ScreenTemplate from 'src/components/Screen'
import Search from './Search';
import List from './List';
import { useTranslation } from 'src/locale/i18n'

const OrderStatus = () => {
	const { t } = useTranslation()
	return (
		<ScreenTemplate slotTopRight={t("provision:orderStatus.new")}>
			<Search />
			<List />
		</ScreenTemplate>
	)
}

export default OrderStatus;