import ScreenTemplate from 'src/components/Screen'
import { useTranslation } from 'src/locale/i18n'
import Panel from 'src/components/Panel';

import Search from './Search'
import List from './List'

const OrderConfrontingParameters = () => {
	const { t } = useTranslation();

	return (
		<ScreenTemplate slotTopRight={t("provisions:orderConfrontingParameters.new")}>
			<Panel title={t('provisions:orderConfrontingParameters.searchTitle')}>
				<div className="panel-content">
					<Search />
				</div>
			</Panel>
			<List />
		</ScreenTemplate>
	)
}

export default OrderConfrontingParameters;