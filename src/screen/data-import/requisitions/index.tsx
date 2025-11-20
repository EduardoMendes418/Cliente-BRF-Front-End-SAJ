import ScreenTemplate from "src/components/Screen";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import {
	getDataImportFilters,
	getDataImportStatus,
} from "src/core/store/modules/data-import/selectors";
import { useEffect, useRef, useState } from "react";
import { AppDispatch, actions } from "src/core/store";
import useEmitSnackbarStatus from "../hooks/useEmitSnackbarStatus";
import { getPagination } from "src/core/store/modules/pagination/selectors";
import { useHistory } from "react-router-dom";
import {
	fetchRequest,
	generateRequisition,
	importMultipleFiles,
} from "src/core/store/modules/data-import/thunk";
import List from "./List";
import Pagination from "src/components/Pagination";
import { useTranslation } from "src/locale/i18n";
import FileSaver from "file-saver";
import { convertToBlob, convertToBlobCSV } from "src/core/utils/func";
import { Button } from "src/components/button";
import { MULTIPLE_FILES_TYPE, TDataImport, TDataImportRequestFilter } from "src/core/models/data-import";
import ImportErrors from "../components/ImportErrors";
import FormImportMultipleAttachmentsRequest from "../components/FormImportMultipleAttachmentsRequest";

const DataImportRequisitions = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const {
		location: { pathname },
	} = useHistory();
	const history = useHistory();
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [data, setData] = useState<any>();
	const [firstLoad, setFirstLoad] = useState<boolean>(true);

	const status = useSelector(getDataImportStatus);
	const formRef = useRef<{ values: TDataImportRequestFilter }>(null);

	const filters = useSelector(getDataImportFilters);
	const pagination = useSelector(getPagination);

	useEmitSnackbarStatus();
	useEffect(() => () => dispatch(actions.dataImport.clear()), [dispatch]);

	useEffect(() => {
		if ((filters as any)[pathname] && Object.entries((filters as any)[pathname]).length > 0 && firstLoad !== true) {
			setFirstLoad(false)
			dispatch(
				fetchRequest({
					...(filters as any)[pathname],
					page: pagination.page !== 0 ? pagination.page : 1,
					pageSize: pagination.pageSize,
				})
			);
		} else {
			dispatch(actions.dataImport.clear())
		}
	
	}, [dispatch, filters, pathname, pagination]);

	const onGenerateSpreadSheet = async () => {
		setSubmitting(true);
		const { payload, meta } = await dispatch(
			generateRequisition({
				...(filters as any)[pathname],
				notPaginate: pagination.itemCount > 0 ? true : null,
			})
		);

		if (meta.requestStatus !== "rejected") {
			FileSaver.saveAs(convertToBlob(payload), "carga-requisicoes-template");
			
		}
		setSubmitting(false);
	};

	const onImport = async (values: TDataImport) => {
		const payload = await dispatch(importMultipleFiles({
			...values,
			type: MULTIPLE_FILES_TYPE.REQUISITIONS
		}))
		try {
			const data = JSON.parse(payload?.payload)
			setData({
				payload: data
			})
		} catch (error) {
			if (payload?.payload?.logs) {
				setData({
					payload: payload?.payload
				})
			} else {
				console.error("Lista de erros recebido não é um json")
			}
		}
		history.push(`/carga-de-dados/monitor-de-execucao`);
	}

	return (
		<ScreenTemplate>
			<Search
				loading={status === "fetching" || status === "saving"}
				formRef={formRef}
				firstLoad={setFirstLoad}
			/>
			<List />
			<Pagination />
			<FormImportMultipleAttachmentsRequest
				accept=".xlsx, .csv"
				labelFormFile="Importação de Requisições"
				labelFileAttachments="Anexo de Requisições"
				fileName="carga-requisicoes-template.csv"
				onSubmit={onImport}
				button={
					<Button
						color="primary"
						variant="contained"
						onClick={onGenerateSpreadSheet}
						submitting={submitting}
						text={t("dataImport:common.generateSpreadsheet")}
					/>
				}
			/>
			<ImportErrors response={data} />
		</ScreenTemplate>
	);
};

export default DataImportRequisitions;
