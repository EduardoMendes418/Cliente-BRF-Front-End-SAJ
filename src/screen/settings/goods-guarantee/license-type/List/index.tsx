import ScreenTemplate from 'src/components/Screen'

import Search from './Search';
import List from './List';

const LicenseType = () => {
	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	)
}

export default LicenseType
