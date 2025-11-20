import ScreenTemplate from 'src/components/Screen';
import Search from './Search'
import List from './List' 

const ESocialWorkerCategory = () => {
	return (
		<ScreenTemplate slotTopRight>
		<Search/>
		<List/>
		</ScreenTemplate>
	);
};

export default ESocialWorkerCategory;
