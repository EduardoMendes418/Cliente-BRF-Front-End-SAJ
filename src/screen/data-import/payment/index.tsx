import { MULTIPLE_FILES_TYPE } from "src/core/models/data-import";
import { useTranslation } from 'src/locale/i18n';

import DataImportPaymentFilesForm from "../components/DataImportPaymentFilesForm";

const DataImportPayment = () => {
	const { t } = useTranslation();

	return (
		<DataImportPaymentFilesForm
			type={MULTIPLE_FILES_TYPE.PAYMENT}
			fileName={"carga-pagamento-template.csv"}
			labelFormFile={t('dataImport:payment.panelImport')}
			labelFileAttachments={t('dataImport:payment.panelReceipt')}
			
		/>
	);
}
export default DataImportPayment;