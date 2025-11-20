import ScreenTemplate from 'src/components/Screen';

import EqualizationParametersList from './EqualizationParametersList';
import ExecutedEqualizationsList from './ExecutedEqualizationsList';

const RunEqualizationList = () => (
	<ScreenTemplate>
		<EqualizationParametersList />
		<ExecutedEqualizationsList />
	</ScreenTemplate>
);

export default RunEqualizationList;
