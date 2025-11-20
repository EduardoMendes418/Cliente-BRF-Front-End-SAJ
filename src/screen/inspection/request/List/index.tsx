import { useHistory } from "react-router-dom";
import ScreenTemplate from "src/components/Screen";
import Search from "./Search";
import List from "./List";
import { useTranslation } from "src/locale/i18n";

const PaymentRequest = () => {
  const { t } = useTranslation();
  const {
    location: { pathname },
  } = useHistory();

  return (
    <ScreenTemplate slotTopRight={t("solicitacaoPagamento:buttonNew")}>
      <Search pathname={pathname} />
      <List pathname={pathname} />
    </ScreenTemplate>
  );
};

export default PaymentRequest;
