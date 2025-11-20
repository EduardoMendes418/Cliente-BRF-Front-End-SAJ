import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { TProcessFormData } from "src/core/models/process";
import {
	getProvisionsProcess,
} from "src/core/store/modules/provision-order/selectors";
import ProcessDataPanel from "src/components/ProcessDataPanel";
import { TProvisionProcess } from "src/core/models/provision-order";
import api from "src/core/api/process"

type Props = {
	processData?: TProcessFormData;
	loading?: boolean;
	full?: boolean;
	folderNumber?: string;
	doViaFolderNumber?: boolean;
	startExpanded?:boolean;
	
};

const ProcessFormData = ({ processData, loading, full = false, doViaFolderNumber, folderNumber, startExpanded = true }: Props) => {
	const dispatch = useDispatch();
	const interProcess = useSelector(getProvisionsProcess);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [process, setProcess] = useState<TProvisionProcess | null>(null);

	const doRequest = useCallback(async (folderNumber: string) => { 
		setIsLoading(true)
		const processApi = await api.getFolderSheetComponentFolderNumber(folderNumber)
		
		setProcess(processApi.data)
		setIsLoading(false)
	}, [])

	useEffect(() => {
		if (
			processData?.folderNumber !== undefined &&
			processData?.processKey.toString() !== interProcess.processNumber &&
			!doViaFolderNumber
		) {
			doRequest(processData?.folderNumber)
		}
		if (folderNumber !== undefined && doViaFolderNumber) doRequest(folderNumber);
	}, [dispatch, interProcess.folderNumber, interProcess.processNumber, processData?.folderNumber, processData?.processKey, doViaFolderNumber, folderNumber, doRequest]);

	if (process && Object.keys(process).length === 0) return null;

	if (processData?.folderNumber === undefined && !doViaFolderNumber) return null;
	if (folderNumber === undefined && doViaFolderNumber) return null;
	return (
		<ProcessDataPanel process={process} loading={isLoading} startExpanded={startExpanded} />
	);
};

export default ProcessFormData;
