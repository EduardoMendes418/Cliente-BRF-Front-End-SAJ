import ScreenTemplate from 'src/components/Screen'
import Search from './Search';
import List from './List';
import { t } from 'src/locale/i18n'

const orderRatingDescription = () => {
	return (
		<ScreenTemplate slotTopRight={t("provision:orderRatingDescription.new")}>
			<Search />
			<List />
		</ScreenTemplate>
	)
}

export default orderRatingDescription;