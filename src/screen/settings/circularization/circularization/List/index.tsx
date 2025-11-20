import ScreenTemplate from 'src/components/Screen';
import Search from './Search'
import List from './List' 

const Circularization = () => {
	return (
		<ScreenTemplate slotTopRight>
		<Search/>
		<List/>
		</ScreenTemplate>
	);
};

export default Circularization;
