import { useHistory } from "react-router-dom";
import ScreenTemplate from "src/components/Screen";
import Search from "./Search";
//import List from "./List";

const Contacts = () => {
	const {
		location: { pathname },
	} = useHistory();

	return (
		<ScreenTemplate>
			<Search pathname={pathname} />
			{/*<List pathname={pathname} />*/}
		</ScreenTemplate>
	);
};

export default Contacts;
