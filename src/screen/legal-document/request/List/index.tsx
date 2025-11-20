import List from "./List";
import Search from "./Search";
import ScreenTemplate from "src/components/Screen";
import { useLocation } from "react-router-dom";
import { useTranslation } from "src/locale/i18n";

const Control = () => {
	const locate = useLocation();
	const { t } = useTranslation();

	return (
		<ScreenTemplate
			slotTopRight={t("legalDocs:buttonNew")}
		>
			<Search />
			<List pathname={locate.pathname} />
		</ScreenTemplate>
	);
};

export default Control;
