import List from "./List";
import Search from "./Search";
import ScreenTemplate from "src/components/Screen";

const Control = () => {
  return (
    <ScreenTemplate slotTopRight>
      <Search />
      <List />
    </ScreenTemplate>
  );
};

export default Control;
