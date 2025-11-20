import ScreenTemplate from 'src/components/Screen';

import List from './List'
import Search from './Search'

const EqualizationParameters = () => {
	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	);
}

export default EqualizationParameters;
