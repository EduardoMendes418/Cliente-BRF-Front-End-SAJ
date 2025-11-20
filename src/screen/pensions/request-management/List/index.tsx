import ScreenTemplate from "src/components/Screen";

import List from "./List";
import Search from "./Search";

const RequestManagement = () => {
    return (
        <ScreenTemplate>
            <Search />
            <List />
        </ScreenTemplate>
    );
};

export default RequestManagement;
