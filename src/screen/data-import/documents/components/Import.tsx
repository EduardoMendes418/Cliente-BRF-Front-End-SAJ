import { useState } from 'react';
import { Button, Box } from '@material-ui/core';

import { TDataImport } from 'src/core/models/data-import';
import { useTranslation } from 'src/locale/i18n';

import ImportErrors from '../../components/ImportErrors';
import FormImport from "src/screen/data-import/components/FormImportMultipleAttachments";

type Props = {
	onImportSubmit: (values: TDataImport) => void;
	setIsImportScreen: any
}
const Import = ({ onImportSubmit, setIsImportScreen }: Props) => {
	const { t } = useTranslation();
	const [isErrorScreen, setIsErrorScreen] = useState(false);

	if (isErrorScreen) return (
		<>
			<ImportErrors />
			<Box sx={{ flexDirection: "row-reverse" }} className='margin-top-16' display="flex">
				<Button
					color='primary'
					variant='contained'
					onClick={() => setIsErrorScreen(false)}
				>
					{t("dataImport:goBack")}
				</Button>
			</Box>
		</>
	)

	return <FormImport
		accept=".csv"
		labelFormFile={t('dataImport:documents.panelImport')}
		labelFormFileText={t("dataImport:documents.panelImportButton")}
		labelFileAttachments={t('dataImport:documents.panelReceipt')}
		labelFileAttachmentsText={t("dataImport:documents.panelReceiptButton")}
		setIsImportScreen={setIsImportScreen}
		onSubmit={(values: TDataImport) => {
			onImportSubmit(values);
			setIsErrorScreen(true);
		}}
	/>
}
export default Import;