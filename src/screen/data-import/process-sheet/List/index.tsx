import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FileSaver from 'file-saver';
import { Box } from '@material-ui/core';

import { useTranslation } from 'src/locale/i18n';
import ScreenTemplate from 'src/components/Screen';
import { modal } from 'src/components/modals';
import { Button } from 'src/components/button';

import {
	getDataImportList,
	getDataImportStatus,
	getDataImportFeedbackErrors,
} from 'src/core/store/modules/data-import/selectors';
import { generateProcessPartiesSheetCsv, generateProcessSheetCsv, importSingleFile } from 'src/core/store/modules/data-import/thunk';
import { SINGLE_FILE_TYPE, TDataImportProcessSheetFilters } from 'src/core/models/data-import';
import { actions, AppDispatch } from 'src/core/store';
import { convertToBlob, convertToBlobCSV } from 'src/core/utils/func';
import { useHandleRequestError } from 'src/hooks';
import useBoolean from 'src/hooks/useBoolean';
import useProcessFilterOptions from 'src/hooks/useProcessFilterOptions';
import { useSnackbar } from 'notistack';

import useEmitSnackbarStatus from '../../hooks/useEmitSnackbarStatus';
import ImportErrors from '../../components/ImportErrors'
import ActionModal, { MODEL_TYPE } from './ActionModal';
import Search from './Search'
import List from './List';

const ProcessSheet = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();
	const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);

	const { showRequestError } = useHandleRequestError();
	const { enqueueSnackbar } = useSnackbar();

	const options = useProcessFilterOptions();

	const [isErrorScreen, { setTrue: showErrorScreen, setFalse: hideErrorScreen }] = useBoolean(false);
	useEmitSnackbarStatus();

	const status = useSelector(getDataImportStatus);
	const list = useSelector(getDataImportList);
	const importErrorsList = useSelector(getDataImportFeedbackErrors);

	const formRef = useRef<{ values: TDataImportProcessSheetFilters }>(null);

	const handleGenerateSpreadsheet = useCallback(async ({ model }: { model: MODEL_TYPE }) => {
		setIsGeneratingSheet(true)

		const values = { ...(formRef.current?.values || {}) } as TDataImportProcessSheetFilters;
		if (values.folderNumber !== '')
			values.folderNumber = String(values.folderNumber).split(";")

		const response = model === 'processSheet'
			? await dispatch(generateProcessSheetCsv(values))
			: await dispatch(generateProcessPartiesSheetCsv(values))

		if(response.type === 'data-import-process-sheet/csv/rejected'){
			setIsGeneratingSheet(false)
			return enqueueSnackbar('O filtro aplicado excedeu o limite do tempo de carregamento do servidor. Favor aplicar um filtro mais específico.', { variant: 'error' })
		}
		if (response.type.includes('fulfilled')) {
			const fileName = model === 'processSheet'
				? 'ficha_de_processos_template.xlsx'
				: 'ficha_de_processos_envolvidos_template.xlsx'

			FileSaver.saveAs(convertToBlob(response.payload) as Blob, fileName);
			
		} else {
			showRequestError(response.payload)
		}

		setIsGeneratingSheet(false)
	}, [dispatch, enqueueSnackbar, showRequestError]);

	const handleImport = useCallback(async ({ model, file }: { model: MODEL_TYPE, file?: FileList }) => {
		if (!file) return;
		const type = model === 'processSheet' ? SINGLE_FILE_TYPE.PROCESS_SHEET : SINGLE_FILE_TYPE.PROCESS_SHEET_INVOLVED;
		const payload = await dispatch(importSingleFile({ file, type })) 
		if(payload?.type === "dataImport/importSingleFile/fulfilled"){
			window.open("/carga-de-dados/monitor-de-execucao", "_blank")?.focus();
		}
	}, [dispatch]);

	const openActionModal = (action: 'import' | 'generate') => {
		const isImportAction = action === 'import'

		const onActionClick = (values: { model: MODEL_TYPE, file?: FileList }) => isImportAction
			? handleImport(values)
			: handleGenerateSpreadsheet(values)

		modal({
			title: t(`dataImport:common.${isImportAction ? 'import' : 'generate'}Spreadsheet`),
			component: <ActionModal action={action} onActionClick={onActionClick} />,
			buttons: [],
			dialogProps: { maxWidth: 'sm', showCloseButton: true, fullWidth: true },
		})
	}

	useEffect(() => {
		if (importErrorsList?.length > 0) showErrorScreen()
	}, [importErrorsList, showErrorScreen]);

	useEffect(() => dispatch(actions.dataImport.clear()), [dispatch]);

	return (
		<ScreenTemplate>
			{!isErrorScreen && (
				<>
					<Search loading={status === 'fetching' || status === 'saving'} formRef={formRef} options={options} />

					<List loading={status === 'fetching'} list={list} options={options} />

					<Box component="footer" display="flex" justifyContent="flex-end" mt={3}>
						<Button
							onClick={() => openActionModal('import')}
							text={t('dataImport:common.importSpreadsheet')}
							submitting={status === 'saving'}
							disabled={isGeneratingSheet}
						/>
						<Box ml={2}>
							<Button
								onClick={() => openActionModal('generate')}
								text={t('dataImport:common.generateSpreadsheet')}
								submitting={isGeneratingSheet}
								disabled={status === 'saving'}
							/>
						</Box>
					</Box>
				</>
			)}
			{isErrorScreen && (
				<>
					<ImportErrors />

					<Box component="footer" display="flex" justifyContent="flex-end" mt={3}>
						<Button
							onClick={hideErrorScreen}
							text={t('dataImport:goBack')}
						/>
					</Box>
				</>
			)}
		</ScreenTemplate>
	);
}

export default ProcessSheet;
