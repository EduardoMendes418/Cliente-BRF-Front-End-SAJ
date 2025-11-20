import ScreenTemplate from 'src/components/Screen'
import Search from './Search';
import List from './List';
import { useTranslation } from 'src/locale/i18n'

const OrderExpectation = () => {
	const { t } = useTranslation()
	return (
		<ScreenTemplate slotTopRight={t("provision:orderExpectation.new")}>
			<Search />
			<List />
		</ScreenTemplate>
	)
}

export default OrderExpectation;