import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { OCCURRENCE_TYPE, STATUS_FLOW } from "../constants";

const isEditableForLegal = [STATUS_FLOW.PENDING_LEGAL, STATUS_FLOW.RETURNED];

const isEditableForCCJ = [
	STATUS_FLOW.PENDING_CCJ,
	STATUS_FLOW.IN_VALIDATION,
	STATUS_FLOW.IN_UNLOCK,
];

const useFormPermission = () => {
	const location = useLocation();
	const { id } = useSelector(getDataCurrentUser);

	const isCCJ = location.pathname.includes("avaliacao");
	const isLegal = location.pathname.includes("solicitacao");

	const isEditable = useCallback(
		(
			statusFlowId: STATUS_FLOW,
			occurrenceType?: OCCURRENCE_TYPE | "",
			internalLawyer?: number,
			reponsibleOffice?: number
		) => {
			if (isLegal && occurrenceType === OCCURRENCE_TYPE.JUDICIAL_BLOCK) {
				return internalLawyer === id || reponsibleOffice === id
			}

			return isLegal
				? isEditableForLegal.includes(statusFlowId)
				: isEditableForCCJ.includes(statusFlowId);
		},
		[id, isLegal]
	);

	return {
		isEditable,
		isCCJ,
		isLegal,
	};
};

export default useFormPermission;
