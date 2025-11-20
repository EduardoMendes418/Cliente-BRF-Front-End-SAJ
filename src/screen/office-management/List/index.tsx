import List from "./List";
import Search from "./Search";
import ScreenTemplate from "src/components/Screen";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import {
  getOfficeManagementType,
  OfficeManagementTypeEnum,
} from "../utils/getOfficeManagementType";

const Control = () => {
  const locate = useLocation();
  const [stage] = useState(getOfficeManagementType(locate.pathname));

  return (
    <ScreenTemplate
      slotTopRight={stage === OfficeManagementTypeEnum.requestPayment}
    >
      <Search />
      <List pathname={locate.pathname} />
    </ScreenTemplate>
  );
};

export default Control;
