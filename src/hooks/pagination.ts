import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { actions } from "src/core/store";
import { initialState } from "src/core/store/modules/pagination";
import { getPagination } from "src/core/store/modules/pagination/selectors";

export const usePagination = () => {
	const dispatch = useDispatch()
	const { pathname } = useLocation()

	const { page, pageSize, pageCount, lastPath, itemCount } = useSelector(getPagination)

	useEffect(() => {
		if (lastPath !== pathname) {
			dispatch(actions.pagination.clear())
			dispatch(actions.pagination.setLastPath(pathname))
		}
	}, [dispatch, pathname, lastPath]);

	if (lastPath === pathname) return {
		page,
		pageSize,
		pageCount,
		lastPath,
		itemCount,
	}
	else return initialState
};
