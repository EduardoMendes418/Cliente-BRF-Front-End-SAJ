import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { getItemGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors";
import { useLocation } from "react-router-dom";

import {
	getFolder,
	getProcessIsFetching,
	getProcessStatus,
} from "src/core/store/modules/process/selectors";
import ProcessFormData from "src/screen/office-management/request-refund/Form/ProcessFormData";
import { CircularProgress } from "@material-ui/core";
import { Button } from 'src/components/button';

import ScreenTemplate from "src/components/Screen";
import Search from "./Search";
import List from "./List";
import { useRegisterDefault } from "src/hooks";
import {
	getLoadingOfficeManagementRequestRefund,
	getErrorMessageOfficeManagementRequestRefund,
} from "src/core/store/modules/office-management-request-refund/selectors";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";
import {
	getListPreRequestRefund,
	getItemOfficeManagementRequestRefund,
} from "src/core/store/modules/office-management-request-refund/selectors";
import {
	addfficeManagementRequestRefund,
	getOfficeManagementRequestRefund,
} from "src/core/store/modules/office-management-request-refund/thunks";
import { fetchProcessFolder } from "src/core/store/modules/process/thunks";
import { actions } from "src/core/store";
import { pathStage } from "../constants";
import { statusTextApprovalsFlow } from "src/core/utils/constants";
import Logs from "src/components/Logs";
import { useSnackbar } from "notistack";
import api from "src/core/api/process"
import { TProcess } from "src/core/models/process";


const RefundForm = () => {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const { pathname } = useLocation();
	const itemFolder = useSelector(getItemGoodsGuaranteesRequest);
	const processForm = useSelector(getFolder);
	const isFetching = useSelector(getProcessIsFetching);
	const isFolderClosed = useSelector(getProcessStatus);
	const list = useSelector(getListPreRequestRefund);
	const item = useSelector(getItemOfficeManagementRequestRefund);
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();
	const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);
	const [process, setProcess] = useState<TProcess>([] as any);

	const doRequest = useCallback(async (folderNumber: string) => { 
		const processApi = await api.getFolderSheetComponentFolderNumber(folderNumber)
		setProcess(processApi.data)
	}, [])
	

	const hasFolder = processForm && Object.keys(processForm).length > 0;
	const isFolderValid =
		!isFetching && ((hasFolder && !isFolderClosed) || itemFolder?.process);
	const isNew = id === "novo";
	const disabled = false;
	const folderNumber = isNew
		? itemFolder?.folderNumber ?? ""
		: item.refunds
		? item.refunds[0].folderNumber
		: "";
	const arryayPathname = pathname.split("/");
	let finalPathname = "";
	if (arryayPathname.length) {
		arryayPathname.pop();
		finalPathname = arryayPathname.join("/");
	}
	const stage = (pathStage as any)[finalPathname];
	const isReadOnly = isNew ? false : item.stage !== stage && stage === 1;
	useEffect(() => {
		if (isNew) return;
		dispatch(getOfficeManagementRequestRefund(Number(id)));
	}, [isNew, dispatch, id]);

	useEffect(() => {
		dispatch(actions.officeManagementPayment.clear());
		dispatch(fetchProcessFolder({ folderNumber }));
		doRequest(folderNumber);
		if (item.refunds)
			dispatch(
				actions.officeManagementRequestRefund.setAllPreRequestRefund(
					item.refunds
				)
			);
	}, [folderNumber, dispatch, item]);

	useRegisterDefault({
		action: "officeManagementRequestRefund",
		getStatus: getLoadingOfficeManagementRequestRefund,
		getErrorMessage: getErrorMessageOfficeManagementRequestRefund,
	});

	const handleSubmit = async () => {
		setIsGeneratingSheet(true)
		const intermediaryOBJ = {} as any;
		list.forEach((itemFolder) => {
			if (intermediaryOBJ[itemFolder.folderNumber ?? ""])
				intermediaryOBJ[itemFolder.folderNumber ?? ""].push(itemFolder);
			else intermediaryOBJ[itemFolder.folderNumber ?? ""] = [itemFolder];
		});
		const refundsPOST = [] as any;

		Object.entries(intermediaryOBJ).forEach(([key, value]) => {
			try {
				const typeValue = value as any[];
				const tempOBJ = {
					id: 0,
					aprovalStatus: 0,
					internalLawyerId: processForm.internalLawyerId,
					approverId: typeValue[0].requesterId,
					stage: 0,
					statusFlowId: STATUS_APPROVALS_FLOW.REQUESTED,
					refunds: typeValue.map((item) => ({
						areaDejur: item.areaDejur,
						areaDejurId: item.areaDejurId,
						description: item.description,
						externalOffice: item.externalOffice,
						externalOfficeId: item.externalOfficeId,
						filesSolicitation: item.filesSolicitation,
						folderNumber: item.folderNumber,
						id: item.id,
						pantryValue: item.pantryValue,
						processPartiesOther: item.processPartiesOther,
						processPartiesOtherId: item.processPartiesOtherId,
						refundSolicitationId: item.refundSolicitationId,
						registrationDate: item.registrationDate,
						requester: null,
					})),
				};
				refundsPOST.push(tempOBJ);
			} catch (error) {}
		});

		const response = await dispatch(addfficeManagementRequestRefund(refundsPOST)) as any;

		 if(response.payload.status === 201){
			enqueueSnackbar("Solicitação registrada com sucesso!", {variant: 'success'})
			history.goBack();
		 } 
		 setIsGeneratingSheet(false);
	};

	return (
		<ScreenTemplate>
			<Search readOnly={!isNew} folderNumber={folderNumber} />
			{!isFolderValid && (
				<CircularProgress className="margin-top-16 align-center" />
			)}
			{isFolderValid && processForm.folderNumber && (
				<>
					<ProcessFormData isReadOnly={isReadOnly} processData={process} />
					<List isReadOnly={isReadOnly} />
					<Logs
						logs={item?.logs}
						statusOrder={["flow"]}
						statuses={statusTextApprovalsFlow}
					/>
					{list.length !== 0 && !isReadOnly && (
						<Grid
							container
							direction="row"
							justifyContent="flex-end"
							className="margin-top-24"
						>
							<Button
								color="primary"
								type="submit"
								text="Enviar"
								variant={disabled ? undefined : "contained"}
								disabled={disabled}
								onClick={handleSubmit}
								submitting={isGeneratingSheet}
							>
								Enviar
							</Button>
						</Grid>
					)}
				</>
			)}
		</ScreenTemplate>
	);
};

export default RefundForm;
