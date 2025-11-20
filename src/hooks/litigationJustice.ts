import {getLitigationJusticeOptions} from "../core/store/modules/litigation-justice/selectors";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchLitigationJustice} from "../core/store/modules/litigation-justice/thunks";

export const useLitigationJustice = () => {
	const options = useSelector(getLitigationJusticeOptions)
	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(fetchLitigationJustice())
	}, [dispatch])
	
	return {
		options
	}
}