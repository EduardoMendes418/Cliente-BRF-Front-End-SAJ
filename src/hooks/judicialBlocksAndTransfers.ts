import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actions } from "src/core/store";
import { getAccountingSapResponseByJudicialBlocksAndTransferId } from "src/core/store/modules/accountability/thunks";
import { getItemJudicialBlocksAndTransfers } from "src/core/store/modules/judicial-blocks-and-transfers/selectors";
import {
	fetchJudicialBlocksAndTransfersById,
	fetchJudicialBlocksAndTransfersSapResponse,
} from "src/core/store/modules/judicial-blocks-and-transfers/thunks";

export const useJudicialBlocksAndTransfersItem = (id: number) => {
	const dispatch = useDispatch();

	const item = useSelector(getItemJudicialBlocksAndTransfers);

	useEffect(() => {
		if (id) {
			dispatch(fetchJudicialBlocksAndTransfersById(id));
			dispatch(getAccountingSapResponseByJudicialBlocksAndTransferId(id))
		}

		return () => {
			dispatch(actions.judicialBlocksAndTransfers.clear());
			dispatch(actions.process.clear());
			dispatch(actions.accountability.clear());
		};
	}, [dispatch, id]);

	useEffect(() => {
		if (!!item.id) {
			dispatch(actions.process.setProcess(item.process));
			dispatch(
				fetchJudicialBlocksAndTransfersSapResponse({
					id: item.id,
					folderNumber: item.folderNumber,
				})
			);
		}
	}, [dispatch, item]);
};
