import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import List from "./List";
import Search from "./Search";
import ScreenTemplate from "src/components/Screen";
import { usePagination } from "src/hooks/pagination";
import { useRegisterDefault } from "src/hooks";

import { fetchRequestLog } from "src/core/store/modules/request-log/thunk";
import {
	getListFiltersRequestLog,
	getStatusRequestLog as getStatus,
	getErrorMessageRequestLog as getErrorMessage,
} from "src/core/store/modules/request-log/selector";

const RequestLogs = () => {
	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();

	const filters = useSelector(getListFiltersRequestLog);

	useRegisterDefault({
		action: "requestLog",
		getStatus,
		getErrorMessage,
		route: "",
		updateInListCallback: () =>
			dispatch(fetchRequestLog({ page, pageSize, ...filters })),
	});

	useEffect(() => {
		if (JSON.stringify(filters) !== "{}")
			dispatch(fetchRequestLog({ page, pageSize, ...filters }));
	}, [dispatch, page, pageSize, filters]);

	useEffect(() => {
		if(Object.keys(filters).length === 0){}
		dispatch(fetchRequestLog({ page, pageSize}));
	
	}, [page, pageSize])

	return (
		<ScreenTemplate>
			<Search/>
			<List/>
		</ScreenTemplate>
	);
};

export default RequestLogs;
