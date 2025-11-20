import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
	ACCOUNTABILITY_SITUATION,
	ACCOUNTABILITY_STATUS,
	approverAccountabilityStatus,
	requesterAccountabilityStatus,
} from "../../constants";

const useFormPermission = () => {
	const { pathname } = useLocation();

	const isRequester = pathname.includes("solicitacao");
	const isApprover = pathname.includes("avaliacao");

	const isRejected = useCallback(
		(status: ACCOUNTABILITY_SITUATION) =>
			status === ACCOUNTABILITY_SITUATION.REJECTED,
		[]
	);
	const isOfficePending = useCallback(
		(status: ACCOUNTABILITY_SITUATION) =>
			status === ACCOUNTABILITY_SITUATION.OFFICE_PENDING ,
		[]
	);
	const isPending = useCallback(
		(status: ACCOUNTABILITY_SITUATION) =>
			status === ACCOUNTABILITY_SITUATION.PENDING,
		[]
	);

	const isAccountabilityPending = useCallback(
		(statusFlowId: ACCOUNTABILITY_STATUS) =>
			statusFlowId === ACCOUNTABILITY_STATUS.PENDING,
		[]
	);

	const canEditEvaluationForm = useCallback(
		(
			statusFlowId: ACCOUNTABILITY_STATUS,
			status: ACCOUNTABILITY_SITUATION,
			isDefaultForm = true
		) => {
			if (isDefaultForm)
				return isApprover && statusFlowId !== ACCOUNTABILITY_STATUS.DEAD;
			if (status === ACCOUNTABILITY_SITUATION.PENDING) return true;
			if (isApprover && statusFlowId === ACCOUNTABILITY_STATUS.OVERTURNED) return false
			return (
				isApprover &&
				(approverAccountabilityStatus.includes(statusFlowId) ||
					(isOfficePending(status) && !isAccountabilityPending(statusFlowId)) ||
					(isPending(status) && isAccountabilityPending(statusFlowId))) 
			);
		},
		[isApprover, isOfficePending, isAccountabilityPending, isPending]
	);

	const canEditRequesterForm = useCallback(
		(
			statusFlowId: ACCOUNTABILITY_STATUS,
			status: ACCOUNTABILITY_SITUATION,
			isDefaultForm = true
		) => {
			return (
				isRequester &&
				!isDefaultForm &&
				(requesterAccountabilityStatus.includes(statusFlowId) ||
					(isOfficePending(status) && isAccountabilityPending(statusFlowId)))
			);
		},
		[isRequester, isOfficePending, isAccountabilityPending]
	);

	const canEdit = useCallback(
		(
			statusFlowId: ACCOUNTABILITY_STATUS,
			status: ACCOUNTABILITY_SITUATION,
			isDefaultForm = true
		) => {
			return (
				!isRejected(status) &&
				(canEditEvaluationForm(statusFlowId, status, isDefaultForm) ||
					canEditRequesterForm(statusFlowId, status, isDefaultForm))
			);
		},
		[isRejected, canEditEvaluationForm, canEditRequesterForm]
	);

	return {
		isRequester,
		isApprover,
		canEdit,
		canEditEvaluationForm,
		canEditRequesterForm,
	};
};

export default useFormPermission;
