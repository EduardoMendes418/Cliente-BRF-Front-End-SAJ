import ScreenTemplate from "src/components/Screen";
import Search from "./Search";
import List from "./List";
import useProcessFilterOptions from "src/hooks/useProcessFilterOptions";
import Form from "src/screen/data-import/components/FormImportMultipleAttachments";
import { Button } from "src/components/button";
import { useCallback, useRef, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import FileSaver from "file-saver";
import {convertToBlob, convertToBlobCSV} from "src/core/utils/func";
import { generateJudicialBlocksAndTransfersFile, generateJudicialBlocksAndTransfersList, importMultipleFiles } from "src/core/store/modules/data-import/thunk";
import { useDispatch } from "react-redux";
import { useTranslation } from "src/locale/i18n";
import { useSnackbar } from "notistack";
import { MULTIPLE_FILES_TYPE, TDataImport } from "src/core/models/data-import";

import Pagination from "../../../components/Pagination";
import ImportErrors from "src/screen/data-import/components/ImportErrors";
import { ButtonDiv, ErrorDiv } from "./styled";

const useStyles = makeStyles((theme) => ({
	button: {
		marginLeft: theme.spacing(1),
	},
}));

const DataImportAccountability = () => {
	const classes = useStyles();

	const options = useProcessFilterOptions();
	const formRef = useRef<{ values: any }>(null);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [accountabilityData, setAccountabilityData] = useState<any>()
	const { enqueueSnackbar } = useSnackbar();
	const [isErrorScreen, setIsErrorScreen] = useState(false);
	const [pageCurrent, setPageCurrent] = useState(1)
	const [pageCount, setPageCount] = useState(0)
	const [pageSize, setPageSize] = useState(10)

	const type = MULTIPLE_FILES_TYPE.JUDICIAL_BLOCKS_AND_TRANSFERS

	const onSubmit = useCallback(async (values) => {
		if(values.ids.length > 0){
			const { payload } = (await dispatch( generateJudicialBlocksAndTransfersList({...values, ids: values.ids.split(";"), pageSize: pageSize, page: pageCurrent})
		)) as any;
		setAccountabilityData(payload)
		setPageCount(payload?.pageCount)
		return 
		}
		const { payload } = (await dispatch( generateJudicialBlocksAndTransfersList({...values, pageSize: pageSize, page: pageCurrent})
		)) as any;
		setAccountabilityData(payload)
		setPageCount(payload?.pageCount)
	}, [dispatch]);

const onFormSubmit = async (values: TDataImport) => {
	const { meta } = await dispatch(importMultipleFiles({type, ...values })) as any;
	
	if (meta.requestStatus === "rejected") {
		enqueueSnackbar("Algo deu errado", { variant: "error" });
		setIsErrorScreen(true) 
	} else {
		enqueueSnackbar(t("dataImport:importErrors.importSuccess"), {
			variant: "success",
		});
		values.formFile = [];
		values.formFileAnexos = [];
	} 
};

const handleExport = async () => {
	const values = formRef?.current?.values;
	const { payload, type } = (await dispatch(generateJudicialBlocksAndTransfersFile(values))) as any;

	if (type.includes('rejected')) {
		enqueueSnackbar((payload as any).error ?? 'Erro ao gerar documento.', { variant: 'error' })
		return
	}
	
	FileSaver.saveAs(
		convertToBlob(payload),
		"carga-bloqueio-transferencias-template"
	);
	
}

	return (
		<ScreenTemplate>
			{!isErrorScreen && <>
			<Search formRef={formRef} options={options} setRequest={onSubmit} clearListData={setAccountabilityData} setPageCount={setPageCount}/>
			<List list={accountabilityData} loading={false} />
			<Pagination
			page={pageCurrent}
			pageCount={pageCount}
			pageSize={pageSize}
			onChangePageSize={setPageSize}
			onChangePage={setPageCurrent}
			/>
			<Form
				accept=".xlsx"
				labelFormFile={"Importação de bloqueios e transferências"}
				labelFileAttachments={"Anexo de bloqueios e transferências"}
				onSubmit={onFormSubmit}
				/>
				<ButtonDiv>
				<Button
						className={classes.button}
						color='primary'
						variant='contained'
						onClick={handleExport}
						style={{
							transform: "translate(-195px, -36px)"
						}}
						text="Exportar"
					/>
				</ButtonDiv>
				</>}
				{isErrorScreen && <>
				<ImportErrors/>
					<ErrorDiv>
						<Button
							className={classes.button}
							color='primary'
							variant='contained'
							onClick={() => setIsErrorScreen(false)}
							text={t("dataImport:goBack")}
						/>
					</ErrorDiv>
			</>}
		</ScreenTemplate>
	);
};

export default DataImportAccountability;