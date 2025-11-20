import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
// import { PayloadAction } from '@reduxjs/toolkit';

import { TReportComponent } from 'src/core/models/reports';
import { useHandleRequestError } from 'src/hooks';
import { fetchReportExcelFile } from 'src/core/store/modules/report/thunks';
import { getHasItemReportConfiguration } from 'src/core/store/modules/report-configuration/selectors';
import { TReportFilterField } from 'src/core/models/report-configuration';
import { AppDispatch } from 'src/core/store';
import { TOptionsSelect } from 'src/components/form';
import { STATUS_FLOW } from 'src/screen/goods-and-guarantees/constants';
import { useParams } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom"
import { getStatusReports, getErrorReports } from "src/core/store/modules/report/selectors"

export const statusFlowOptions: TOptionsSelect[] = [
	{label: "Aprovado", value: STATUS_FLOW.NONE},
	{label: "Solicitação cancelada", value: STATUS_FLOW.REJECTED_DEFINITIVE},
	{label: "Aprovado adv. Interno / Garantia disponibilizada", value: STATUS_FLOW.APPROVED_DEFINITIVE},
	{label: "Devolvido", value: STATUS_FLOW.RETURNED},
	{label: "Solicitado / Garantia solicitada", value: STATUS_FLOW.REQUESTED},
	{label: "Validado controle jurídico / Minuta disponibilizada", value: STATUS_FLOW.IN_REVIEW},
	{label: "Aguardando minuta final", value: STATUS_FLOW.APPROVED_DRAFT},
	{label: "Minuta final devolvida / Bem não disponível", value: STATUS_FLOW.RETURNED_DRAFT},
	{label: "Minuta final em análise", value: STATUS_FLOW.IN_REVIEW_DRAFT},
]
type GenerateReportProps = {
	reportType: TReportComponent;
}

export const useGenerateReport = ({ reportType }: GenerateReportProps) => {
	const [isGeneratingReport, setIsGeneratingReport] = useState(false);
	const filterId = Number(useParams<{ id: string }>().id)
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory()

	const dispatch = useDispatch<AppDispatch>();
	const { showRequestError } = useHandleRequestError()
	const { values, setSubmitting } = useFormikContext<any>();
	const {
		location: { pathname },
	} = useHistory();

	const hasItem = useSelector(getHasItemReportConfiguration);
	const status = useSelector(getStatusReports);
	const error = useSelector(getErrorReports) as any;

	useEffect(() => {
		if (status === "failure") {
			setSubmitting(false);
			setIsGeneratingReport(false)
			showRequestError(error)
		}
		if (status === "added") {
			if(isGeneratingReport === false) return;

			enqueueSnackbar(`Relatorio gerado com sucesso!`,
			{ variant: "success" })
			setIsGeneratingReport(false)
			window.open("/relatorios/gerados", "_blank")?.focus();
		}
	}, [status, error, enqueueSnackbar, setSubmitting, history, showRequestError]);

	const generateReport = useCallback(async (customFields: TReportFilterField[]) => {

		setIsGeneratingReport(true);
		const  normalizedValues = {...values}

		if (normalizedValues?.folderNumber)  normalizedValues.folderNumber =  normalizedValues.folderNumber.split(";")
		
		if(reportType === 2 && values.statusApprovalIds?.length !== 0){
			 normalizedValues.statusApprovalId = values?.statusApprovalId[0]; 
		}

		if(reportType === 19 && values.statusApprovalIds?.length !== 0){ 
			normalizedValues.statusApprovalIds = [values.statusApprovalIds]
		}

		const { meta } = await dispatch(fetchReportExcelFile({
			isNew: !hasItem,
			reportType,
			reportParams:  normalizedValues as any,
			customFields,
			filterId: isNaN(filterId) ? null : filterId,

		})) as any
		
			setIsGeneratingReport(false);
			if(meta?.requestStatus !== 'rejected'){
				window.open("/relatorios/gerados", "_blank")?.focus();
			}
	}, [
		values,
		dispatch,
		filterId,
		reportType,
		hasItem
	])

	return { generateReport, isGeneratingReport }
}