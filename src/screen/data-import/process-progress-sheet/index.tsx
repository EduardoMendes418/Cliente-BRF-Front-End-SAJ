import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'src/components/form';
import Attachments from 'src/components/Attachments';
import { Box, Button } from '@material-ui/core';
import { Submit } from 'src/components/button';

import { MULTIPLE_FILES_TYPE } from "src/core/models/data-import";
import {  generateProgressSheets, importMultipleFiles } from 'src/core/store/modules/data-import/thunk';
import FileSaver from 'file-saver';
import { convertToBlob, convertToBlobCSV } from 'src/core/utils/func';

import { AppDispatch } from 'src/core/store';
import { useTranslation } from 'src/locale/i18n';
import { getDataImportStatus } from 'src/core/store/modules/data-import/selectors';
import ImportErrors from '../components/ImportErrors';
import ScreenTemplate from 'src/components/Screen';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DataImportProcessProgressSheet = () => {
	const dispatch = useDispatch<AppDispatch>();

	const { t } = useTranslation();
	const status = useSelector(getDataImportStatus);
	const [isErrorScreen, setIsErrorScreen] = useState(false);
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();

	const type = MULTIPLE_FILES_TYPE.PROCESS_PROGRESS_SHEET

	 const onFormSubmit = async (values: any) => {

		const { payload } = await dispatch(importMultipleFiles({type, ...values })) as any;
		 	if(payload?.hasOwnProperty('detail') === true){
				enqueueSnackbar('Erro de importação', { variant: 'error' })
				setIsErrorScreen(true)
				return
		 	}
		 		enqueueSnackbar('Ficha do processo importada com sucesso', { variant: 'success' })
				 history.push(`/carga-de-dados/monitor-de-execucao`);
			};

	const generateTemplateFile = useCallback(async () => {
		setLoading(true);
		const { payload } = await dispatch(generateProgressSheets());
		FileSaver.saveAs(convertToBlob(payload), 'ficha_do_processo_template');
		 setLoading(false);
	}, [dispatch]);

	const initialValues = {
		formFile: [],
		formFileAnexos: []
	}

	return (
		<ScreenTemplate>
		{isErrorScreen
			? (
				<>
					<ImportErrors/>
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
			) :
		<Form
			initialValues={initialValues}
			onSubmit={onFormSubmit}
			permission
		>
			{({ handleSubmit, values }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Attachments
						name='formFile'
						id='formFile'
						multiple={false}
						accept='.xlsx'
						label={"Importação de andamento - ficha do processo"}
					/>
					<Box display='flex' justifyContent='flex-end' className='margin-top-16'>
						 <Button
							variant='outlined'
							style={{ marginRight: "16px" }}
							onClick={() => history.goBack()}
						>
							{t("dataImport:goBack")}
						</Button>
						<Button
							color='primary'
							style={{ marginRight: "16px" }}
							variant='contained'
							disabled={loading}
							onClick={generateTemplateFile}
						>
							{"Gerar planilha"}
						</Button>
						<Submit
							text={t('dataImport:common.importSpreadsheet')}
							disabled={!values.formFile.length}
							submitting={ status === 'saving' }
						/>
					</Box>
				</form>
			)}
		</Form>}
		</ScreenTemplate>
	)
}

export default DataImportProcessProgressSheet;