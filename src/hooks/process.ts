import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TOptionsSelect } from "src/components/form";
import { getProcessFolder } from "src/core/store/modules/process/selectors";
import { fetchFolder } from "src/core/store/modules/process/thunks";
import { getProvisionsProcesses } from "src/core/store/modules/provision-order/selectors";
import { fetchProvisionsProcessByProcessNumber } from "src/core/store/modules/provision-order/thunks";

export const useFolderNumber = (folderNumber: string) => {
	const dispatch = useDispatch();
	const folder = useSelector(getProcessFolder);

	useEffect(() => {
		dispatch(fetchFolder({ folderNumber }));
	}, [folderNumber, dispatch]);

	const options: TOptionsSelect[] = useMemo(
		() =>
			folder && folder.folderNumber
				? [{ label: folder.folderNumber, value: folder.folderNumber }]
				: [],
		[folder]
	);

	return {
		folderInfo: folder,
		folderOptions: options,
	};
};

export const useProcessNumber = (processNumber: string) => {
	const dispatch = useDispatch();
	const processes = useSelector(getProvisionsProcesses);

	useEffect(() => {
		dispatch(fetchProvisionsProcessByProcessNumber(processNumber));
	}, [dispatch, processNumber]);

	const options = useMemo<TOptionsSelect[]>(
		() =>
			processes && processes.length > 0 && processes[0].processNumber
				? [
						{
							label: processes[0].processNumber,
							value: processes[0].processNumber,
						},
				  ]
				: [],
		[processes]
	);

	return {
		processeInfo: processes?.[0],
		processeOptions: options
	}
};
