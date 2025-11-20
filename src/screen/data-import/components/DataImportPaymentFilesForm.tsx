import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Box } from '@material-ui/core';

import ScreenTemplate from "src/components/Screen";
import { useTranslation } from 'src/locale/i18n';

import Form from "src/screen/data-import/components/FormImportPaymentAttachments";
import useEmitSnackbarStatus from 'src/screen/data-import/hooks/useEmitSnackbarStatus';
import { TDataImport } from 'src/core/models/data-import';
import { importMultipleFiles } from 'src/core/store/modules/data-import/thunk';
import { actions } from 'src/core/store';

import ImportErrors from './ImportErrors';
import { TProps } from './types';
import { useHistory } from 'react-router-dom';

const DataImportPaymentFilesForm = ({ type, ...props }: TProps) => {

	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [isErrorScreen, setIsErrorScreen] = useState(false);
	const history = useHistory();

	useEmitSnackbarStatus();

	const onFormSubmit = async (values: TDataImport) => {
		setIsErrorScreen(true);
		
		await dispatch(importMultipleFiles({ type, ...values }));
		history.push(`/carga-de-dados/monitor-de-execucao`);
	};

	useEffect(() => dispatch(actions.dataImport.clear()), [dispatch]);

	return (
		<ScreenTemplate>
			{ isErrorScreen
				? (
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
				) : <Form { ...props} onSubmit={onFormSubmit} />
			}
		</ScreenTemplate>
	);
}

export default DataImportPaymentFilesForm;