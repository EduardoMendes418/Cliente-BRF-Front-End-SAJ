import ScreenTemplate from "src/components/Screen";
import Search from "./Search";
import List from "./List";
import useProcessFilterOptions from "src/hooks/useProcessFilterOptions";
import Form from "src/screen/data-import/components/FormImportMultipleAttachments";
import { Button } from "src/components/button";
import { useCallback, useEffect, useRef, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FileSaver from "file-saver";
import { convertToBlob, convertToBlobCSV} from "src/core/utils/func";
import {
	generateAccountabilityFile,
	generateAccountabilityList,
	importMultipleFiles,
} from "src/core/store/modules/data-import/thunk";
import { useDispatch } from "react-redux";
import { useTranslation } from "src/locale/i18n";
import { useSnackbar } from "notistack";
import { MULTIPLE_FILES_TYPE, TDataImport } from "src/core/models/data-import";
import ImportErrors from "../components/ImportErrors";
import TableContexComponent, { TableContex, PaginationContext } from "src/components/TableContext";
import { ButtonDiv, ErrorDiv } from "./styled";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	button: {
		marginLeft: theme.spacing(1),
	},
}));

const DataImportAccountability = () => {
	const classes = useStyles();

	const options = useProcessFilterOptions();
	const {
		pageCurrent,
		pageCount,
		setPageCount,
		pageSize,
		setList: setAccountabilityData,
		setItensCount,
		setIsLoading
	} = useContext(TableContex);
	const formRef = useRef<{ values: any }>(null);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const history = useHistory();

	const { enqueueSnackbar } = useSnackbar();
	const [isErrorScreen, setIsErrorScreen] = useState(false);

	const type = MULTIPLE_FILES_TYPE.ACCOUNTABILITY;

	/* const getData = async (values: any) => {
		setIsLoading(true)
		if(values.ids.length > 0){
			const { payload } = (await dispatch(
				generateAccountabilityList({
					...values,
					ids: values.ids.split(";"),
					pageSize: pageSize,
					page: pageCurrent,
				})
			)) as any;
			setAccountabilityData(payload.items);
			setPageCount(payload?.pageCount);
			setItensCount(payload?.itemCount);
			setIsLoading(false)
			return

		}
		const { payload } = (await dispatch(
			generateAccountabilityList({
				...values,
				pageSize: pageSize,
				page: pageCurrent,
			})
		)) as any;

		setPageCount(payload.pageCount);
		setAccountabilityData(payload.items);
		setItensCount(payload?.itemCount);
		setIsLoading(false)

	}; */

	/* useEffect(() => {
		if (pageCount === 0) return;
		getData(formRef?.current?.values);
		
	}, [pageCurrent, pageSize, pageCount]); */

	const onSubmit = useCallback(
		async (values) => {
			setIsLoading(true)
			if(values.ids.length > 0){
				const { payload } = (await dispatch(
					generateAccountabilityList({
						...values,
						ids: values.ids.split(";"),
						pageSize: pageSize,
						page: pageCurrent,
					})
				)) as any;
				setAccountabilityData(payload.items);
				setPageCount(payload?.pageCount);
				setItensCount(payload?.itemCount);
				setIsLoading(false)
				return

			}
			
			const { payload } = (await dispatch(
				generateAccountabilityList({
					...values,
					pageSize: pageSize,
					page: pageCurrent,
				})
			)) as any;

			setAccountabilityData(payload.items);
			setPageCount(payload?.pageCount);
			setItensCount(payload?.itemCount);
			setIsLoading(false)
		}, [dispatch]
	);

	const handleExport = async () => {
		const values = formRef?.current?.values;
		setIsLoading(false)

		const { payload, type } = (await dispatch(
			generateAccountabilityFile(values)
		)) as any;

		if (type.includes("rejected")) {
			enqueueSnackbar((payload as any)?.error ?? "Erro ao gerar documento.", {
				variant: "error",
			});
			return;
		}

		FileSaver.saveAs(
			convertToBlob(payload),
			"prestação-de-contas-template"
		);
	};

	const onFormSubmit = async (values: TDataImport) => {
		const { meta } = (await dispatch(
			importMultipleFiles({ type, ...values })
		)) as any;

		if (meta.requestStatus === "rejected") {
			enqueueSnackbar("Algo deu errado", { variant: "error" });
			setIsErrorScreen(true);
		} else {
			enqueueSnackbar(t("dataImport:importErrors.importSuccess"), {
				variant: "success",
			});
			values.formFile = [];
			values.formFileAnexos = [];
			history.push(`/carga-de-dados/monitor-de-execucao`);
		}
	};

	return (
		<ScreenTemplate>
			{!isErrorScreen && (
				<>
					<Search
						formRef={formRef}
						options={options}
						setRequest={onSubmit}
						clearListData={setAccountabilityData}
						setPageCount={setPageCount}
					/>
					<List/>
					<PaginationContext />
					<Form
						accept=".xlsx"
						labelFormFile={"Importação de prestação de conta"}
						labelFileAttachments={"Anexo de prestação de conta"}
						onSubmit={onFormSubmit}
					/>
					<ButtonDiv>
						<Button
							className={classes.button}
							color="primary"
							variant="contained"
							onClick={handleExport}
							style={{
								transform: "translate(-195px, -36px)",
							}}
							text="Exportar"
						/>
					</ButtonDiv>
				</>
			)}
			{isErrorScreen && (
				<>
					<ImportErrors />
					<ErrorDiv>
						<Button
							className={classes.button}
							color="primary"
							variant="contained"
							onClick={() => setIsErrorScreen(false)}
							text={t("dataImport:goBack")}
						/>
					</ErrorDiv>
				</>
			)}
		</ScreenTemplate>
	);
};
const DataImportAccountabilityWithTableContext = ({ ...props }) => (
	<TableContexComponent>
		<DataImportAccountability {...props} />
	</TableContexComponent>
);

export default DataImportAccountabilityWithTableContext;