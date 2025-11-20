import ScreenTemplate from "src/components/Screen";
import Search from "./Search";
import List from "./List";
import { useHistory } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getBackgroundWorkerImport } from "src/core/store/modules/background-worker-import/thunks";
import Pagination from "../../../components/Pagination";

const ExecutionMonitor = () => {

	const formRef = useRef<{ values: any }>(null);
	const [data, setData] = useState([]);
	const [pageCurrent, setPageCurrent] = useState(1)
	const [pageCount, setPageCount] = useState(0)
	const [pageSize, setPageSize] = useState(10)

	const {
		location: { pathname },
	} = useHistory();
	const dispatch = useDispatch();

	const onSubmit = useCallback(async (values) => {
		const { payload } = (await dispatch(
			getBackgroundWorkerImport(values)
		)) as any;
	
		setData(payload?.items)
		setPageCount(payload?.pageCount)
	}, [dispatch]);

	const getList = async () => {
		const { payload } = await (dispatch(getBackgroundWorkerImport({...formRef.current?.values, page: pageCurrent, pageSize}))) as any;
		setData(payload?.items)
		setPageCount(payload?.pageCount)
	}

	useEffect(() => {
		getList();
	}, [pageCurrent, pageSize, setPageCurrent, setPageSize])

	return (
		<ScreenTemplate>
		<Search
		formRef={formRef} 
		setRequest={onSubmit} />
		<List 
		formRef={formRef} 
		setRequest={onSubmit} 
		data={data} 
		setData={setData}
		setPageCount={setPageCount}
		pathname={pathname} />
		<Pagination
		page={pageCurrent}
		pageCount={pageCount}
		pageSize={pageSize}
		onChangePageSize={setPageSize}
		onChangePage={setPageCurrent}
		/>
		</ScreenTemplate>
	);
}
export default ExecutionMonitor;