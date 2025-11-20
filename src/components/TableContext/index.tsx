import { createContext, useState, ReactNode, useMemo, useContext } from "react";
import Pagination from "../Pagination";

type TAllData = {
	pageCurrent?: number;
	pageCount?: number;
	pageSize?: number;
	isLoading?: boolean;
	list?: any;
	pageItensCount?: number;
};
type TTableContexType = {
	pageCurrent: number;
	setPageCurrent: (x: any) => void;
	pageCount: number;
	setPageCount: (x: any) => void;
	pageSize: number;
	setPageSize: (x: any) => void;
	isLoading: boolean;
	setIsLoading: (x: any) => void;
	list: any[];
	setList: (x: any) => void;
	setTAllData: (x: TAllData) => void;
	pageItensCount: number;
	setItensCount: (x: number) => void;
};
const TableContex = createContext<TTableContexType>({
	pageCurrent: 1,
	setPageCurrent: (x: number) => {},
	pageCount: 0,
	setPageCount: (x: number) => {},
	pageSize: 0,
	setPageSize: (x: number) => {},
	isLoading: false,
	setIsLoading: (x: number) => {},
	list: [],
	setList: (x: any) => {},
	setTAllData: (x: TAllData) => {},
	setItensCount: (x: number) => {},
	pageItensCount: 0,
});

const TableContexComponent = ({ children }: { children: ReactNode }) => {
	const [pageCurrent, setPageCurrent] = useState(1);
	const [pageCount, setPageCount] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [pageItensCount, setItensCount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [list, setList] = useState([]);

	const setTAllData = ({
		pageCurrent,
		pageCount,
		pageSize,
		isLoading,
		list,
		pageItensCount,
	}: TAllData) => {
		if (pageCurrent !== undefined) setPageCurrent(pageCurrent);
		if (pageCount !== undefined) setPageCount(pageCount);
		if (pageSize !== undefined) setPageSize(pageSize);
		if (isLoading !== undefined) setIsLoading(isLoading);
		if (list !== undefined) setList(list);
		if (pageItensCount !== undefined) setItensCount(pageItensCount);
	};
	const value = useMemo(
		() => ({
			pageCurrent,
			setPageCurrent,
			pageCount,
			setPageCount,
			pageSize,
			setPageSize,
			isLoading,
			setIsLoading,
			setTAllData,
			list,
			setList,
			setItensCount,
			pageItensCount,
		}),
		[
			pageCurrent,
			setPageCurrent,
			pageCount,
			setPageCount,
			pageSize,
			setPageSize,
			isLoading,
			setIsLoading,
			setList,
			list,
			setItensCount,
			pageItensCount,
		]
	);
	return <TableContex.Provider value={value}>{children}</TableContex.Provider>;
};

const PaginationContext = () => {
	const { pageCurrent, setPageCurrent, pageCount, pageSize, setPageSize } =
		useContext(TableContex);
	return (
		<Pagination
			page={pageCurrent}
			pageCount={pageCount}
			pageSize={pageSize}
			onChangePageSize={(pageSize) => {
				setPageSize(pageSize);
				setPageCurrent(1);
			}}
			onChangePage={setPageCurrent}
		/>
	);
};
const usePaginationContext = () => {
	const { pageCurrent, setPageCurrent, pageCount, pageSize, setPageSize } =
		useContext(TableContex);
	return ({ pageCurrent, setPageCurrent, pageCount, pageSize, setPageSize, page:pageCurrent });
};

export default TableContexComponent;
export { TableContex, PaginationContext, usePaginationContext };

