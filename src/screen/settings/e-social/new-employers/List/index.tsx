import ScreenTemplate from 'src/components/Screen';
import Search from './Search'
import List from './List' 

const ESocialNewEmployers = () => {
	return (
		<ScreenTemplate slotTopRight>
		<Search/>
		<List/>
		</ScreenTemplate>
	);
};

export default ESocialNewEmployers;