import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { PayloadAction } from '@reduxjs/toolkit';

import { AppDispatch } from 'src/core/store';
import { useHandleRequestError } from 'src/hooks';

import { fetchEqualizationReportExcelFile } from 'src/core/store/modules/report/thunks';
import { useParams } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom"
import { getStatusReports, getErrorReports } from "src/core/store/modules/report/selectors"

export const useGenerateEqualizationReport = () => {
	const dispatch = useDispatch<AppDispatch>();
	const id = useParams<{ id: string }>().id
	const filterId = id === undefined ? null: Number(id)
	const { showRequestError } = useHandleRequestError();
	const { enqueueSnackbar } = useSnackbar();
	const [isGeneratingReport, setIsGeneratingReport] = useState(false);
	const history = useHistory()
	const status = useSelector(getStatusReports);
	const error = useSelector(getErrorReports) as any;

	useEffect(() => {
		if (status === "failure") {
			setIsGeneratingReport(false);
			showRequestError(error)
		}
		if (status === "added") {
			setIsGeneratingReport(false);
			enqueueSnackbar(`Relatorio gerado com sucesso!`,
			{ variant: "success" })
			window.open("/relatorios/gerados", "_blank")?.focus();
		}
	}, [status, error, enqueueSnackbar, history, showRequestError]);

	const generateReport = useCallback((ids: number[]) => {
		setIsGeneratingReport(true);

		ids.forEach((id: number) => {
			dispatch(fetchEqualizationReportExcelFile({id, filterId}))
				// .then((response: PayloadAction<any>) => {
				// 	enqueueSnackbar(
				// 		`Relatorio gerado com sucesso!`,
				// 		{ variant: "success" }
				// 	);
				// })
				// .catch((error: any) => {
				// 	showRequestError(error)
				// })
				// .finally(() => {
				// 	generatingReports -= 1;
				// 	if (generatingReports === 0) setIsGeneratingReport(false)
				// 	history.push("/relatorios/gerados")
				// })
		})
	}, [dispatch, filterId])

	return { generateReport, isGeneratingReport }
}