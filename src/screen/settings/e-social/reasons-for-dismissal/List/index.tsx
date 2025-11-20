import ScreenTemplate from 'src/components/Screen';
import Search from './Search'
import List from './List' 

const ESocialReasonsForDismissal = () => {
	return (
		<ScreenTemplate slotTopRight>
		<Search/>
		<List/>
		</ScreenTemplate>
	);
};

export default ESocialReasonsForDismissal;