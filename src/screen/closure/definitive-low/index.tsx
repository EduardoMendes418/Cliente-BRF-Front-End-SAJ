import {useState, useEffect, useCallback, useRef} from "react";
import { Box, Button } from "@material-ui/core";
import { confirm } from "src/components/modals";

import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import {
	getDefinitiveLow,
	fetchProvisionAccounting,
	getExportExcelFile
} from "src/core/store/modules/provision-accounting/thunks";
import { getListFilters } from "src/core/store/modules/provision-accounting/selectors";
import { t } from "src/locale/i18n";
import ImportErrors from "src/screen/data-import/components/ImportErrors";
import { getPagination } from 'src/core/store/modules/pagination/selectors';
import Search, {dictionaryStatus, RefType} from "./Search"
import List from "./List"
import FileSaver from "file-saver";
import {convertToBlob} from "../../../core/utils/func";
import {AppDispatch} from "../../../core/store";

const DefinitiveLow = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const [response, setResponse] = useState<any>();
	const listFilters = useSelector(getListFilters);
	const { pageSize, page } = useSelector(getPagination);
	const filtersRef = useRef<RefType>(null)
	
	const getRequest = async () => {
		const isConfirmed = await confirm("Tem certeza que dezeja executar baixa definitiva");
		if (!isConfirmed) return;
		const { payload } = (await dispatch(getDefinitiveLow())) as any;
		const hasError = payload?.hasOwnProperty("error");

		if (hasError) {
			const msg = payload?.error?.detail;
			setResponse({ payload: msg });
			enqueueSnackbar(msg, { variant: "error" });
		}

		if (!hasError && payload.includes("Baixa Definitiva")) {
			enqueueSnackbar(payload, { variant: "info" });
		}
	};
	
	const exportExcelHandler = useCallback(async () => {
		let values = filtersRef.current?.getValues() ?? {}
		
		if ((values as any)['status']) {
			values = {...values, ...(dictionaryStatus as any)[(values as any)['status']]}
			delete (values as any)['status']
		}
		
		const {payload, type} = await dispatch(getExportExcelFile(values))
		if(type === 'provisionAccounting/fetchExcel/rejected')
			return enqueueSnackbar('Erro ao gerar excel', {variant: 'error'});
		return FileSaver.saveAs(convertToBlob(payload), 'BaixaDefinitiva.xlsx');
	}, [dispatch, enqueueSnackbar, filtersRef])
	
	useEffect(() => {
		dispatch(fetchProvisionAccounting({ page, pageSize, ...listFilters }));
	}, [dispatch, page, pageSize, listFilters]);

	return (
		<>
			{response !== undefined ? (
				<>
					<ImportErrors isDefinitiveLow={true} response={response} />
					<Box
						sx={{
							display: "flex",
							justifyContent: "flex-end",
							alignItems: "center",
							marginTop: "1rem",
							marginBottom: "1rem",
							marginRight: "1rem",
						}}
					>
						<Button
							color="primary"
							variant={"contained"}
							onClick={() => setResponse(undefined)}
						>
							{"Voltar"}
						</Button>
					</Box>
				</>
			) : (
				<ScreenTemplate>
					<Panel title={t("closure:definitiveLow.title")}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "flex-end",
								alignItems: "center",
								marginTop: "1rem",
								marginBottom: "1rem",
								marginRight: "1rem",
							}}
						>
							<Button
								color="primary"
								variant={"contained"}
								onClick={getRequest}
							>
								{"Executar"}
							</Button>
						</Box>
					</Panel>
					<Search ref={filtersRef} />
					<List onExportExcel={exportExcelHandler} />
				</ScreenTemplate>
			)}
		</>
	);
};

export default DefinitiveLow;
