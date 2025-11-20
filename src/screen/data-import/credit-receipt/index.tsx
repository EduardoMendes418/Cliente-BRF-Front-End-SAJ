import { MULTIPLE_FILES_TYPE } from 'src/core/models/data-import';
import { useTranslation } from 'src/locale/i18n';

import DataImportMultipleFilesForm from '../components/DataImportMultipleFilesForm';

const DataImportCreditReceipt = () => {
	const { t } = useTranslation();

	return (
		<DataImportMultipleFilesForm
			type={MULTIPLE_FILES_TYPE.CREDIT_RECEIPT}
			fileName={"credit_receipt.csv"}
			labelFormFile={t('dataImport:creditReceipt.panelImport')}
			labelFileAttachments={t('dataImport:creditReceipt.panelReceipt')}
		/>
	);
}
export default DataImportCreditReceipt;