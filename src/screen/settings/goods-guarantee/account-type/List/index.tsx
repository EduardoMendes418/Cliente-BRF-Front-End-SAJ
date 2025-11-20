import ScreenTemplate from 'src/components/Screen'
import List from './List';
import Search from './Search';

const AccountType = () => {
	return (
		<ScreenTemplate slotTopRight>
			<Search />
			<List />
		</ScreenTemplate>
	)
}

export default AccountType